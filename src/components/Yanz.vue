<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


export default {
  name: 'Yanz',
  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      gui: null,
      controls: null,
      childModelList: null,
      guiData: {},
      htmlData: null
    }
  },
  methods: {
    init: function() {

      //创建场景对象Scene
      this.scene = new THREE.Scene();
      let container = document.getElementById('container');
      //相机
      this.camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 1, 10000);
      // this.camera.position.y = 100;
       this.camera.position.set(292, 109, 268);//设置相机位置
      this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
      const helper = new THREE.CameraHelper( this.camera );
      // this.scene.add( helper );
        

      // 添加灯光
      //点光源
      var point = new THREE.PointLight(0x898989);
      point.position.set(400, 200, 300); //点光源位置
      this.scene.add(point); //点光源添加到场景中
      const ambientLight = new THREE.AmbientLight(0x8D073A);
      // this.scene.add(ambientLight);

      //创建渲染器对象
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true  // 如果想保存three.js canvas画布上的信息，注意设置preserveDrawingBuffer
        });
      this.renderer.setSize(container.clientWidth, container.clientHeight);//设置渲染区域尺寸
      this.renderer.setClearColor(0x696969, 1); //设置背景颜色
      this.renderer.domElement.id = 'canvas'
      container.appendChild(this.renderer.domElement);//body元素中插入canvas对象
    },
    async model() {
      const loader = new THREE.ObjectLoader()
      const object = await loader.loadAsync( 'static/json/A157.json' )
      console.log('object', object)
      object.scale.set(5000, 5000, 5000) //设置模型大小

      const box = new THREE.BoxHelper( object );
      // scene.add( object );
      // box.applyMatrix4( object.matrix );
      // scene.add( cube );
      
      let center = new THREE.Vector3();
      let centerSize = new THREE.Vector3();
      object.geometry.computeBoundingBox()
      object.geometry.boundingBox.getCenter(center)
      object.geometry.boundingBox.getSize(centerSize)
      console.log('center', center)


      const object1= await loader.loadAsync( 'static/json/A036.json' )
      console.log('object', object)
      object1.scale.set(5000, 5000, 5000) //设置模型大小
// object.geometry.merge(object1.geometry)
      this.scene.add( object )

      const box1 = new THREE.BoxHelper( object1 );
      // scene.add( object );
      // box.applyMatrix4( object.matrix );
      // scene.add( cube );
      box1.position.set(center.x, center.y, center.z);
      // object1.geometry.boundingBox.setFromCenterAndSize(center, centerSize)

      this.scene.add( object1 )
      let center1 = new THREE.Vector3();
      object1.geometry.computeBoundingBox()
      object1.geometry.boundingBox.getCenter(center1)
      console.log('center1', center1)

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
    this.createControls()
  }
}
</script>

<style scoped>
  #container {
    height: 800px;
  }
</style>
