import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons'
import { faFlag } from '@fortawesome/free-solid-svg-icons'
import { faHandPointer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

library.add(faHome)
library.add(faRedo)
library.add(faVolumeUp)
library.add(faVolumeMute)
library.add(faFlag)
library.add(faHandPointer)

Vue.component('font-awesome-icon', FontAwesomeIcon)

store.dispatch('initFlagMode')

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
