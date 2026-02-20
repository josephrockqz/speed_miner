<template>

  <div id="levelbox">

    <!--Game Panel-->
    <GamePanel :level="level"/>

    <div :class="'level' + level" :style="gridStyle">

      <!--Game Grid-->
      <div v-for="cell in cells"
           :key="cell"
           class="grid-cell"
           @click="$store.dispatch('checkCell', {cell_index: cell, level: level})"
           @click.right.prevent="$store.dispatch('placeFlag', {cell_index: cell})"
           @click.middle="$store.dispatch('checkMiddleClick', {cell_index: cell, level: level})"
      >
      </div>

    </div>

  </div>

</template>

<script>
import GamePanel from '../components/GamePanel.vue'
import { mapState } from 'vuex'

const levelConfig = {
  1: { height: 10, width: 10, num_cells: 100, num_mines: 12, gridWidth: '420px', gridHeight: '420px' },
  2: { height: 10, width: 25, num_cells: 250, num_mines: 35, gridWidth: '1020px', gridHeight: '420px' },
  3: { height: 16, width: 30, num_cells: 480, num_mines: 99, gridWidth: '1220px', gridHeight: '660px' }
}

export default {
  components: {
    GamePanel
  },
  computed: {
    ...mapState({
      cells: 'cells'
    }),
    level() {
      return parseInt(this.$route.params.level, 10)
    },
    config() {
      return levelConfig[this.level]
    },
    gridStyle() {
      return {
        width: this.config.gridWidth,
        height: this.config.gridHeight,
        flexWrap: 'wrap',
        display: 'flex',
        backgroundColor: '#999999',
        border: '#000000 10px solid',
        margin: '0 auto',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none'
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('instantiateRectangleLevel', {
      height: this.config.height,
      level: this.level,
      num_cells: this.config.num_cells,
      num_mines: this.config.num_mines,
      width: this.config.width
    })
    await this.$store.dispatch('makeCells', {
      num_cells: this.config.num_cells
    })
  },
  beforeDestroy() {
    this.$store.dispatch('restartGame')
  }
}
</script>

<style scoped>
.grid-cell {
  height: 40px;
  width: 40px;
  border: #7f7f7f 1px solid;
  margin: 0px;
  padding: 0px;
}
</style>
