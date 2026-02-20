<template>
  <div id="app">
    <span class="d-flex flex-row" style="justify-content: space-between">
      <h2 style="padding: 8px 0px 0px 8px;">
        <strong style="color: black">Speed Miner</strong>
      </h2>
      <img src="./assets/mine.png"
           style="max-height: 50px; padding: 8px 0px 0px 8px; cursor: pointer;"
           @click="goToHome" />
    </span>
    <router-view />
    <GameWinModal/>
    <GameLossModal/>
  </div>

</template>

<script>
import GameWinModal from './components/GameWinModal.vue'
import GameLossModal from './components/GameLossModal.vue'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    GameLossModal,
    GameWinModal
  },
  computed: {
    ...mapState({
      backgroundColor: 'backgroundColor',
      gameStartBool: 'gameStartBool',
      squaresBool: 'squaresBool'
    })
  },
  methods: {
    goToHome() {
      if (this.squaresBool == true && this.gameStartBool == true) {
        this.$bvModal.show('leave-level-modal')
      } else if (this.$route.name != 'Home') {
        this.$router.push('/')
        this.$store.dispatch('restartGame')
      }
    }
  },
  mounted() {
    document.body.style.backgroundColor = this.backgroundColor
  },
  watch: {
    backgroundColor() {
      document.body.style.backgroundColor = this.backgroundColor
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.flag {
  background-color: #999999;
  background-image: url('assets/flag.png');
  background-size: 40px;
}
.flag-misplaced {
  background-color: #999999;
  background-image: url('assets/flag_misplaced.png');
  background-position-x: -1px;
  background-position-y: -1px;
  background-size: 40px;
}
.mine {
  background-color: #bdbdbd;
  background-image: url('assets/mine.png');
  background-position-x: 0.5px;
  background-position-y: 0.5px;
  background-size: 37px;
}
.mine-death {
  background-color: red;
  background-image: url('assets/mine.png');
  background-position-x: 0.5px;
  background-position-y: 0.5px;
  background-size: 37px;
}
.uncovered {
  background-color: #bdbdbd;
}
</style>
