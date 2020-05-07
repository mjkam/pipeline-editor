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
      'nodes',
    ]),
    portPos() {
      let node = this.nodes.find(node => node.id == this.draggingPort.nodeId);
      let port;
      if(this.draggingPort.type == 'input') {
        port = node.inputs.find(port => port.id == this.draggingPort.portId);
      } else {
        port = node.outputs.find(port => port.id == this.draggingPort.portId);
      }
      return {x: node.x + port.x, y: node.y + port.y};
    },
    d() {
      let sX, sY, dX, dY;
      if(this.draggingPort.type == 'input') {
        sX = this.draggingPort.mouseX; sY = this.draggingPort.mouseY;
        dX = this.portPos.x; dY = this.portPos.y;
      } else {
        sX = this.portPos.x; sY = this.portPos.y;
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