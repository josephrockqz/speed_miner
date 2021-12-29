<template>

  <div id="nav" style="margin-top:15px;">
    
    Levels:
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
