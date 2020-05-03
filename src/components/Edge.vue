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
    info: Object,
  },
  computed: {
    ...mapGetters([
      'tools',
      'isClicked',
      'isDragging',
      'draggingTool',
      'steps',
      'isPortDragging',
      'isDragMode',
      'mouseSVGPos',
    ]),
    d() {
      const link = d3.linkHorizontal()({
        source: [this.sourceNodePos.x, this.sourceNodePos.y],
        target: [this.info.desX, this.info.desY]
      });
      return link;
    },
    sourceNodePos() {
      //console.log("######");
      let portX;
      let portY;
      let step;

      for(let i=0; i<this.steps.length; i++) {
        if(this.steps[i].id == this.info.sourceNodeId) {
          step = this.steps[i];
        }
      }
      console.log(step);
      if(step != null) {
        for(let i=0; i<step.outputs.length; i++) {
          if(step.outputs[i].id == this.info.sourcePortId) {
            portX = step.outputs[i].x;
            portY = step.outputs[i].y;
          }
        }
        //console.log({x: step.svgX + portX, y: step.svgY + portY});
        return {x: step.svgX + portX, y: step.svgY + portY};
      }
      
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