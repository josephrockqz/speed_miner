<template>

  <div id="levelbox">
    
    <!--Game Panel-->
    <GamePanel :level="3"/>

    <div class="level3">

      <!--Game Grid-->
      <div v-for="cell in cells"
           :key="cell"
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
import { mapState, mapActions } from 'vuex'
import store from '../store.js'

export default {
  components: {
    GamePanel
  },
  computed: {
    ...mapState({
      cells: 'cells',
      mineIndices: 'mineIndices',
      numberOfNeighborMines: 'numberOfNeighborMines',
      squares: 'squares',
      squaresBool: 'squaresBool'
    })
  },
  data() {
    return {
      height: 16,
      level: 3,
      num_cells: 480,
      num_mines: 99,
      width: 30
    }
  },
  methods: {
    ...mapActions([
      'instantiateRectangleLevel',
      'makeCells'
    ])
  },
  async mounted() {
    await store.dispatch('instantiateRectangleLevel', {
      height: this.height,
      level: this.level,
      num_cells: this.num_cells,
      num_mines: this.num_mines,
      width: this.width
    })
    await store.dispatch('makeCells', {
      num_cells: this.num_cells
    })
  }
}
</script>

<style scoped>
.level3 {
  width: 1220px;
  height: 660px;
  flex-wrap: wrap;
  display: flex;
  background-color: #999999;
  border: #000000 10px solid;
  margin: 0 auto;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.level3 div {
  height: 40px;
  width: 40px;
  border: #7f7f7f 1px solid;
  margin: 0px;
  padding: 0px;
}
</style>