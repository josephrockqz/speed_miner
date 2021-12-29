<template>

  <b-modal
    title="GAME LOST"
    hide-header-close
    hide-footer
    v-model="gameLossModalBool"
  >
    <div class="modal-class">
      <button @click.prevent="$store.dispatch('closeGameLossModal')" style="float: right;">
        Okay
      </button>
    </div>
  </b-modal>

</template>

<script>
import { mapActions, mapState } from 'vuex'

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

</style>
