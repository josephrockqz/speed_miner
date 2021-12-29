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
  </div>

</template>

<script>
import GameWinModal from './components/GameWinModal.vue'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    GameWinModal
  },
  computed: {
    ...mapState({
      backgroundColor: 'backgroundColor'
    })
  },
  methods: {
    goToHome() {
      console.log(this.$route.name)
      if (this.$route.name != 'Home') {
        this.$router.push('/')
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
#nav {
  padding: 0px 0px 30px 0px;
}
.main-grid {
  width: 420px;
  height: 420px;
  flex-wrap: wrap;
  display: flex;
  background-color: #999999;
  border: #000000 10px solid;
  margin: 0 auto;
}
.main-grid div {
  height: 40px;
  width: 40px;
  border: #ffffff 1px solid;
  margin: 0px;
  padding: 0px;
}
.uncovered {
  background-color: peachpuff;
}
.mine {
  background-color: yellowgreen;
  /* background-image: url("./assets/mine.png"); */
  /* height: 40px; */
}
.flag {
  background-color: orangered;
}
</style>
