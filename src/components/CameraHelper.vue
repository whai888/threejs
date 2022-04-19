<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'CameraHelper',
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
      this.camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 1, 1000);
      // this.camera.position.y = 100;
       this.camera.position.set(292, 109, 268);//设置相机位置
      this.camera.lookAt(0, 0, 0); //设置相机方向(指向的场景对象)
      const helper = new THREE.CameraHelper( this.camera );
      this.scene.add( helper );

      // 屏幕相机
      // this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 300)
      // this.camera.position.set(-1, 1.2, 1.5)
      // this.camera.lookAt(0, 0, 0)

      // // 带相机助手的相机
      // const camera1 = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 1, 1000);
      // camera1.position.set(-1, 1.2, 1.5)
      // this.camera.lookAt(0, 0, 0)
      // let cameraHelper = new THREE.CameraHelper(camera1)
      // this.scene.add(cameraHelper)
        

      // 添加灯光
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
      this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
      this.renderer.domElement.id = 'canvas'
      container.appendChild(this.renderer.domElement);//body元素中插入canvas对象

      //辅助三维坐标系AxisHelper
      const axisHelper = new THREE.AxesHelper(2500)
      this.scene.add(axisHelper);

      const geometry = new THREE.BoxGeometry( 100, 100, 100 );
      const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
      const cube = new THREE.Mesh( geometry, material );
      this.scene.add( cube );

    },
    render: function() {
      requestAnimationFrame(this.render); //请求再次执行渲染函数render
      this.renderer.render(this.scene, this.camera);//执行渲染操作
    }
  },
  mounted() {
    this.init()
    this.render()
  }
}
</script>

<style scoped>
  #container {
    height: 800px;
  }
</style>
