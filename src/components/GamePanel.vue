<template>
  <div>
    <div class="d-flex flex-row game-panel">
      <h2>{{ numMinesLeft }}</h2>
      <b-button @click="$store.dispatch('restartGame')"><font-awesome-icon icon="redo" /></b-button>
      <h2>{{ level }}</h2>
      <b-button @click="openModal"><font-awesome-icon icon="home" /></b-button>
      <h2>{{ timeElapsed }}</h2>
    </div>
    <LeaveLevelModal/>
  </div>
</template>

<script>
import LeaveLevelModal from './LeaveLevelModal.vue'
import { mapState, mapActions } from 'vuex'
import store from '../store.js'

export default {
  components: {
    LeaveLevelModal
  },
  computed: {
    ...mapState({
      gameStartBool: 'gameStartBool',
      numMinesLeft: 'numMinesLeft',
      squaresBool: 'squaresBool',
      timeElapsed: 'timeElapsed'
    })
  },
  methods: {
    openModal() {
      // if level has been started, show modal confirming to leave
      // if game has not been started or has been finished, go to home page
      if (this.squaresBool == true && this.gameStartBool == true) {
        this.$bvModal.show('leave-level-modal')
      } else {
        this.$router.push('/')
        store.dispatch('restartGame')
      }
    },
    ...mapActions([
      'restartGame'
    ])
  },
  props: ['level']
}
</script>

<style scoped>
.game-panel {
  height: 40px;
  width: 400px;
  background-color: pink;
  justify-content: space-between;
  margin: auto;
  margin-bottom: 10px;
  border: black 3px solid;
}
</style>
