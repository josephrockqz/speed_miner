<template>
    <div>
        <b-button @click="$store.dispatch('nightMode')">moon</b-button>
        <LevelMenu/>
    </div>
</template>

<script>
import LevelMenu from '../components/LevelMenu.vue'

export default {
  components: {
    LevelMenu
  }
}
</script>

<style scoped>

</style>
