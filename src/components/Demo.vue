<template>
  <div>
    <button @click="exportHtmlData">导出</button>
    <button @click="exportRepalce">替换</button>
    <div id="container"></div>
    <div>
      <table>
        <tr>
          <th>序号</th><th>配件编号</th><th>配件图片</th><th>配件颜色</th><th>数量</th>
        </tr>
        <tr v-for="item in htmlData" :key="item.idx">
          <th>{{item.idx}}</th><th>{{item.name}}</th><th>
            <img :src="item.url" style="width:100px"/>
            </th><th>{{item.color}}</th><th>{{item.num}}</th>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader.js'
// import { LDrawUtils } from 'three/examples/jsm/utils/LDrawUtils.js'


export default {
  name: 'Demo',
  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      gui: null,
      controls: null,
      childModelList: null,
      progressBarDiv: null,
      guiData: {},
      htmlData: null
    }
  },
  methods: {
    init: function() {
      this.progressBarDiv = document.createElement( 'div' );
      this.progressBarDiv.innerText = '正在加载中...';
      this.progressBarDiv.style.fontSize = '3em';
      this.progressBarDiv.style.color = '#888';
      this.progressBarDiv.style.display = 'block';
      this.progressBarDiv.style.position = 'absolute';
      this.progressBarDiv.style.top = '50%';
      this.progressBarDiv.style.width = '100%';
      this.progressBarDiv.style.textAlign = 'center';

      //创建场景对象Scene
      this.scene = new THREE.Scene();
      let container = document.getElementById('container');
      //相机
      this.camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 1, 10000);
      // this.camera.position.y = 100;
       this.camera.position.set(150, 200, 250 );//设置相机位置
      this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
      const helper = new THREE.CameraHelper( this.camera );
      // this.scene.add( helper );
        

      // 添加灯光
      //点光源
      var point = new THREE.PointLight(0x898989);
      point.position.set(400, 200, 300); //点光源位置
      this.scene.add(point); //点光源添加到场景中
      const ambientLight = new THREE.AmbientLight(0x8D073A);
      this.scene.add(ambientLight);

      //创建渲染器对象
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true  // 如果想保存three.js canvas画布上的信息，注意设置preserveDrawingBuffer
        });
      this.renderer.setSize(container.clientWidth, container.clientHeight);//设置渲染区域尺寸
      this.renderer.setClearColor(0x696969, 1); //设置背景颜色
      this.renderer.domElement.id = 'canvas'
      container.appendChild(this.renderer.domElement);//body元素中插入canvas对象

      //辅助三维坐标系AxisHelper
      // const axisHelper = new THREE.AxisHelper(2500);
      // this.scene.add(axisHelper);

    },
    model: function() {
      let that = this
      const lDrawLoader = new LDrawLoader()
      that.updateProgressBar( 0 );
      that.showProgressBar();
      lDrawLoader.load(
        'static/mpd/demo.ldr_Packed.mpd',
        function ( gltf ) {
          that.mesh = gltf
          // that.mesh.scale.set(100, 100, 100) //设置模型大小
          console.log('that.mesh', that.mesh);
          that.mesh.userData.numConstructionSteps = that.mesh.children.length
          that.mesh.name = '全部'
          that.childModelList = []
          that.mesh.traverse(function (child) {
            if(child.type === 'Group'){
              child.userData.name = child.name
              child.userData.numConstructionSteps = child.children.length
              that.childModelList.push(child)
            }
          })
          that.scene.add( that.mesh );

          that.makeGui(that.childModelList[0].userData.name)
          that.hideProgressBar()
          // mesh.traverse(function (child) {
	        // if (child.isMesh) {
	        // 	//给模型下的Mesh添加材质颜色
          //   child.material.emissive =  child.material.color;
          //   child.material.emissiveMap = child.material.map ;
	        // }
	        // });
        },
        // called while loading is progressing
        function ( xhr ) {
          that.onProgress(xhr)
          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
          console.log( 'An error happened' , error);
        }
      )
    },
    makeGui: function(modelShowName) {
      let that = this
      let modelName = []
      this.childModelList.forEach(el => {
        modelName.push(el.userData.name)
      });
      console.log('modelName', modelName)
      that.guiData = {
        modelFileName: modelShowName,
        constructionStep: 0
      };
      if ( that.gui ) {
					that.gui.destroy();
				}
				that.gui = new GUI();
				that.gui.add( that.guiData, 'modelFileName', modelName ).name( '子模型' ).onFinishChange( function () {
					that.reloadObject(true)
				} );
        console.log(that.mesh, that.mesh.userData.numConstructionSteps)
				if ( that.mesh.userData.numConstructionSteps > 1 ) {
          that.guiData.constructionStep = that.mesh.userData.numConstructionSteps
					that.gui.add( that.guiData, 'constructionStep', 0, that.mesh.userData.numConstructionSteps, 1 ).name( '操作步骤' ).onChange( that.updateObjectsVisibility );
				} else {
					that.gui.add( that.guiData, 'constructionStep', 0, 0).name( '操作步骤' ).onChange( that.updateObjectsVisibility );
				}
    },
    reloadObject(resetCamera) {
      let that = this
      if ( that.mesh ) {
        that.scene.remove( that.mesh );
      }
      that.mesh = that.childModelList.filter(it => it.userData.name === that.guiData.modelFileName)[0]
      that.scene.add( that.mesh );
      if(that.guiData.modelFileName === '全部'){
        that.mesh.scale.set(1000, 1000, 1000) //设置模型大小
      }else{
        that.mesh.scale.set(7000, 7000, 7000) //设置模型大小
      }
      that.makeGui(that.guiData.modelFileName)
    },
    updateObjectsVisibility(){
      let that = this
      that.mesh.children.forEach((it, idx) => {
        it.visible = (idx+1) <= that.guiData.constructionStep
      })
      // that.mesh.traverse( c => {
      //   c.visible = c.userData.constructionStep <= guiData.constructionStep;
      // });
    },
    render: function() {
      requestAnimationFrame(this.render); //请求再次执行渲染函数render
      this.renderer.render(this.scene, this.camera);//执行渲染操作
    },
    // 创建控件对象
    createControls () {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    },
    exportHandler() {
      let that = this
      // 导出Excel
      import('../../static/js/export2ExcelImg').then(excel => {
        const tHeader = ['序号', '配件编号', '配件图示', '颜色', '用量']
        const filterVal = ['idx', 'name', 'url', 'color', 'num']
        const data = []
        let i = 1 ;     
        let flag = false
        that.mesh.traverse( c => {
          if(c.type === 'Mesh') {
            flag = false
            data.forEach(it => {
              if( it.name === c.name) {
                it.num += 1
                flag = true
              }
            })
            if(!flag){
              data.push({ 'idx': i++, 'name': c.name, 'url': '' , 'color': c.material.name ,'num': 1})
            }
          }
        })

        data.forEach((el, idx) => {
          that.scene.remove( that.mesh )
          that.mesh = el.mesh
          if (idx > 1) {
            that.scene.remove( data[idx-1].mesh )
          }else{
            // that.scene.remove( that.mesh )
          }
          that.scene.add( el.mesh )
          that.renderer.render(that.scene, that.camera);//执行渲染操作
          that.traverseList(el.uuid)
          // that.renderer.render(that.scene, that.camera);//执行渲染操作
          // 创建一个超链接元素，用来下载保存数据的文件
          // var link = document.createElement('a');
          // // 通过超链接herf属性，设置要保存到文件中的数据
          var canvas = that.renderer.domElement;//获取canvas对象
          // link.href = canvas.toDataURL("image/png");
          // link.download = 'threejs'+idx+'.png'; //下载文件名
          // link.click(); //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
          el.url = canvas.toDataURL("image/png")
        })
        console.log('data', data)
        // excel.export_json_to_excel2( tHeader, data, filterVal, 'Untitled' )
        excel.export2Excel(tHeader, data, 'Untitled')

        that.traverseList('', true)
      })
    },
    exportHtmlData() {
      let that = this
      that.htmlData = []
      let meshTemp = []
      let i = 1 ;     
      let flag = false
      const meshClone = that.mesh.clone(true)
      if(meshClone.children.length === 0) {
        that.renderer.render(that.scene, that.camera);//执行渲染操作
        var canvas = that.renderer.domElement;//获取canvas对象
        that.htmlData.push({ 'idx': i++, 'name': meshClone.name, 'url': canvas.toDataURL("image/png") , 'color': meshClone.material.name ,'num': 1})
      }else{
        meshClone.children.forEach(c => {
          if(c.type === 'Mesh') {
            flag = false
            that.htmlData.forEach(it => {
              if( it.name === c.name) {
                it.num += 1
                flag = true
              }
            })
            meshTemp.push(c)
            that.scene.remove( that.mesh )
            that.mesh = that.childModelList.filter(it => it.userData.name === c.userData.name)[0]
            that.scene.add( that.mesh );
            that.mesh.scale.set(7000, 7000, 7000) //设置模型大小

            that.renderer.render(that.scene, that.camera);//执行渲染操作
            var canvas = that.renderer.domElement;//获取canvas对象
            if(!flag){
              that.htmlData.push({ 'idx': i++, 'name': c.name, 'url': canvas.toDataURL("image/png") , 'color': c.material.name ,'num': 1})
            }
          }
        })
        that.childModelList.filter(it => it.userData.name === '全部')[0].children = meshTemp
        that.reloadObject(true)
      }
      console.log('htmlData', that.htmlData)
    },
    traverseList(uuid, visi = false) {
      this.mesh.children.forEach(c => {
        if(c.children.length > 0) {
          this.traverseList(c.children);
        }
        if(c.type === 'Mesh') {
          console.log('traverse', c.uuid , uuid, c.uuid === uuid)
          if(c.uuid === uuid || visi){
            c.visible = true
            console.log('traverse', c.uuid , uuid)
          }else{
            c.visible = false
          }
        }
      })
    },
    showProgressBar() {
      document.body.appendChild( this.progressBarDiv );
    },
    hideProgressBar() {
      document.body.removeChild( this.progressBarDiv );
    },
    updateProgressBar( fraction )  {
      this.progressBarDiv.innerText = '正在加载... ' + Math.round( fraction * 100, 2 ) + '%';
    },
    onProgress( xhr ) {
      console.log(xhr)
      if ( xhr.lengthComputable ) {
        this.updateProgressBar( xhr.loaded / xhr.total );
        console.log( Math.round( xhr.loaded / xhr.total * 100, 2 ) + '% downloaded' );
      }
    },
    exportRepalce() {
      
    }
  },
  mounted() {
    this.init()
    this.model()
    this.render()
    this.createControls()
  }
}
</script>

<style scoped>
  #container {
    height: 800px;
  }
</style>
