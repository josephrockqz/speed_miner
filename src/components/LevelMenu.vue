<template>
  <div id="nav">
    <router-link v-for="level in levels"
                 :key="level"
                 :to="'/level' + level"
                 style="margin: 10px;">{{ level }}</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      levels: [
        1,
        2
      ]
    }
  }
}
</script>

<style scoped>

</style>
