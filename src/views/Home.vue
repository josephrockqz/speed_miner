<template>

  <div style="width: 80%; margin: auto;">

    <!-- Level Menu Component -->
    <LevelMenu/>

    <!-- Tabs Light Mode-->
    <b-card no-body v-show="nightModeBool == false">

      <b-tabs card justified>

        <!-- Controls Tab -->
        <b-tab title="Controls" active no-body>

          <ul style="text-align: left;">

            <li>Left click to reveal a cell</li>
            <li>Right click to place a flag to mark a mine</li>
            <li>Middle click a number to reveal its adjacent squares</li>
            <li>Classic Minesweeper controls: the goal is to uncover all cells in the grid that do not contain mines</li>

          </ul>

        </b-tab>

        <!-- Display Tab -->
        <b-tab title="Display">

          <!-- Night Mode Checkbox -->
          <b-checkbox v-model="nightMode" style="text-align: left;">&nbsp;Night Mode</b-checkbox>

        </b-tab>

        <!-- High Scores Tab -->
        <b-tab title="High Scores">
          
        </b-tab>

      </b-tabs>

    </b-card>

    <!-- Tabs Night Mode-->
    <b-card no-body bg-variant="secondary" text-variant="white" v-show="nightModeBool == true">

      <b-tabs card justified>

        <!-- Controls Tab -->
        <b-tab title="Controls" active title-link-class="bg-secondary" no-body>

          <ul style="text-align: left;">

            <li>Left click to reveal a cell</li>
            <li>Right click to place a flag to mark a mine</li>
            <li>Middle click a number to reveal its adjacent squares</li>
            <li>Classic Minesweeper controls: the goal is to uncover all cells in the grid that do not contain mines</li>

          </ul>

        </b-tab>

        <!-- Display Tab -->
        <b-tab title="Display" title-link-class="bg-secondary">

          <!-- Night Mode Checkbox -->
          <b-checkbox v-model="nightMode" style="text-align: left;">&nbsp;Night Mode</b-checkbox>

        </b-tab>

        <!-- High Scores Tab -->
        <b-tab title="High Scores" title-link-class="bg-secondary">
          
        </b-tab>

      </b-tabs>

    </b-card>

  </div>

</template>

<script>
import LevelMenu from '../components/LevelMenu.vue'
import { mapState, mapActions } from 'vuex'
import store from '../store.js'

export default {
  components: {
    LevelMenu
  },
  computed: {
    ...mapState({
      backgroundColor: 'backgroundColor',
      nightModeBool: 'nightModeBool'
    })
  },
  data() {
    return {
      nightMode: false,
      options: [
        { item: 'Night Mode', name: 'Night Mode' }
      ]
    }
  },
  methods: {
    ...mapActions([
      'toggleNightMode'
    ])
  },
  mounted() {
    if (this.backgroundColor == '#e9e9e9') {
      this.nightMode = false
    } else {
      this.nightMode = true
    }
  },
  watch: {
    async nightMode() {
      await store.dispatch('toggleNightMode', {
        night_mode_bool: this.nightMode
      })
    }
  }
}
</script>

<style>
a {
  border: none !important;
}
a:hover {
  border: none !important;
}
.nav-link {
  color: black !important;
}
.nav-link.active {
  color: #ffa500 !important;
}
.nav-link:hover {
  border: none !important; 
}
.nav-link.active:hover {
  border: none !important;
}
</style>
