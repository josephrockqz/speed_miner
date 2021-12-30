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
          
          <!-- Zoom Level -->
          <b-form-group style="text-align: left; margin-top: 5px;">
            <b-form-radio v-model="zoomLevel" name="some-radios" value="1">&nbsp;50% Zoom</b-form-radio>
            <b-form-radio v-model="zoomLevel" name="some-radios" value="2">&nbsp;75% Zoom</b-form-radio>
            <b-form-radio v-model="zoomLevel" name="some-radios" value="3">&nbsp;100% Zoom</b-form-radio>
            <b-form-radio v-model="zoomLevel" name="some-radios" value="4">&nbsp;150% Zoom</b-form-radio>
            <b-form-radio v-model="zoomLevel" name="some-radios" value="5">&nbsp;200% Zoom</b-form-radio>
          </b-form-group>

        </b-tab>

        <!-- Statistics Tab -->
        <b-tab title="Statistics">
          
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

          <!-- Zoom Level -->
          <b-form-group style="text-align: left; margin-top: 5px;">
            <b-form-radio v-model="zoomLevel" value="1">&nbsp;50% Zoom</b-form-radio>
            <b-form-radio v-model="zoomLevel" value="2">&nbsp;75% Zoom</b-form-radio>
            <b-form-radio v-model="zoomLevel" value="3">&nbsp;100% Zoom</b-form-radio>
            <b-form-radio v-model="zoomLevel" value="4">&nbsp;150% Zoom</b-form-radio>
            <b-form-radio v-model="zoomLevel" value="5">&nbsp;200% Zoom</b-form-radio>
          </b-form-group>

        </b-tab>

        <!-- Statistics Tab -->
        <b-tab title="Statistics" title-link-class="bg-secondary">
          
        </b-tab>

      </b-tabs>

    </b-card>

    <!-- High Scores Tabs Light Mode -->
    <b-card title="High Scores" no-body v-show="nightModeBool == false" style="margin-top: 20px;">

      <b-tabs card justified>

        <!-- Beginner High Scores -->
        <b-tab no-body active title="Beginner">
          
        </b-tab>

        <!-- Intermediate High Scores -->
        <b-tab no-body title="Intermediate">
          
        </b-tab>

        <!-- Advanced High Scores -->
        <b-tab no-body title="Advanced">

        </b-tab>

      </b-tabs>

    </b-card>

    <!-- High Scores Tabs Night Mode -->
    <b-card no-body bg-variant="secondary" v-show="nightModeBool == true" style="margin-top: 20px;">

      <b-tabs card justified>

        <!-- Beginner High Scores -->
        <b-tab no-body active title="Beginner" title-link-class="bg-secondary">
          
        </b-tab>

        <!-- Intermediate High Scores -->
        <b-tab no-body title="Intermediate" title-link-class="bg-secondary">
          
        </b-tab>

        <!-- Advanced High Scores -->
        <b-tab no-body title="Advanced" title-link-class="bg-secondary">

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
      nightModeBool: 'nightModeBool',
      times: 'times'
    })
  },
  async created() {
    let i = store.dispatch('getScoresMongo')
    await i
    console.log(this.times)
  },
  data() {
    return {
      nightMode: false,
      options: [
        { item: 'Night Mode', name: 'Night Mode' }
      ],
      zoomLevel: 3
    }
  },
  methods: {
    ...mapActions([
      'getScoresMongo',
      'toggleNightMode',
      'toggleZoom'
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
    },
    async zoomLevel() {
      await store.dispatch('toggleZoom', {
        zoom_level: this.zoomLevel
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
div.card-header {
  border: none !important;
  padding: none !important;
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
