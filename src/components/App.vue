<template>
  <div 
    id="app"
    v-on="isClicked ? { mousemove : toolItemDrag, mouseup: toolItemUnClick } : null">
    <div class="left_container">
      <div 
        v-for="tool in tools" 
        @mousedown="toolItemClick($event, tool)"
        :key="tool.nameId" 
        class="list_item">{{ tool.name }}
      </div>
    </div>
    <div class="right_container">
      <svg class="cwl-workflow" ref="svgarea">
        <rect x="0" y="0" width="100%" height="100%" class="pan-handle" transform="matrix(1, 0, 0, 1, 0, 0)"></rect>
        <svg class="workflow" tabindex="-1">
          <Node
            v-for="(tool, index) in steps"
            :key="tool.id"
            :idx="index">
          </Node>
          <Edge 
            v-for="(edge, idx) in edges"
            :key="`edge`+idx"
            :info="edge"></Edge>
          <VirtualEdge v-if="isPortDragging"></VirtualEdge>
          <GhostCircle v-if="isPortDragging"></GhostCircle>
        </svg>
      </svg>
    </div>
    <div v-if="isDragging" class="drag-container" :style="{top: draggingTool.y, left: draggingTool.x}">
      <div class="drag-image icon-command-line-tool"></div>
      <div class="drag-text">BWA INDEX</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import Node from './Node';
import GhostCircle from './GhostCircle';
import Edge from './Edge';
import VirtualEdge from './VirtualEdge';
import _ from 'lodash';

export default {
  name: 'app',
  components: {
    Node,
    GhostCircle,
    VirtualEdge,
    Edge,
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
    edges() {
      console.log("edges called");
      //let edges = this.steps.filter(step => step.inputs.some(input => input.sourceNodeId != null));
      let edges = [];
      this.steps.map(step => {
        step.inputs.map(input => {
          if(input.sourceNodeId != null) {
            input.desX = step.svgX + input.x;
            input.desY = step.svgY + input.y;
            edges.push(input);
          }
        });
      });
      return edges;
    }
  },
  methods: {
    ...mapMutations([
      'setIsClicked',
      'setDraggingToolPos',
      'setIsDragging',
      'setDraggingTool',
      'setDraggingToolSVGPos',
      'addTool',
      'setSVGAreaAndPt',
      'updateSVGPos',
      'setIsDragMode',
    ]),
    toolItemClick(e, tool) {
      e.preventDefault();
      var tmp = _.cloneDeep(tool);
      tmp.x = e.clientX + 'px';
      tmp.y = e.clientY + 'px';
      this.setDraggingTool(tmp);
      this.setIsClicked(true);
    },
    toolItemUnClick: function(e) {
      e.preventDefault();

      let top = this.$refs.svgarea.getBoundingClientRect().top;
      let left = this.$refs.svgarea.getBoundingClientRect().left;
      if(e.clientX > left) {
        let draggingTool = _.cloneDeep(this.draggingTool);
        var svg = this.$refs.svgarea;

        // Create an SVGPoint for future math
        var pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        var pos = pt.matrixTransform(svg.getScreenCTM().inverse());
        draggingTool.svgX = pos.x;
        draggingTool.svgY = pos.y;
        
        this.addTool(draggingTool);
      }


      this.setIsDragging(false);
      this.setIsClicked(false)
    },
    toolItemDrag: function(e) {
      e.preventDefault();
      this.setIsDragging(true);
      this.setDraggingToolPos({x: e.clientX, y: e.clientY});
    },
    toolItemDragInSVG: function(e) {
      this.setDraggingToolSVGPos({x: e.clientX, y: e.clientY});
    },
  },
  created: function() {
    this.$store.dispatch('getAllTools');
  },
  mounted: function() {
    this.setSVGAreaAndPt(this.$refs.svgarea);
  },
  handleMouseMove: function(e) {
    let pos = this.mouseSVGPos(e.clientX, e.clientY);
    this.updateSVGPos({x: pos.x, y: pos.y});
  },
  handleMouseUp: function(e) {
    this.setIsDragMode(false);
  }
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