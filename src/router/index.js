import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect:'/home',
    children:[
      {
        path:'home',
        name:'Home',
        component: ()=>import('@/views/home'),
        meta:{
          showCarousel:true,
        }
      }
    ]
  },
  {
    path: '/detail',
    component:Layout,
    redirect:'/detail/index',
    children:[
      {
        path:'index',
        name:'Detail',
        component: () => import('@/views/detail')
      }
    ]
  },
  {
    path: '/download',
    component:Layout,
    redirect:'/download/index',
    children:[
      {
        path:'index',
        name:'Download',
        component: () => import('@/views/download')
      }
    ]
  },
  {
    path: '/modeling',
    component:Layout,
    redirect:'/modeling/index',
    children:[
      {
        path:'index',
        name:'Modeling',
        component: () => import('@/views/modeling')
      }
    ]
  },
  {
    path: '/management',
    component:Layout,
    redirect:'/management/index',
    children:[
      {
        path:'index',
        name:'Management',
        component: () => import('@/views/management')
      }
    ]
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
