<template>
  <g class="node step" :transform="`matrix(1, 0, 0, 1, ${data.x}, ${data.y})`">
    <g class="core" transform="matrix(1, 0, 0, 1, 0, 0)"
      @mousedown="nodeMouseDownHandler">
      <circle cx="0" cy="0" :r="data.r" class="outer"></circle>
      <circle cx="0" cy="0" :r="data.r * 0.75" class="inner"></circle>
      <svg class="node-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 398.39 397.78" x="-10" y="-8" width="20" height="15">
        <polygon points="38.77 397.57 0 366 136.15 198.78 0 31.57 38.77 0 200.63 198.78 38.77 397.57"></polygon>
        <rect x="198.39" y="347.78" width="200" height="50"></rect>
      </svg>
    </g>
    <text transform="matrix(1, 0, 0, 1, 0, 74)" class="title label">{{ data.label }}</text>
    <Port
      v-for="(port, index) in data.inputs"
      :key="'inport' + index"
      :data="port"
      :idx="index"
      :nodeIdx="idx"
      :type="'input'">
    </Port>
    <Port
      v-for="(port, index) in data.outputs"
      :key="'outport' + index"
      :data="port"
      :idx="index"
      :nodeIdx="idx"
      :type="'output'">
    </Port>
  </g>
</template>

<script>
import Port from './Port'
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Tool',
  components: {
    Port,
  },
  props: {
    data: Object,
    idx: Number,
  },
  computed: {
    ...mapGetters([
      'draggingNodeStatus',
    ])
  },
  methods: {
    ...mapMutations([
      'setDraggingNodeStatus',
      'setDraggingNode',
    ]),
    nodeMouseDownHandler(e) {
      this.setDraggingNodeStatus('clicked');
      this.setDraggingNode({idx: this.idx});
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