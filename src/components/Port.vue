<template>
  <g 
    class="port"
    :class="type=='input' ? 'input-port' : 'output-port'"
    :transform="`matrix(1, 0, 0, 1, ${data.x}, ${data.y})`">
    <g 
      class="io-port"
      @mousedown="portMouseDownHandler">
      <circle cx="0" cy="0" r="7"></circle>
    </g>
    <text alignment-baseline="middle" x="0" y="0" transform="matrix(1, 0, 0, 1, 0, 0)" class="label">
      {{ data.label }}
    </text>
  </g>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Port',
  props: {
    data: Object,
    type: String,
    nodeIdx: Number,
    idx: Number,
  },
  computed: {
    ...mapGetters([
      'nodes',
    ]),
    portPos() {
      console.log(this.data);
      let node = this.nodes[this.nodeIdx];
      return {x: node.x + this.data.x, y: node.y + this.data.y};
    },
  },
  methods: {
    ...mapMutations([
      'setDraggingPortStatus',
      'setDraggingPort',
    ]),
    portMouseDownHandler() {
      this.setDraggingPortStatus('clicked');
      this.setDraggingPort({type: this.type, nodeIdx: this.nodeIdx, portIdx: this.idx, portX: this.portPos.x, portY: this.portPos.y});
    }
  }
}
</script>

<style lang="scss" scoped>

.port {
  fill: #9a9a9a;

  .label {
    opacity: 0;
  }
}

.io-port:hover ~ .label {
  opacity: 1;
}


.input-port {
  .label {
    text-anchor: end;
    transform: translate(-10px,0);
  }
}


.output-port {
  .label {
    text-anchor: start;
    transform: translate(10px,0);
  }
}

</style>