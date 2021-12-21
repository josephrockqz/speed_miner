import Vue from 'vue'
import VueRouter from 'vue-router'
import LevelSelection from './views/LevelSelection'
import Level1 from './views/Level1.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LevelSelection',
    component: LevelSelection
  },
  {
    path: '/Level1',
    name: 'Level1',
    component: Level1
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router