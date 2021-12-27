<template>

  <div>

    <!-- Night Mode Checkbox -->
    <b-checkbox v-model="nightMode">Night Mode</b-checkbox>

    <!-- Controls -->
    <div>
      <h2>Controls</h2>
      <ul>
        <li>Left click to reveal a cell</li>
        <li>Right click to place a flag to mark a mine</li>
      </ul>
    </div>

    <!-- Level Menu Component -->
    <LevelMenu/>
  </div>

</template>

<script>
import LevelMenu from '../components/LevelMenu.vue'
import { mapState, mapActions } from 'vuex'
import store from '../store.js'

export default {
  components: {
    LevelMenu
  },
  computed: {
    ...mapState({
      backgroundColor: 'backgroundColor'
    })
  },
  data() {
    return {
      nightMode: false,
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
  mounted() {
    if (this.backgroundColor == '#e9e9e9') {
      this.nightMode = false
    } else {
      this.nightMode = true
    }
  },
  watch: {
    async nightMode() {
      await store.dispatch('toggleNightMode', {
        night_mode_bool: this.nightMode
      })
    }
  }
}
</script>

<style scoped>

</style>
