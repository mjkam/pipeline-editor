<template>
  <g 
    class="port"
    :class="type=='input' ? 'input-port' : 'output-port'"
    :transform="`matrix(1, 0, 0, 1, ${data.x}, ${data.y})`">
    <g 
      class="io-port" ref="port">
      <circle cx="0" cy="0" r="7"></circle>
    </g>
    <text alignment-baseline="middle" x="0" y="0" transform="matrix(1, 0, 0, 1, 0, 0)" class="label">
      {{ data.label }}
    </text>
  </g>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import * as d3 from 'd3';

export default {
  name: 'Port',
  props: {
    data: Object,
    type: String,
    nodeId: Number,
  },
  computed: {
    ...mapGetters([
      'nodes',
      'draggingPort',
    ]),
    node() {
      return this.nodes.find(n => n.id == this.nodeId);
    },
    portPos() {
      return {x: this.node.x + this.data.x, y: this.node.y + this.data.y};
    },
    distFromMouseToDraggingPort() {
      return this.getDist(this.portPos.x, this.portPos.y, this.draggingPort.mouseX, this.draggingPort.mouseY);
    }
  },
  methods: {
    ...mapMutations([
      'setDraggingPort',
      'setCanCreateFile',
      'addSourceToNode',
      'setDraggingPortStatus',
      'setDraggingPortMousePos',
      'addInputFile',
      'addOutputFile',
    ]),
    dragStart() {
      this.setDraggingPort({type: this.type, nodeId: this.nodeId, portId: this.data.id});
    },
    dragging() {
      this.setDraggingPortStatus('dragging');
      this.setDraggingPortMousePos({x: this.portPos.x + d3.event.x, y: this.portPos.y + d3.event.y});
      let minPortDist = this.getMinDistPort().dist;
      if(this.distFromMouseToDraggingPort > 50 && minPortDist > 50) {
        this.setCanCreateFile(true);
      } else {
        this.setCanCreateFile(false);
      }
    },
    dragEnd() {
      this.setDraggingPortStatus('none');
      this.setCanCreateFile(false);
      let minDistPort = this.getMinDistPort();
      if(minDistPort.dist < 50) {
        this.addSourceToNode(minDistPort);
      } else if(this.distFromMouseToDraggingPort >= 50) {
        if(this.draggingPort.type == 'input') {
          this.addInputFile();
        } else {
          this.addOutputFile();
        }
      }
    },
    getMinDistPort() {
      let minDist = Number.MAX_VALUE;
      let minPortId = '';
      let minNodeId = '';

      if(this.draggingPort.type == 'input') return this.getDistsFromOutputPorts();
      else return this.getDistsFromInputPorts();
    },
    getDistsFromInputPorts() {
      let minDist = Number.MAX_VALUE;
      let minPortId = '';
      let minNodeId = '';

      this.nodes.map((node, nIdx) => {
        node.inputs.map((port, pIdx) => {
          let dist = this.getDist(this.draggingPort.mouseX, this.draggingPort.mouseY, node.x + port.x, node.y + port.y);
          if(dist < minDist) {
            minDist = dist;
            minNodeId = node.id;
            minPortId = port.id;
          }
        });
      });
      return {dist: minDist, portId: minPortId, nodeId: minNodeId};
    },
    getDistsFromOutputPorts() {
      let minDist = Number.MAX_VALUE;
      let minPortId = '';
      let minNodeId = '';

      this.nodes.map((node, nIdx) => {
        node.outputs.map((port, pIdx) => {
          let dist = this.getDist(this.draggingPort.mouseX, this.draggingPort.mouseY, this.portPos.x, this.portPos.y);
          if(dist < minDist) {
            minDist = dist;
            minNodeId = node.id;
            minPortId = port.id;
          }
        });
      });
      return {dist: minDist, portId: minPortId, nodeId: minNodeId};
    },
    getDist(x1, y1, x2, y2) {
      let a = x1 - x2;
      let b = y1 - y2;
      return Math.sqrt(a*a + b*b);
    },
  },
  mounted() {
    const drag = d3.drag().on('start', this.dragStart).on('drag', this.dragging).on('end', this.dragEnd);
    d3.select(this.$refs.port).call(drag);
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