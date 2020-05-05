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
      'pipeline',
    ]),
    d() {
      let sourceNode = this.pipeline.tools[this.data.sourceNodeIdx];
      let sourcePort = sourceNode.outputs[this.data.sourcePortIdx];
      let desNode = this.pipeline.tools[this.data.desNodeIdx];
      let desPort = desNode.inputs[this.data.desPortIdx];

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