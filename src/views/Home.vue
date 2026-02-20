<template>

  <div class="home-page" style="width: 80%; margin: auto;">

    <!-- Level Menu Component -->
    <LevelMenu/>

    <!-- Tabs -->
    <b-card no-body :bg-variant="nightModeBool ? 'secondary' : ''" :text-variant="nightModeBool ? 'white' : ''">

      <b-tabs card justified>

        <!-- Controls Tab -->
        <b-tab title="Controls" :title-link-class="nightModeBool ? 'bg-secondary' : ''" no-body>

          <ul style="text-align: left;">

            <li>Left click to reveal a cell</li>
            <li>Right click to place a flag to mark a mine</li>
            <li>Middle click a number to reveal its adjacent squares</li>
            <li>Classic Minesweeper controls: the goal is to uncover all cells in the grid that do not contain mines</li>

          </ul>

        </b-tab>

        <!-- Display Tab -->
        <b-tab title="Display" active :title-link-class="nightModeBool ? 'bg-secondary' : ''" align="center">

          <div>

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

          </div>

        </b-tab>

        <!-- Statistics Tab -->
        <b-tab title="Statistics" :title-link-class="nightModeBool ? 'bg-secondary' : ''" align="center">

          <div style="width: 400px;">
            <!-- Beginner Statistics -->
            <div class="d-flex flex-row" style="justify-content: space-between;"><span>Beginner Games Won:</span><span>{{ beginnerGamesWon }}</span></div>
            <div class="d-flex flex-row" style="justify-content: space-between;"><span>Beginner Games Played:</span><span>{{ beginnerGamesPlayed }}</span></div>
            <div class="d-flex flex-row" style="justify-content: space-between;"><span>Beginner Win Percentage:</span><span>{{ beginnerAverage }}%</span></div>
            <!-- Intermediate Statistics -->
            <div class="d-flex flex-row" style="justify-content: space-between;"><span>Intermediate Games Won:</span><span>{{ intermediateGamesWon }}</span></div>
            <div class="d-flex flex-row" style="justify-content: space-between;"><span>Intermediate Games Played:</span><span>{{ intermediateGamesPlayed }}</span></div>
            <div class="d-flex flex-row" style="justify-content: space-between;"><span>Intermediate Win Percentage:</span><span>{{ intermediateAverage }}%</span></div>
            <!-- Advanced Statistics -->
            <div class="d-flex flex-row" style="justify-content: space-between;"><span>Advanced Games Won:</span><span>{{ advancedGamesWon }}</span></div>
            <div class="d-flex flex-row" style="justify-content: space-between;"><span>Advanced Games Played:</span><span>{{ advancedGamesPlayed }}</span></div>
            <div class="d-flex flex-row" style="justify-content: space-between;"><span>Advanced Win Percentage:</span><span>{{ advancedAverage }}%</span></div>
          </div>

        </b-tab>

      </b-tabs>

    </b-card>

    <!-- High Scores Tabs -->
    <b-card no-body :bg-variant="nightModeBool ? 'secondary' : ''" style="margin-top: 20px; margin-bottom: 20px;">

      <b-tabs card justified>

        <!-- Beginner High Scores -->
        <b-tab no-body title="Beginner" :title-link-class="nightModeBool ? 'bg-secondary' : ''">
          <b-button
            :disabled="currentPageBeginner < 2"
            @click="currentPageBeginner--"
            style="margin: 4px;"
            :variant="nightModeBool ? 'light' : 'secondary'"
            >Prev</b-button
          >
          <b-button
            :disabled="currentPageBeginner * perPage >= beginnerTimes.length"
            @click="currentPageBeginner++"
            style="margin: 4px;"
            :variant="nightModeBool ? 'light' : 'secondary'"
            >Next</b-button
          >
          <b-table
            :items="beginnerTimes"
            :fields="fields"
            small
            fixed
            responsive="sm"
            :perPage="perPage"
            :currentPage="currentPageBeginner"
          ></b-table>
        </b-tab>

        <!-- Intermediate High Scores -->
        <b-tab no-body active title="Intermediate" :title-link-class="nightModeBool ? 'bg-secondary' : ''">
          <b-button
            :disabled="currentPageIntermediate < 2"
            @click="currentPageIntermediate--"
            style="margin: 4px;"
            :variant="nightModeBool ? 'light' : 'secondary'"
            >Prev</b-button
          >
          <b-button
            :disabled="currentPageIntermediate * perPage >= intermediateTimes.length"
            @click="currentPageIntermediate++"
            style="margin: 4px;"
            :variant="nightModeBool ? 'light' : 'secondary'"
            >Next</b-button
          >
          <b-table
            :items="intermediateTimes"
            :fields="fields"
            small
            fixed
            responsive="sm"
            :perPage="perPage"
            :currentPage="currentPageIntermediate"
          ></b-table>
        </b-tab>

        <!-- Advanced High Scores -->
        <b-tab no-body title="Advanced" :title-link-class="nightModeBool ? 'bg-secondary' : ''">
          <b-button
            :disabled="currentPageAdvanced < 2"
            @click="currentPageAdvanced--"
            style="margin: 4px;"
            :variant="nightModeBool ? 'light' : 'secondary'"
            >Prev</b-button
          >
          <b-button
            :disabled="currentPageAdvanced * perPage >= advancedTimes.length"
            @click="currentPageAdvanced++"
            style="margin: 4px;"
            :variant="nightModeBool ? 'light' : 'secondary'"
            >Next</b-button
          >
          <b-table
            :items="advancedTimes"
            :fields="fields"
            small
            fixed
            responsive="sm"
            :perPage="perPage"
            :currentPage="currentPageAdvanced"
          ></b-table>
        </b-tab>

      </b-tabs>

    </b-card>

  </div>

</template>

<script>
import LevelMenu from '../components/LevelMenu.vue'
import { mapState } from 'vuex'

export default {
  components: {
    LevelMenu
  },
  computed: {
    ...mapState({
      advancedGamesPlayed: 'advancedGamesPlayed',
      advancedGamesWon: 'advancedGamesWon',
      backgroundColor: 'backgroundColor',
      beginnerGamesPlayed: 'beginnerGamesPlayed',
      beginnerGamesWon: 'beginnerGamesWon',
      intermediateGamesPlayed: 'intermediateGamesPlayed',
      intermediateGamesWon: 'intermediateGamesWon',
      nightModeBool: 'nightModeBool',
      times: 'times'
    })
  },
  async created() {
    document.body.style.zoom = "100%"
    this.$store.dispatch('restartGame')
    this.$store.dispatch('getUserStatistics').then(() => {
      this.calculateUserStatisticAverages()
    })
    let i = this.$store.dispatch('getScoresMongo')
    await i
    this.sortTimes()
  },
  data() {
    return {
      advancedAverage: 0,
      advancedTimes: [],
      beginnerAverage: 0,
      beginnerTimes: [],
      currentPageAdvanced: 1,
      currentPageBeginner: 1,
      currentPageIntermediate: 1,
      fields: ['rank', 'name', 'time'],
      intermediateAverage: 0,
      intermediateTimes: [],
      nightMode: false,
      perPage: 10,
      zoomLevel: 3,
    }
  },
  methods: {
    calculateUserStatisticAverages() {
      if (this.beginnerGamesPlayed == 0) {
        this.beginnerAverage = 0
      } else {
        this.beginnerAverage = (this.beginnerGamesWon / this.beginnerGamesPlayed * 100).toFixed(3)
      }
      if (this.intermediateGamesPlayed == 0) {
        this.intermediateAverage = 0
      } else {
        this.intermediateAverage = (this.intermediateGamesWon / this.intermediateGamesPlayed * 100).toFixed(3)
      }
      if (this.advancedGamesPlayed == 0) {
        this.advancedAverage = 0
      } else {
        this.advancedAverage = (this.advancedGamesWon / this.advancedGamesPlayed * 100).toFixed(3)
      }
    },
    compareTimes(a, b) {
      return a.time - b.time
    },
    sortTimes() {
      this.times.forEach(time => {
        if (time.level == 1) {
          this.beginnerTimes.push(JSON.parse(JSON.stringify(time)))
        } else if (time.level == 2) {
          this.intermediateTimes.push(JSON.parse(JSON.stringify(time)))
        } else if (time.level == 3) {
          this.advancedTimes.push(JSON.parse(JSON.stringify(time)))
        }
      })
      this.beginnerTimes.sort(this.compareTimes)
      for (let i = 0; i < this.beginnerTimes.length; i++) {
        this.beginnerTimes[i].rank = i + 1
      }
      this.intermediateTimes.sort(this.compareTimes)
      for (let i = 0; i < this.intermediateTimes.length; i++) {
        this.intermediateTimes[i].rank = i + 1
      }
      this.advancedTimes.sort(this.compareTimes)
      for (let i = 0; i < this.advancedTimes.length; i++) {
        this.advancedTimes[i].rank = i + 1
      }
    },
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
      await this.$store.dispatch('toggleNightMode', {
        night_mode_bool: this.nightMode
      })
    },
    async zoomLevel() {
      await this.$store.dispatch('toggleZoom', {
        zoom_level: this.zoomLevel
      })
    }
  }
}
</script>

<style>
.home-page a {
  border: none !important;
}
.home-page a:hover {
  border: none !important;
}
.home-page div.card-header {
  border: none !important;
  padding: none !important;
}
.home-page .nav-link {
  color: black !important;
}
.home-page .nav-link.active {
  color: #ffa500 !important;
}
.home-page .nav-link:hover {
  border: none !important;
}
.home-page .nav-link.active:hover {
  border: none !important;
}
</style>
