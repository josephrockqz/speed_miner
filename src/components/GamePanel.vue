<template>
    <div class="d-flex flex-row game-panel">
      <h2>numMines</h2>
      <b-button>:)</b-button>
      <b-button @click="$router.push('/')">H</b-button>
      <h2>{{ timeElapsed }}</h2>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      timeElapsed: 'timeElapsed'
    })
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
