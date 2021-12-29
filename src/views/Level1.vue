<template>

  <div id="levelbox">
    
    <!--Game Panel-->
    <GamePanel :level="1"/>

    <div class="level1">

      <!--Game Grid-->
      <div v-for="cell in cells"
           :key="cell"
           @click="$store.dispatch('checkCell', {cell_index: cell})"
           @click.right.prevent="$store.dispatch('placeFlag', {cell_index: cell})"></div>

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
      height: 10,
      level: 1,
      num_cells: 100,
      num_mines: 12,
      width: 10
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
.level1 {
  width: 420px;
  height: 420px;
  flex-wrap: wrap;
  display: flex;
  background-color: #999999;
  border: #000000 10px solid;
  margin: 0 auto;
}
.level1 div {
  height: 40px;
  width: 40px;
  border: #ffffff 1px solid;
  margin: 0px;
  padding: 0px;
}
</style>