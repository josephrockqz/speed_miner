<template>
  <div v-if="gameLossModalBool" class="game-loss-banner">
    <span class="game-loss-text">GAME LOST</span>
    <button class="game-loss-btn" @click.prevent="$store.dispatch('closeGameLossModal')">
      Okay
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      gameLossModalBool: 'gameLossModalBool',
    })
  },
  methods: {
    ...mapActions([
      'closeGameLossModal'
    ])
  }
}
</script>

<style scoped>
.game-loss-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-color: #8b0000;
  color: white;
  padding: 10px 20px;
  max-width: 400px;
  margin: 8px auto;
  border-radius: 4px;
}
.game-loss-text {
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 1px;
}
.game-loss-btn {
  background-color: white;
  color: #8b0000;
  border: none;
  padding: 4px 16px;
  font-weight: bold;
  border-radius: 3px;
  cursor: pointer;
}
.game-loss-btn:hover {
  background-color: #eee;
}
</style>
