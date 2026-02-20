import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home'
import Level from './views/Level.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/level/:level',
    name: 'Level',
    component: Level
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
