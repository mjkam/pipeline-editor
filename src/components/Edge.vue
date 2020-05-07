<template>
  <g>
    <path :d="d">
    </path>
  </g>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import * as d3 from 'd3';

export default {
  name: 'Edge',
  props: {
    data: Object,
  },
  computed: {
    ...mapGetters([
      'nodes',
    ]),
    d() {
      let sourceNode = this.nodes.find(node => node.id == this.data.sourceNodeId);
      let sourcePort = sourceNode.outputs.find(port => port.id == this.data.sourcePortId);
      let desNode = this.nodes.find(node => node.id == this.data.desNodeId);
      let desPort = desNode.inputs.find(port => port.id == this.data.desPortId);

      const link = d3.linkHorizontal()({
        source: [sourceNode.x + sourcePort.x, sourceNode.y + sourcePort.y],
        target: [desNode.x + desPort.x, desNode.y + desPort.y]
      });
      return link;
    }
  }
}
</script>

<style lang="scss" scoped>

path {
  stroke-width: 2px;
  stroke: #9a9a9a;
  fill: none;
}

</style>