<template>
  <div id="app">
    <span class="d-flex flex-row" style="justify-content: space-between">
      <h2 style="padding: 8px 0px 0px 8px;">
        <strong style="color: black">Speed Miner</strong>
      </h2>
      <img src="./assets/mine.png" style="max-height: 50px; padding: 8px 0px 0px 8px;" />
    </span>
    <div id="nav">
      <router-link to="/Level1">1</router-link>
    </div>
    <router-view />
  </div>

</template>

<script>
export default {
  name: 'App',
  components: {
    
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
</style>
