<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
  import * as Three from 'three'
  import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

  export default {
    name: 'People',
    data() {
      return {
        camera: null,
        scene: null,
        renderer: null,
        mesh: null,
        controls:null

      }
    },
    methods: {
      init: function() {
        //创建场景对象Scene
        this.scene = new Three.Scene();

        let container = document.getElementById('container');
        //相机
        this.camera = new Three.PerspectiveCamera(60, container.clientWidth/container.clientHeight, 1, 1000);
        this.camera.position.set(292, 109, 268);//设置相机位置
        this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)

        //正方形
        // let geometry = new Three.BoxGeometry(100, 100, 100);
        // let geometry = new Three.SphereGeometry(60, 40, 40)
        // let material = new Three.MeshLambertMaterial({
        //   color: 0x0000ff
        // });
        // this.mesh = new Three.Mesh(geometry, material);
        // this.scene.add(this.mesh);



       // 头部网格模型和组
        var headMesh = this.sphereMesh(10, 0, 0, 0);
        headMesh.name = "脑壳"
        var leftEyeMesh = this.sphereMesh(1, 8, 5, 4);
        leftEyeMesh.name = "左眼"
        var rightEyeMesh = this.sphereMesh(1, 8, 5, -4);
        rightEyeMesh.name = "右眼"
        var headGroup = new Three.Group();
        headGroup.name = "头部"
        headGroup.add(headMesh, leftEyeMesh, rightEyeMesh);
        // 身体网格模型和组
        var neckMesh = this.cylinderMesh(3, 10, 0, -15, 0);
        neckMesh.name = "脖子"
        var bodyMesh = this.cylinderMesh(14, 30, 0, -35, 0);
        bodyMesh.name = "腹部"
        var leftLegMesh = this.cylinderMesh(4, 60, 0, -80, -7);
        leftLegMesh.name = "左腿"
        var rightLegMesh = this.cylinderMesh(4, 60, 0, -80, 7);
        rightLegMesh.name = "右腿"
        var legGroup = new Three.Group();
        legGroup.name = "腿"
        legGroup.add(leftLegMesh, rightLegMesh);
        var bodyGroup = new Three.Group();
        bodyGroup.name = "身体"
        bodyGroup.add(neckMesh, bodyMesh, legGroup);
        // 人Group
        var personGroup = new Three.Group();
        personGroup.name = "人"
        personGroup.add(headGroup, bodyGroup)
        personGroup.translateY(50)
        this.scene.add(personGroup);


        
        // 立方体网格模型
        // var geometry1 = new Three.BoxGeometry(100, 100, 100);
        // var material1 = new Three.MeshLambertMaterial({
        //   color: 0x0000ff
        // }); //材质对象Material
        // var mesh1 = new Three.Mesh(geometry1, material1); //网格模型对象Mesh
        // this.scene.add(mesh1); //网格模型添加到场景中

        // // 球体网格模型
        // var geometry2 = new Three.SphereGeometry(60, 40, 40);
        // var material2 = new Three.MeshLambertMaterial({
        //   color: 0xff00ff
        // });
        // var mesh2 = new Three.Mesh(geometry2, material2); //网格模型对象Mesh
        // mesh2.translateY(120); //球体网格模型沿Y轴正方向平移120
        // this.scene.add(mesh2);

        // // 圆柱网格模型
        // var geometry3 = new Three.CylinderGeometry(50, 50, 100, 25);
        // var material3 = new Three.MeshPhongMaterial({
        //   color: 0xffff00,
        //   specular:0x4488ee,
        //   shininess:12
        // });
        // var mesh3 = new Three.Mesh(geometry3, material3); //网格模型对象Mesh
        // // mesh3.translateX(120); //球体网格模型沿Y轴正方向平移120
        // mesh3.position.set(120,0,0);//设置mesh3模型对象的xyz坐标为120,0,0
        // this.scene.add(mesh3); //

        //点光源
        var point = new Three.PointLight(0xffffff);
        point.position.set(400, 200, 300); //点光源位置
        this.scene.add(point); //点光源添加到场景中
        //环境光
        var ambient = new Three.AmbientLight(0x444444);
        this.scene.add(ambient);


        //创建渲染器对象
        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);//设置渲染区域尺寸
        this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
        container.appendChild(this.renderer.domElement);//body元素中插入canvas对象

        //辅助三维坐标系AxisHelper
        this.axisHelper = new Three.AxisHelper(250);
        this.scene.add(this.axisHelper);

      },
      render:function(){
        //this.mesh.rotation.x+=0.01

        requestAnimationFrame(this.render); //请求再次执行渲染函数render
        this.renderer.render(this.scene,this.camera);//执行渲染操作
      },
      // 创建控件对象
      createControls () {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      },
      sphereMesh(R, x, y, z) {
        var geometry = new Three.SphereGeometry(R, 25, 25); //球体几何体
        var material = new Three.MeshPhongMaterial({
          color: 0x0000ff
        }); //材质对象Material
        var mesh = new Three.Mesh(geometry, material); // 创建网格模型对象
        mesh.position.set(x, y, z);
        return mesh;
      },
      cylinderMesh(R, h, x, y, z) {
        var geometry = new Three.CylinderGeometry(R, R, h, 25, 25); //球体几何体
        var material = new Three.MeshPhongMaterial({
          color: 0x0000ff
        }); //材质对象Material
        var mesh = new Three.Mesh(geometry, material); // 创建网格模型对象
        mesh.position.set(x, y, z);
        return mesh;
      }

    },
    mounted() {
      this.init();
      this.render();
      this.createControls()
    }
  }
</script>
<style scoped>
  #container {
    height: 800px;
  }
</style>