import editor from '../../api/editor';
import _ from 'lodash';

// initial state
const state = {
  tools: [],
  pipeline: {
    inputs: [],
    outputs: [],
    steps: []
  },
  isClicked: false,
  isDragging: false,
  draggingTool: {},
  toolId: 1,
  pt: null,
  svgarea: null,
  isNodeClicked: false,
  isPortClicked: false,
  isPortDragging: false,
  draggingPort: {
    portId: null,
    portLabel: null,
    sourceX: null,
    sourceY: null,
    currentX: null,
    currentY: null,
  },
}

// getters
const getters = {
  tools: state => {
    return state.tools;
  },
  isClicked: state => state.isClicked,
  isDragging: state => state.isDragging,
  draggingTool: state => state.draggingTool,
  steps: state => state.pipeline.steps,
  getStepByIdx: (state) => (idx) => {
    return state.pipeline.steps[idx];
  },
  nodeClicked: state => state.isNodeClicked,
  isPortClicked: state => state.isPortClicked,
  isPortDragging: state => state.isPortDragging,
  mouseSVGPos: state => (x, y) => {
    this.pt.x = x;
    this.pt.y = y;
    return pt.matrixTransform(this.svg.getScreenCTM().inverse());
  }
}

const actions = {
  getAllTools ({ commit }) {
    editor.getTools(tools => {
      commit('setTools', tools)
    })
  }
}

// mutations
const mutations = {
  setTools (state, tools) {
    state.tools = tools;
  },
  setIsClicked (state, current) {
    state.isClicked = current;
  },
  setDraggingToolPos(state, {x, y}) {
    var xPos = x - 75 / 2 + 'px';
    var yPos = y - 65 / 2 + 'px';
    var tmp = _.cloneDeep(state.draggingTool);
    tmp.x = xPos;
    tmp.y = yPos;
    state.draggingTool = tmp;
  },
  setIsDragging(state, current) {
    state.isDragging = current;
  },
  setDraggingTool(state, tool) {
    state.draggingTool = tool;
  },
  setDraggingToolSVGPos(state, {x, y}) {
    state.pt.x = x;
    state.pt.y = y;
    let pos = pt.matrixTransform(state.svgarea.getScreenCTM().inverse());
    state.draggingTool.svgX = pos.x;
    state.draggingTool.svgY = pos.Y;
  },
  setSVGAreaAndPt(state, svgRef) {
    state.svgarea = svgRef;
    state.pt = state.svgarea.createSVGPoint();
  },
  addTool(state, tool) {
    tool.id = state.toolId;
    state.toolId = state.toolId + 1;
    state.pipeline.steps.push(tool);
  },
  moveNode (state, pos) {
    let idx = pos.idx;
    state.pt.x = pos.x; state.pt.y = pos.y;
    var pos = state.pt.matrixTransform(state.svgarea.getScreenCTM().inverse());
    let newObj = _.cloneDeep(state.pipeline.steps[idx]);
    newObj.svgX = pos.x;
    newObj.svgY = pos.y;
    state.pipeline.steps.splice(idx, 1, newObj);
  },
  setNodeClicked (state, current) {
    state.isNodeClicked = current;
  },
  setIsPortClickedStatus(state, current) {
    state.isPortClicked = current;
  },
  setDraggingPortInfo(state, {portId, portLabel, sourceX, sourceY}) {
    let tmp = _.cloneDeep(state.draggingPort);
    tmp.portId = portId;
    tmp.portLabel = portLabel;
    tmp.sourceX = sourceX;
    tmp.sourceY = sourceY;

    state.draggingPort = tmp;
  }
  
}


export default {
  state,
  getters,
  actions,
  mutations
}