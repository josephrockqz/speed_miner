<template>

  <div>

    <div class="d-flex flex-row game-panel">

      <!-- Number of Mines Left -->
      <div style="height: 50px; margin: 2.5px; vertical-align: middle; background-color: black; color: red; width: 60px; text-align: center">
        <h2>{{ mineCounterDisplay }}</h2>
      </div>

      <!-- Restart Game Button -->
      <b-button @click="$store.dispatch('restartGame')"
                squared
                style="height: 50px; margin-top: 2.5px;"
                aria-label="Restart game"
      ><font-awesome-icon icon="redo" />
      </b-button>

      <!-- Current Level Display -->
      <div style="height: 50px; margin-top: 2.5px; vertical-align: middle; color: black; width: 40px; text-align: center">
        <h2>L{{ level }}</h2>
      </div>

      <!-- Home Button -->
      <b-button @click="openModal"
                squared
                style="height: 50px; margin-top: 2.5px;"
                aria-label="Go to home"
      ><font-awesome-icon icon="home" />
      </b-button>

      <!-- Time Elapsed -->
      <div style="height: 50px; margin: 2.5px; vertical-align: middle; background-color: black; color: red; width: 60px; text-align: center">
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
import { mapState } from 'vuex'

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
    }),
    mineCounterDisplay() {
      if (this.numMinesLeft < 0) {
        return '-' + String(Math.abs(this.numMinesLeft)).padStart(2, '0')
      }
      return String(this.numMinesLeft).padStart(3, '0')
    }
  },
  methods: {
    openModal() {
      // if level has been started, show modal confirming to leave
      // if game has not been started or has been finished, go to home page
      if (this.squaresBool == true && this.gameStartBool == true) {
        this.$bvModal.show('leave-level-modal')
      } else {
        this.$router.push('/')
        this.$store.dispatch('restartGame')
      }
    },
  },
  props: ['level'],
  watch: {
    timeElapsed() {
      if (this.timeElapsed > 999) {
        this.$store.dispatch('timeExceeded', {
          level: this.level
        })
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
.game-panel h2 {
  margin-top: 6px !important;
  margin-bottom: 0px !important;
}
</style>
