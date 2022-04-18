import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Untitled from '@/components/Untitled'
import Untitled2 from '@/components/Untitled2'
import Glb7728 from '@/components/Glb7728'
import FC1607 from '@/components/FC1607'
import People from '@/components/People'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Untitled',
      name: 'Untitled',
      component: Untitled
    },
    {
      path: '/Untitled2',
      name: 'Untitled2',
      component: Untitled2
    },
    {
      path: '/7728',
      name: 'Glb7728',
      component: Glb7728
    },
    {
      path: '/FC1607',
      name: 'FC1607',
      component: FC1607
    },
    {
      path: '/People',
      name: 'People',
      component: People
    }
  ]
})
