<template>
  <g class="edge">
    <path :d="d" class="sub-edge">
    </path>
  </g>
</template>

<script>
import * as d3 from 'd3';
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'GhostEdge',
  computed: {
    ...mapGetters([
      'draggingPort',
    ]),
    d() {
      let sX, sY, dX, dY;
      if(this.draggingPort.type == 'input') {
        sX = this.draggingPort.mouseX; sY = this.draggingPort.mouseY;
        dX = this.draggingPort.portX; dY = this.draggingPort.portY;
      } else {
        sX = this.draggingPort.portX; sY = this.draggingPort.portY;
        dX = this.draggingPort.mouseX; dY = this.draggingPort.mouseY;
      }
      return d3.linkHorizontal()({
        source: [sX, sY],
        target: [dX, dY]
      });
    }
  }
}
</script>

<style lang="scss" scoped>

.sub-edge {
  stroke-dasharray: 5;
  stroke: #9a9a9a;
  stroke-width: 2px;
  fill: none;
}

</style>