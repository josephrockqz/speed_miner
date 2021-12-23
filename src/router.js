import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home'
import Level1 from './views/Level1.vue'
import Level2 from './views/Level2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/level1',
    name: 'Level1',
    component: Level1
  },
  {
    path: '/level2',
    name: 'Level2',
    component: Level2
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router