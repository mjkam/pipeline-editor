<template>
  <g 
    :transform="`matrix(1, 0, 0, 1, ${draggingPort.currentX}, ${draggingPort.currentY})`" 
    v-on="isPortClicked ? { mousemove : handlePortDrag, mouseup: handlePortMouseUp } : null"
    data-type="output" 
    class="ghost node">
    <circle class="ghost-circle" cx="0" cy="0" r="20"></circle>
  </g>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'GhostCircle',
  props: {},
  computed: {
    ...mapGetters([
      'draggingPort',
      'isPortClicked',
      'mouseSVGPos',
      'steps',
      'dragPortType',
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
      'setPath',
    ]),
    handlePortDrag(e) {
      this.setIsPortDraggingStatus(true);
      let currentPos = this.mouseSVGPos(e.clientX, e.clientY);
      this.setDraggingPortPos({x: currentPos.x, y: currentPos.y});
      //위치 업데이트 -> 점선 패쓰 그려짐
    },
    handlePortMouseUp(e) {
      let o = this.getMinDistNode(this.mouseSVGPos(e.clientX, e.clientY));
      this.setPath(o);

      this.setIsPortClickedStatus(false);
      this.setIsPortDraggingStatus(false);
    },
    getDist(x1, y1, x2, y2) {
      let a = x1 -x2;
      let b = y1 - y2;
      return Math.sqrt(a*a + b*b);
    },
    getMinDistNode(curPos) {
      let nodeIdx;
      let nodeId;
      let portIdx;
      let portId;
      let minDist = Number.MAX_VALUE;
      let portType = "";
      this.steps.map((step, sIdx) => {
        let nodeX = step.svgX;
        let nodeY = step.svgY;

        if(this.dragPortType == "input") {
          step.outputs.map((p, pIdx) => {
            let dist = this.getDist(curPos.x, curPos.y, nodeX + p.x, nodeY + p.y);
            if(dist < minDist) {
              minDist = dist;
              nodeIdx = sIdx;
              nodeId = step.id;
              portIdx = pIdx;
              portId = p.id;
              portType = "output"; 
            }
          });
        } else {
          step.inputs.map((p, pIdx) => {
            let dist = this.getDist(curPos.x, curPos.y, nodeX + p.x, nodeY + p.y);
            if(dist < minDist) {
              minDist = dist;
              nodeIdx = sIdx;
              nodeId = this.draggingPort.sourceNodeId;
              portIdx = pIdx;
              portId = this.draggingPort.portId;
              portType = "input";
            }
          });
        }
      });
      return {dist: minDist, nIdx: nodeIdx, nId: nodeId, pIdx: portIdx, pId: portId, portType: portType};
    }
  }
}


</script>

<style lang="scss" scoped>
.ghost {
  stroke: #c3c3c3;
  stroke-width: 2px;
  stroke-dasharray: 5 3;
  fill: transparent;
}

.visible {
  
}

</style>