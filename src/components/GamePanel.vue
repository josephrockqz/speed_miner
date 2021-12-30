<template>

  <div>

    <div class="d-flex flex-row game-panel">

      <!-- Number of Mines Left -->
      <div style="height: 50px; margin: 2.5px; vertical-align: middle; background-color: black; color: red; width: 60px; text-align:">
        <h2>0{{ numMinesLeft }}</h2>
      </div>

      <!-- Restart Game Button -->
      <b-button @click="$store.dispatch('restartGame')"
                squared
                style="height: 50px; margin-top: 2.5px;"
      ><font-awesome-icon icon="redo" />
      </b-button>

      <!-- Current Level Display -->
      <div style="height: 50px; margin-top: 2.5px; vertical-align: middle; color: black; width: 40px; text-align:">
        <h2>L{{ level }}</h2>
      </div>

      <!-- Home Button -->
      <b-button @click="openModal"
                squared
                style="height: 50px; margin-top: 2.5px;"
      ><font-awesome-icon icon="home" />
      </b-button>

      <!-- Time Elapsed -->
      <div style="height: 50px; margin: 2.5px; vertical-align: middle; background-color: black; color: red; width: 60px; text-align:">
        <h2 v-if="timeElapsed < 10">00{{ timeElapsed }}</h2>
        <h2 v-else-if="timeElapsed >= 10 && timeElapsed < 100">0{{ timeElapsed }}</h2>
        <h2 v-else>{{ timeElapsed }}</h2>
      </div>

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
      'restartGame',
      'timeExceeded'
    ])
  },
  props: ['level'],
  watch: {
    timeElapsed() {
      if (this.timeElapsed > 999) {
        store.dispatch('timeExceeded')
      }
    }
  }
}
</script>

<style scoped>
.game-panel {
  height: 61px;
  width: 400px;
  background-color: #bdbdbd;
  justify-content: space-between;
  margin: auto;
  margin-bottom: 10px;
  border: black 3px solid;
}
</style>

<style>
h2 {
  margin-top: 6px !important;
  margin-bottom: 0px !important;
}
</style>
