<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(container.clientWidth, container.clientHeight);//设置渲染区域尺寸
      this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
      container.appendChild(this.renderer.domElement);//body元素中插入canvas对象

      //辅助三维坐标系AxisHelper
      const axisHelper = new THREE.AxisHelper(2500);
      this.scene.add(axisHelper);

    },
    model: function() {
      let that = this
      const loader = new GLTFLoader();
      
      loader.load(
        'static/gltf/Untitled.gltf',
        function ( gltf ) {
          that.mesh = gltf.scene.children[0]
          that.scene.add( that.mesh );
          that.mesh.scale.set(3000, 3000, 3000) //设置模型大小
          that.childModelList = []
          that.mesh.traverse(function (child) {
            if(child.type === 'Object3D'){
              child.userData.numConstructionSteps = child.children.length
              that.childModelList.push(child)
            }
            // child.userData.constructionStep = child.children.length
          })
          
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
          console.log( 'An error happened' );
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
        // displayLines: true,
        // conditionalLines: true,
        // smoothNormals: true,
        constructionStep: 0
        // mergeModel: false
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
      console.log(that.mesh.children)
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
    }

  },
  mounted() {
    this.init()
    this.model()
    this.render()
    // this.makeGui()
    this.createControls()
  }
}
</script>

<style scoped>
  #container {
    height: 800px;
  }
</style>
