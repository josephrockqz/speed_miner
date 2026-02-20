<template>
    <b-modal
      id="leave-level-modal"
      title="Are you sure you want to leave this level?"
      hide-footer
    >
      <h4>Progress will not be saved</h4>
      <div style="float: right;">
        <button @click.prevent="cancel()" style="margin-right: 8px;">
          Cancel
        </button>
        <button @click.prevent="leaveLevel()">
          Yes
        </button>
      </div>
    </b-modal>
</template>

<script>
export default {
  methods: {
    cancel() {
      this.$bvModal.hide('leave-level-modal')
    },
    async leaveLevel() {
      this.$router.push('/')
      await this.$store.dispatch('restartGame')
    }
  }
}
</script>


<style scoped>

</style>
