<template>
    <b-modal @ok="leaveLevel" id="leave-level-modal">
        <h2>Are you sure you want to leave this level?</h2>
        <h4>Progress will not be saved</h4>
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
