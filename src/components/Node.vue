<template>
  <g class="node step" data-connection-id=" " :transform="matrixPos" data-id="" tabindex="-1">
    <g class="core" transform="matrix(1, 0, 0, 1, 0, 0)"
        v-on="gCoreStyle">
      <circle cx="0" cy="0" :r="getTool.r" class="outer"></circle>
      <circle cx="0" cy="0" :r="getInnerR" class="inner"></circle>
      <svg class="node-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 398.39 397.78" x="-10" y="-8" width="20" height="15">
        <polygon points="38.77 397.57 0 366 136.15 198.78 0 31.57 38.77 0 200.63 198.78 38.77 397.57"></polygon>
        <rect x="198.39" y="347.78" width="200" height="50"></rect>
      </svg>
    </g>
    <text transform="matrix(1, 0, 0, 1, 0, 74)" class="title label">{{ getTool.name }}</text>
    <Port
      v-for="(input, index) in inputs"
      :key="'input' + index"
      :info="input"
      :nodeIdx="idx"
      :type="'input'">
    </Port>
    <Port
      v-for="(output, index) in outputs"
      :key="'output' + index"
      :info="output"
      :nodeIdx="idx"
      :type="'output'">
    </Port>
  </g>
   
        
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import Port from './Port'

export default {
  name: 'Node',
  components: {
    Port
  },
  props: {
    idx: Number,
  },
  computed: {
    ...mapGetters([
      'draggingTool',
      'getStepByIdx',
      'nodeClicked',
      'draggingPort',
    ]),
    gCoreStyle() {
      let style = {mousedown: () => this.setNodeState(true), mouseup: () => this.setNodeState(false)};
      if(this.nodeClicked) {
        style.mousemove = this.changeNodePos;
      }
      return style;
    },
    inputs() {
      return this.getTool.inputs;
    },
    outputs() {
      return this.getTool.outputs;
    },
    getTool() {
      return this.getStepByIdx(this.idx);
    },
    getInnerR() {
      return this.getStepByIdx(this.idx).r * 0.75;
    },
    matrixPos() {
      return `matrix(1, 0, 0, 1, ${this.getTool.svgX}, ${this.getTool.svgY})`;
    },
    inputAngles() {
      return this.getAngleArr(this.getStepByIdx(this.idx).inputs.length);
    },
  },
  methods: {
    ...mapMutations([
      'setNodeClicked',
      'moveNode',
    ]),
    setNodeState(state) {
      this.setNodeClicked(state);
    },
    changeNodePos(e) {
      // Create an SVGPoint for future math
      let a = {x: e.clientX, y: e.clientY, idx: this.idx};
      this.moveNode(a);
    }
  }
}
</script>

<style lang="scss" scoped>

.outer {
  fill: #fff;
  stroke: #9a9a9a;
  stroke-width: 2px;
}

.inner {
  fill: #11a7a7;
  pointer-events: none;
}

.node-icon {
  pointer-events: none;
  fill: #333;
  stroke: #333;
  stroke-width: 3px;
  stroke-linecap: round;
}

.title {
  fill: #333;
  stroke: #fff;
  stroke-width: 4px;
  text-anchor: middle;
  paint-order: stroke;
  stroke-linecap: butt;
  stroke-linejoin: miter;
}

.core:hover ~ .port >>> .label{
  opacity: 1;
}

</style>