<template>
  <div>
    <button @click="exportHandler">导出</button>
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'


export default {
  name: 'Untitled',
  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      gui: null,
      controls: null,
      childModelList: null,
      guiData: {}
    }
  },
  methods: {
    init: function() {
      //创建场景对象Scene
      this.scene = new THREE.Scene();
      let container = document.getElementById('container');
      //相机
      this.camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.5, 1000);
      // this.camera.position.y = 100;
      this.camera.position.set(292, 109, 268);//设置相机位置
      this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
      const helper = new THREE.CameraHelper( this.camera );
      // this.scene.add( helper );
        

      // 添加灯光
      //点光源
      var point = new THREE.PointLight(0xffffff);
      point.position.set(400, 200, 300); //点光源位置
      this.scene.add(point); //点光源添加到场景中
      const ambientLight = new THREE.AmbientLight(0x444444);
      this.scene.add(ambientLight);

      //创建渲染器对象
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true  // 如果想保存three.js canvas画布上的信息，注意设置preserveDrawingBuffer
        });
      this.renderer.setSize(container.clientWidth, container.clientHeight);//设置渲染区域尺寸
      this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
      this.renderer.domElement.id = 'canvas'
      container.appendChild(this.renderer.domElement);//body元素中插入canvas对象

      //辅助三维坐标系AxisHelper
      // const axisHelper = new THREE.AxisHelper(2500);
      // this.scene.add(axisHelper);

    },
    model: function() {
      let that = this
      const loader = new GLTFLoader()
      let dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath("static/gltf/draco/gltf/")
      dracoLoader.setDecoderConfig({ type: "js" })
      dracoLoader.preload()
      loader.setDRACOLoader(dracoLoader)
      //设置解压库文件路径
      // THREE.DRACOLoader.setDecoderPath('static/gltf/');
      // loader.setDRACOLoader(new THREE.DRACOLoader())
      loader.load(
        'static/gltf/untitled2.gltf',
        function ( gltf ) {
          that.mesh = gltf.scene
          that.scene.add( that.mesh );
          that.mesh.scale.set(2, 2, 2) //设置模型大小
          console.log('that.mesh', that.mesh);
          that.mesh.userData.numConstructionSteps = that.mesh.children.length
          that.childModelList = [{'name': '全部'}]
          // that.mesh.traverse(function (child) {
          //   if(child.type === 'Object3D'){
          //     child.userData.numConstructionSteps = child.children.length
          //     that.childModelList.push(child)
          //   }
          // })
          that.makeGui(that.childModelList[0].name)
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
          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
          console.log( 'An error happened', error );
        }
      )
    },
    makeGui: function(modelShowName) {
      let that = this
      let modelName = []
      this.childModelList.forEach(el => {
        modelName.push(el.name)
      });
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
      that.mesh = that.childModelList.filter(it => it.name === that.guiData.modelFileName)[0]
      that.scene.add( that.mesh );
      that.mesh.scale.set(3000, 3000, 3000) //设置模型大小
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
        const tHeader = ['序号', '配件编号', '配件图示', '配件名称', '材料', '颜色', '用量']
        const filterVal = ['idx', 'name', 'url', '', '', '', 'num']
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
              data.push({ 'idx': i++, 'name': c.name, 'url': '' ,'num': 1 , 'uuid': c.uuid})
            }
          }
        })

        data.forEach((el, idx) => {
          // that.scene.remove( that.mesh )
          // that.mesh = el.mesh
          // if (idx > 1) {
          //   that.scene.remove( data[idx-1].mesh )
          // }else{
          //   // that.scene.remove( that.mesh )
          // }
          // that.scene.add( el.mesh )
          // that.renderer.render(that.scene, that.camera);//执行渲染操作
          that.traverseList(el.uuid)
          that.renderer.render(that.scene, that.camera);//执行渲染操作
          // 创建一个超链接元素，用来下载保存数据的文件
          // var link = document.createElement('a');
          // // 通过超链接herf属性，设置要保存到文件中的数据
          var canvas = that.renderer.domElement;//获取canvas对象
          // link.href = canvas.toDataURL("image/png");
          // link.download = 'threejs'+idx+'.png'; //下载文件名
          // link.click(); //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
          // el.url = canvas.toDataURL("image/png")
          el.url = 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2801998497,4036145562&fm=27&gp=0.jpg'
        })
        console.log('data', data)
        // excel.export_json_to_excel2( tHeader, data, filterVal, 'Untitled' )
        excel.export2Excel(tHeader, data, 'Untitled')

        that.traverseList('', true)
      })
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
