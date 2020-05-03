<template>
  <g 
    class="port"
    :class="type==1 ? 'input-port' : 'output-port'" 
    :transform="`matrix(1, 0, 0, 1, ${info.x}, ${info.y})`">
    <g 
      class="io-port"
      @mousedown="handlePortMouseDownEvent"
      v-on="isPortClicked ? { mousemove : handlePortDrag, mouseup: handlePortMouseUp } : null">
      <circle cx="0" cy="0" r="7" class="port-handle"></circle>
    </g>
    <text alignment-baseline="middle" x="0" y="0" transform="matrix(1, 0, 0, 1, 0, 0)" class="label" >
      {{ this.info.label }}
    </text>
  </g>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Port',
  props: {
    info: Object,
    type: String,
    nodeIdx: Number,
  },
  computed: {
    ...mapGetters([
      'isPortClicked',
      'steps',
      "mouseSVGPos",
      'getStepByIdx',
    ]),
  },
  methods: {
    ...mapMutations([
      'setPortClick',
      'setIsPortClickedStatus',
      'setIsPortDraggingStatus',
      'setDraggingPortInfo',
      'setDraggingPortPos',
      'setCanCreateFile',
      'setDragPortType',
    ]),
    setPortClicked() {
      this.setPortClick(true);
    },
    portDragEndHandler() {
      this.setPortClick(false);
    },
    getPortPos() {
      let t = this.getStepByIdx(this.nodeIdx);
      return {x: t.svgX + this.info.x, y: t.svgY + this.info.y};
    },
    handlePortMouseDownEvent(e) {
      this.setIsPortClickedStatus(true);
      let node = this.getStepByIdx(this.nodeIdx);
      let portPos = this.getPortPos();
      let p = this.mouseSVGPos(e.clientX, e.clientY);
      this.setDragPortType(this.type);
      this.setDraggingPortPos({x: p.x, y: p.y});
      this.setDraggingPortInfo({sourceNodeId: node.id, sourceX: portPos.x, sourceY: portPos.y, portId: this.info.id, portLabel: this.info.label});
    },
    handlePortDrag() {
      this.setIsPortDraggingStatus(true);
    },
    handlePortMouseUp() {
      this.setIsPortClickedStatus(false);
      this.setIsPortDraggingStatus(false);
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
