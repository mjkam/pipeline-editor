<template>
  <div 
    id="app"
    v-on="newToolStatus != 'none' ? {mousemove: newToolMouseMoveHandler, mouseup: newToolMouseUpHandler} : null">
    <div class="left_container">
      <div 
        v-for="(tool, idx) in usableTools"
        class="usable_tool_item"
        :key="tool.name + idx"
        @mousedown="newToolClickHandler($event, tool)">
        {{ tool.name }}
      </div>
    </div>
    <div class="right_container">
      <svg class="cwl-workflow" ref="area"
        v-on="isDragMode ? {mousemove: areaMouseMoveHandler, mouseup: areaMouseUpHandler} : null">
        <rect x="0" y="0" width="100%" height="100%" class="pan-handle" transform="matrix(1, 0, 0, 1, 0, 0)"></rect>
        <svg class="workflow" tabindex="-1">
          <Tool
            v-for="(tool, idx) in pipeline.tools"
            :key="'tool' + idx"
            :idx="idx"
            :data="tool">
          </Tool>
          <File></File>
          <Edge 
            v-for="(edge, idx) in edges"
            :key="'edge'+idx"
            :data="edge">
          </Edge>
          <GhostCircle v-if="canCreateFile"></GhostCircle>
          <GhostEdge v-if="draggingPortStatus == 'dragging'"></GhostEdge>
        </svg>
      </svg>
    </div>
    <div class="drag-container" v-if="newToolStatus == 'dragging'" :style="draggingNewToolStyle">
      <div class="drag-image icon-command-line-tool"></div>
      <div class="drag-text">Dragging Tool</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import File from './File';
import Port from './Port';
import Tool from './Tool';
import GhostCircle from './GhostCircle';
import Edge from './Edge';
import GhostEdge from './GhostEdge';
import _ from 'lodash';

export default {
  name: 'app',
  components: {
    Port,
    Tool,
    GhostCircle,
    GhostEdge,
    Edge,
    File,
  },
  computed: {
    ...mapGetters([
      'usableTools',
      'newToolStatus',
      'draggingTool',
      'area',
      'pt',
      'pipeline',
      'draggingPortStatus',
      'draggingPort',
      'canCreateFile',
    ]),
    edges() {
      let edges = [];
      this.pipeline.tools.map((tool, tIdx) => {
        tool.inputs.map((input, pIdx) => {
          input.sources.map((source, sIdx) => {
            edges.push({
              sourceNodeIdx: source.nodeIdx,
              sourcePortIdx: source.portIdx,
              desNodeIdx: tIdx,
              desPortIdx: pIdx,
            })
          });
        });
      });
      return edges;
    },
    isDragMode() {
      if(this.draggingPortStatus != 'none') {
        return true;
      }
      return false;
    },
    draggingNewToolStyle() {
      let top = this.draggingTool.y - 65 / 2;
      let left = this.draggingTool.x - 75 / 2;
      return {top: top + 'px', left: left + 'px'};
    },
    distFromMouseToDraggingPort() {
      return this.getDist(this.draggingPort.portX, this.draggingPort.portY, this.draggingPort.mouseX, this.draggingPort.mouseY);
    }
  },
  methods: {
    ...mapMutations([
      'setNewToolStatus',
      'setDraggingNewTool',
      'setDraggingNewToolPos',
      'setArea',
      'addTool',
      'setDraggingPortMousePos',
      'setDraggingPortStatus',
      'setCanCreateFile',
      'addToolToPipeline',
    ]),
    newToolClickHandler(e, tool) {
      e.preventDefault();
      this.setNewToolStatus('clicked');
      let tmp = _.cloneDeep(tool);
      tmp.x = e.clientX; tmp.y = e.clientY;
      this.setDraggingNewTool(tool);
    },
    newToolMouseUpHandler(e) {
      e.preventDefault();
      //해당 위치에 툴 생김
      let top = this.area.getBoundingClientRect().top;
      let left = this.area.getBoundingClientRect().left;
      if(e.clientX > left) {
        let draggingTool = _.cloneDeep(this.draggingTool.tool);
        this.pt.x = e.clientX; this.pt.y = e.clientY;
        var pos = this.pt.matrixTransform(this.area.getScreenCTM().inverse());
        draggingTool.x = pos.x;
        draggingTool.y = pos.y;
        
        this.addTool(draggingTool);
      }
      this.setNewToolStatus('none');
    },
    newToolMouseMoveHandler(e) {
      e.preventDefault();
      this.setNewToolStatus('dragging');
      this.setDraggingNewToolPos({x: e.clientX, y: e.clientY});
    },
    areaMouseMoveHandler(e) {
      e.preventDefault();
      this.setDraggingPortStatus('dragging');
      this.setDraggingPortMousePos({x: e.clientX, y: e.clientY});
      let minPortDist = this.getMinDistPort().dist;
      if(this.distFromMouseToDraggingPort > 50 && minPortDist > 50) {
        this.setCanCreateFile(true);
      } else {
        this.setCanCreateFile(false);
      }
    },
    getMinDistPort() {
      let minDist = Number.MAX_VALUE;
      let minPortId = '';
      let minNodeId = '';
      let nodeIdx;
      let portIdx;

      this.pipeline.tools.map((tool, tIdx) => {
        if(this.draggingPort.type == 'input') {
          tool.outputs.map((port, pIdx) => {
            let dist = this.getDist(this.draggingPort.mouseX, this.draggingPort.mouseY, tool.x + port.x, tool.y + port.y);
            if(dist < minDist) {
              minDist = dist;
              minNodeId = tool.id;
              minPortId = port.id;
              nodeIdx = tIdx;
              portIdx = pIdx;
            }
          });
        } else {
          tool.inputs.map((port, pIdx) => {
            let dist = this.getDist(this.draggingPort.mouseX, this.draggingPort.mouseY, tool.x + port.x, tool.y + port.y);
            if(dist < minDist) {
              minDist = dist;
              minNodeId = tool.id;
              minPortId = port.id;
              nodeIdx = tIdx;
              portIdx = pIdx;
            }
          });
        }
      });

      return {dist: minDist, portId: minPortId, nodeId: minNodeId, nodeIdx: nodeIdx, portIdx: portIdx};
    },
    getDist(x1, y1, x2, y2) {
      let a = x1 - x2;
      let b = y1 - y2;
      return Math.sqrt(a*a + b*b);
    },
    areaMouseUpHandler(e) {
      e.preventDefault();
      this.setCanCreateFile(false);
      this.setDraggingPortStatus('none');
      let minDistPort = this.getMinDistPort();
      if(minDistPort.dist < 50) {
        this.addToolToPipeline(minDistPort);
      } else if(this.distFromMouseToDraggingPort >= 50) {
        if(this.draggingPort.type == 'input') {
          //input file
          
        } else {
          //output file
        }
      }
    }
  },
  mounted() {
    this.setArea(this.$refs.area);
  },
  created: function() {
    this.$store.dispatch('getAllTools');
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-size: 12px;
}

g {
  outline: none;
}

.icon-command-line-tool {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMTggMTE4Ij48dGl0bGU+dG9vbF9kcmFnPC90aXRsZT48ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIj48ZyBpZD0iTGF5ZXJfNV9jb3B5IiBkYXRhLW5hbWU9IkxheWVyIDUgY29weSI+PGcgaWQ9IkxheWVyXzJfY29weV8zIiBkYXRhLW5hbWU9IkxheWVyIDIgY29weSAzIj48Y2lyY2xlIGN4PSI1OSIgY3k9IjU5IiByPSI0MSIgc3R5bGU9ImZpbGw6IzVlOGViOCIvPjwvZz48ZyBpZD0iTGF5ZXJfMl9jb3B5XzMtMiIgZGF0YS1uYW1lPSJMYXllciAyIGNvcHkgMy0yIj48cGF0aCBkPSJNNTksMTE4YTU5LDU5LDAsMSwxLDU5LTU5aDBBNTkuMDcsNTkuMDcsMCwwLDEsNTksMTE4Wk01OSw2YTUzLDUzLDAsMSwwLDUzLDUzQTUzLDUzLDAsMCwwLDU5LDZaIiBzdHlsZT0iZmlsbDojYzRjNGM0Ii8+PC9nPjwvZz48L2c+PGcgaWQ9InRvb2wiPjxyZWN0IHg9IjYxLjgzIiB5PSI3NS42MiIgd2lkdGg9IjE3Ljk2IiBoZWlnaHQ9IjQuMTYiIHN0eWxlPSJmaWxsOiMyYzJjMmMiLz48cmVjdCB4PSIzNS4zOCIgeT0iNDcuOTgiIHdpZHRoPSIyOS4zOCIgaGVpZ2h0PSI0LjE2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MC4wNiAtMjAuNzQpIHJvdGF0ZSg0NSkiIHN0eWxlPSJmaWxsOiMyYzJjMmMiLz48cmVjdCB4PSIzNS4zOCIgeT0iNjUuODYiIHdpZHRoPSIyOS4zOSIgaGVpZ2h0PSI0LjE2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMzMuNTIgODAuNTcpIHJvdGF0ZSgxMzUpIiBzdHlsZT0iZmlsbDojMmMyYzJjIi8+PC9nPjwvc3ZnPg==) no-repeat;
}

.drag-container {
  position: fixed;

  > .drag-image {
    width: 75px;
    height: 65px;
    opacity: .95;
    margin: 0 auto;
  }
}

svg {
  background: #f8f8f8;
  cursor: pointer;
}

.workflow {
  outline: none;
}


</style>

<style lang="scss" scoped>

.usable_tool_item {
  border: 1px solid;
}

.left_container {
  float: left;
  width: 200px;
  height: 800px;
  background: blue;
}

.right_container {
  float: left;
  width: 600px;
  height: 800px;
  
  background: green;
}

.cwl-workflow {
  width: 100%;
  height: 100%;
  user-select: none;
}

.workflow {
  width: 100%;
  height: 100%;
  transform: translateZ(0);
}

.pan-handle {
  fill: transparent;
}
</style>