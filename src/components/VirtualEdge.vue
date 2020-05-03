<template>
  <g class="edge">
    <path class="sub-edge" :d="link">
    </path>
  </g>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import * as d3 from 'd3';

export default {
  name: 'VirtualEdge',
  computed: {
    ...mapGetters([
      'draggingPort',
    ]),
    link() {
      let info = this.draggingPort;      
      return d3.linkHorizontal()({
        source: [info.sourceX, info.sourceY],
        target: [info.currentX, info.currentY]
      });
    }
  },
}
</script>

<style>
.sub-edge {
  stroke-dasharray: 5;
  stroke: #9a9a9a;
  stroke-width: 2px;
  fill: none;
}
</style>