import editor from '../../api/editor';
import _ from 'lodash';

const state ={
  pt: null,
  area: null,
  usableTools: [],
  draggingTool: {},
  newToolStatus: 'none',
  pipeline: {
    inputs: [],
    outputs: [],
    tools: []
  },
  toolId: 0,
  draggingPort: {},
  draggingPortStatus: 'none',
  canCreateFile: false,
};

const getters = {
  usableTools: state => state.usableTools,
  newToolStatus: state => state.newToolStatus,
  draggingTool: state => state.draggingTool,
  area: state => state.area,
  pt: state => state.pt,
  pipeline: state => state.pipeline,
  draggingPortStatus: state => state.draggingPortStatus,
  draggingPort: state => state.draggingPort,
  canCreateFile: state => state.canCreateFile,
};



const mutations = {
  setArea(state, area) {
    state.area = area;
    state.pt = state.area.createSVGPoint();
  },
  setTools (state, tools) {
    state.usableTools = tools;
  },
  setNewToolStatus(state, current) {
    state.newToolStatus = current;
  },
  setDraggingNewToolPos(state, {x, y}) {
    let tmp = _.cloneDeep(state.draggingTool);
    tmp.x = x; tmp.y = y;
    state.draggingTool = tmp;
  },
  setDraggingNewTool(state, tool) {
    state.draggingTool.tool = tool;
  },
  addTool(state, tool) {
    tool.id = state.toolId;
    state.toolId = state.toolId + 1;
    state.pipeline.tools.push(tool);
  },
  setDraggingPortStatus(state, current) {
    state.draggingPortStatus = current;
  },
  setDraggingPort(state, {type, nodeIdx, portIdx, portX, portY}) {
    state.draggingPort = {
      type: type,
      nodeIdx: nodeIdx,
      portIdx: portIdx,
      portX: portX,
      portY: portY,
    };
  },
  setDraggingPortMousePos(state, {x, y}) {
    let tmp = _.cloneDeep(state.draggingPort);
    state.pt.x = x;
    state.pt.y = y;
    let pos = state.pt.matrixTransform(state.area.getScreenCTM().inverse());
    tmp.mouseX = pos.x; tmp.mouseY = pos.y;
    state.draggingPort = tmp;
  },
  setCanCreateFile(state, current) {
    state.canCreateFile = current;
  },
  addToolToPipeline(state, minDistPort) {
    if(state.draggingPort.type == 'output') {
      console.log(minDistPort.nodeIdx);
      let sources = state.pipeline.tools[minDistPort.nodeIdx].inputs[minDistPort.portIdx].sources;
      let source = {
        nodeIdx: state.draggingPort.nodeIdx,
        portIdx: state.draggingPort.portIdx,
      }
      if(sources == null) sources = [source];
      else sources.push(source);
    } else {
      let sources = state.pipeline.tools[state.draggingPort.nodeIdx].inputs[state.draggingPort.portIdx].sources;
      let source = {
        nodeIdx: minDistPort.nodeIdx,
        portIdx: minDistPort.portIdx,
      }
      if(sources == null) sources = [source];
      else sources.push(source);
    }
  },
  addInputFile(state) {
    let file = {
      name: state.draggingPort.id,
      label: state.draggingPort.label,
      r: 37,
      x: state.draggingPort.mouseX,
      y: state.draggingPort.mouseY,
      inputs: [],
      outputs: [
        {
          id: state.draggingPort.id,
          label: state.draggingPort.label,
          x: 37,
          y: 0,
        }
      ]
    };
    state.pipeline.inputs.push(file);
  },
  addOutputFile(state) {

  }
}


const actions = {
  getAllTools ({ commit }) {
    editor.getTools(tools => {
      commit('setTools', tools)
    })
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}

/*
draggingTool
1. click
{
  portType: "input | output",
  portId: "",
  nodeId: "",
  x, y
}

2. drag 
mouseX, mouseY 업데이트
GhostEdge, circle 그려야함

3. 놓으면
output만 =>  port안에다가 sourceNodeId, sourcePortId 삽입*/