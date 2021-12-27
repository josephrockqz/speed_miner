<template>
    <div class="d-flex flex-row game-panel">
      <h2>{{ numMinesLeft }}</h2>
      <b-button @click="$store.dispatch('restartGame')">:)</b-button>
      <h2>L</h2>
      <b-button @click="$router.push('/')">H</b-button>
      <h2>{{ timeElapsed }}</h2>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      numMinesLeft: 'numMinesLeft',
      timeElapsed: 'timeElapsed'
    })
  },
  methods: {
    ...mapActions([
      'restartGame'
    ])
  }
}
</script>

<style scoped>
.game-panel {
  height: 60px;
  width: 400px;
  background-color: pink;
  justify-content: space-between;
  margin: auto;
  margin-bottom: 10px;
  border: black 3px solid;
}
</style>
