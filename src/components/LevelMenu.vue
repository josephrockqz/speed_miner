<template>

  <div id="nav" style="margin-top:15px; margin-bottom: 100px;">
    
    <div style="font-size: 32px;" v-show="nightModeBool == false">CHOOSE A LEVEL</div>
    <div v-show="nightModeBool == false">(hover over levels to see specifications)</div>

    <div style="font-size: 32px; color: black;" v-show="nightModeBool == true">CHOOSE A LEVEL</div>
    <div style="color: black;" v-show="nightModeBool == true">(hover over levels to see specifications)</div>

    <b-button v-for="level in levels"
              :key="level"
              :id="'popover-target-' + level"
              @click="$router.push('/level' + level)"
              style="margin: 40px;"
              size="lg"
              variant="secondary">{{ level }}</b-button>

    <!-- Level 1 Info Popover -->
    <b-popover
      target="popover-target-1"
      triggers="hover"
      placement="bottom"
      variant="secondary"
      title="Beginner"
    >
      <div class="d-flex flex-row" style="justify-content: space-between;"><span>Height:</span><span>10</span></div>
      <div class="d-flex flex-row" style="justify-content: space-between;"><span>Width:</span><span>10</span></div>
      <div class="d-flex flex-row" style="justify-content: space-between;"><span>Number of Mines:&nbsp;&nbsp;&nbsp;</span><span>12</span></div>
    </b-popover>

    <!-- Level 2 Info Popover -->
    <b-popover
      target="popover-target-2"
      triggers="hover"
      placement="bottom"
      variant="primary"
      title="Intermediate"
    >
      <div class="d-flex flex-row" style="justify-content: space-between;"><span>Height:</span><span>10</span></div>
      <div class="d-flex flex-row" style="justify-content: space-between;"><span>Width:</span><span>25</span></div>
      <div class="d-flex flex-row" style="justify-content: space-between;"><span>Number of Mines:&nbsp;&nbsp;&nbsp;</span><span>35</span></div>
    </b-popover>

    <!-- Level 3 Info Popover -->
    <b-popover
      target="popover-target-3"
      triggers="hover"
      placement="bottom"
      variant="danger"
      title="Expert"
    >
      <div class="d-flex flex-row" style="justify-content: space-between;"><span>Height:</span><span>16</span></div>
      <div class="d-flex flex-row" style="justify-content: space-between;"><span>Width:</span><span>30</span></div>
      <div class="d-flex flex-row" style="justify-content: space-between;"><span>Number of Mines:&nbsp;&nbsp;&nbsp;</span><span>99</span></div>
    </b-popover>

  </div>

</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      nightModeBool: 'nightModeBool'
    })
  },
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
