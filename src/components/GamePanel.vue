<template>
    <div class="d-flex flex-row game-panel">
      <h2>numMines</h2>
      <b-button>:)</b-button>
      <b-button><router-link to="/">H</router-link></b-button>
      <h2>timeLapsed</h2>
    </div>
</template>

<script>
export default {

  data() {
    return {}
  },
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
