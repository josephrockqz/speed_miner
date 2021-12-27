<template>
    <div>
        <b-form-checkbox-group
          v-model="nightMode"
          :options="options"
          class="mb-3"
          value-field="item"
          text-field="name"
          disabled-field="notEnabled"
        ></b-form-checkbox-group>
        <div>
          <h2>Controls</h2>
          <ul>
            <li>Left click to reveal a cell</li>
            <li>Right click to place a flag to mark a mine</li>
          </ul>
        </div>
        <LevelMenu/>
    </div>
</template>

<script>
import LevelMenu from '../components/LevelMenu.vue'
import { mapActions } from 'vuex'
import store from '../store.js'

export default {
  components: {
    LevelMenu
  },
  data() {
    return {
      nightMode: [],
      options: [
        { item: 'Night Mode', name: 'Night Mode' }
      ]
    }
  },
  methods: {
    ...mapActions([
      'toggleNightMode'
    ])
  },
  watch: {
    async nightMode() {
      await store.dispatch('toggleNightMode', {
        mode_num: this.nightMode.length
      })
    }
  }
}
</script>

<style scoped>

</style>
