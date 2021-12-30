<template>

  <div id="nav" style="margin-top:15px; margin-bottom: 15px;">
    
    <div style="font-size: 32px;">CHOOSE A LEVEL</div>
    <div>(hover over levels to see specifications)</div>

    <b-button v-for="level in levels"
              :key="level"
              @click="$router.push('/level' + level)"
              style="margin: 10px;"
              size="lg"
              variant="secondary">{{ level }}</b-button>

  </div>

</template>

<script>
export default {
  data() {
    return {
      levels: [
        1,
        2,
        3
      ]
    }
  }
}
</script>

<style scoped>

</style>
