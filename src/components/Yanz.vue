<template>
  <div>
    <button @click="change">转换</button>
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const ThreeBSP = require('three-js-csg')(THREE)

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
      // const loader = new THREE.ObjectLoader()
      // const A157 = await loader.loadAsync( 'static/json/parts_11103.json' )
      // const a157Group = new THREE.Group()
      // // A157.scale.set(5000, 5000, 5000) //设置模型大小
      // var center = new THREE.Vector3()
      // var centerSize = new THREE.Vector3()
      // A157.children[0].geometry.computeBoundingBox()
      // A157.children[0].geometry.boundingBox.getCenter(center)
      // A157.children[0].geometry.boundingBox.getSize(centerSize)
      // console.log(center)
      // console.log('1', A157.children[0].rotation , centerSize)
      // const a157Box = new THREE.BoxHelper( A157 );
      // a157Group.add(A157)
      // // a157Group.add(a157Box)
      
      

      // const a157AxesHelper = new THREE.AxesHelper( 50 );
      // a157Group.add(a157AxesHelper)
      // this.scene.add(a157Group)

      // const A036 = await loader.loadAsync( 'static/json/A157.json' )
      // const a036Group = new THREE.Group()
      // A036.scale.set(3000, 3000, 3000) //设置模型大小
      // // A036.position.y = center.y
      // // a036Group.position.x = 0
      // A036.geometry.computeBoundingBox()
      // // A036.geometry.boundingBox.set(A157.children[0].geometry.boundingBox.min, A157.children[0].geometry.boundingBox.max)
      // // A036.attributes.normal = A157.children[0].geometry.normal
      // // var _x = A157.children[0].geometry.boundingBox.max.angleTo(new THREE.Vector3(0,0,0));
      // // var _y = A036.geometry.boundingBox.max.angleTo(new THREE.Vector3(0,0,0));
      // // var _y = THREE.Math.radToDeg(A157.children[0].geometry.boundingBox.min.angleTo(A036.geometry.boundingBox.min));
      // // var _z = THREE.Math.radToDeg(A157.children[0].geometry.boundingBox.min.angleTo(new THREE.Vector3(0, 0 ,1)));
      // // console.log('22222', A036.rotation, _x, _y)
      // // A036.rotation.x = _x
      // // A036.rotateY(_y)
      // // A036.rotateZ(_z)
      // const a036Box = new THREE.BoxHelper( A036 );
      // // A036.rotateX(A157.children[0].rotation.x);
      // // A036.rotateY(A157.children[0].rotation.y);
      // // A036.rotateZ(A157.children[0].rotation.z);
      // // a036Group.setRotationFromEuler(new THREE.Euler( 90, 0, 0, 'XYZ' ))
      // // A036.geometry.boundingBox.setFromCenterAndSize(center, centerSize)
      // a036Group.add(A036)
      // a036Group.add(a036Box)
      // const a036AxesHelper = new THREE.AxesHelper( 50 );
      // a036Group.add(a036AxesHelper)
      // this.scene.add(a036Group)


const loader = new THREE.ObjectLoader()
      const A157 = await loader.loadAsync( 'static/json/parts_11103.json' )
const A036 = await loader.loadAsync( 'static/json/A157.json' )
const resultBSP1 = new ThreeBSP(A157)
const resultBSP2 = new ThreeBSP(A036)
      const resultBSP = resultBSP1.union(resultBSP2)
      const result = resultBSP.toMesh()
      result.geometry.computeFaceNormals()
        result.geometry.computeVertexNormals()
        this.scene.add(result)
    },

    async change() {
      console.log(this.scene)
      const a157 = this.scene.children[1]
      console.log('a157 position', a157.position.x, a157.position.y, a157.position.z)

      const a036 = this.scene.children[2]
      console.log('a036 position', a036.position.x, a036.position.y, a036.position.z)

      

      // a036.position.set(a157.position.x, a157.position.y, a157.position.z);

      // a157.children[0].geometry.computeBoundingBox()
      // const box = new THREE.Box3();
      // box.copy( a157.children[0].geometry.boundingBox ).applyMatrix4( a157.children[0].matrixWorld );
      
      // const otherGroup = new THREE.Group()
      const loader = new THREE.ObjectLoader()
      // const otherHelper = new THREE.Box3Helper( box, 0xffff00 );
      const A036 = await loader.loadAsync( 'static/json/A036.json' )
      A036.applyMatrix4( a157.children[0].children[0].matrixWorld );
      A036.applyQuaternion(a157.children[0].children[0].quaternion)
      A036.scale.set(5000, 5000, 5000) //设置模型大小
      // otherGroup.add(A036)
      // otherGroup.add(otherHelper)
      this.scene.add(A036)

      // let a157Center = new THREE.Vector3();
      // a157.geometry.computeBoundingBox()
      // a157.geometry.boundingBox.getCenter(a157Center)
      // console.log('a157 center', a157.x, a157.y, a157.z)
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
