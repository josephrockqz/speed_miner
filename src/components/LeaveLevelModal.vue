<template>
    <b-modal
      id="leave-level-modal"
      title="Are you sure you want to leave this level?"
      no-close-on-esc
      no-close-on-backdrop
      hide-footer
    >
      <h4>Progress will not be saved</h4>
      <button @click.prevent="leaveLevel()" style="float: right;">
        Yes
      </button>
    </b-modal>
</template>

<script>
import { mapActions } from 'vuex'
import store from '../store.js'

export default {
  methods: {
    ...mapActions([
      'restartGame'
    ]),
    async leaveLevel() {
      this.$router.push('/')
      await store.dispatch('restartGame')
    }
  }
}
</script>


<style scoped>

</style>
