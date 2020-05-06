import editor from '../../api/editor';
import _ from 'lodash';

const state ={
  pt: null,
  area: null,
  usableTools: [],
  draggingTool: {},
  newToolStatus: 'none',
  nodes: [],
  nodeId: 0,
  draggingPort: {},
  draggingPortStatus: 'none',
  draggingNodeStatus: 'none',
  draggingNode: {},
  canCreateFile: false,
};

const getters = {
  usableTools: state => state.usableTools,
  newToolStatus: state => state.newToolStatus,
  draggingTool: state => state.draggingTool,
  area: state => state.area,
  pt: state => state.pt,
  nodes: state => state.nodes,
  draggingPortStatus: state => state.draggingPortStatus,
  draggingPort: state => state.draggingPort,
  canCreateFile: state => state.canCreateFile,
  draggingNodeStatus: state => state.draggingNodeStatus,
  draggingNode: state => state.draggingNode,
};



const mutations = {
  setDraggingNode(state, node) {
    state.draggingNode = node;
  },
  setDraggingNodeStatus(state, current) {
    state.draggingNodeStatus = current;
  },
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
  addNode(state, node) {
    node.id = state.nodeId;
    state.nodeId = state.nodeId + 1;
    state.nodes.push(node);
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
      let sources = state.nodes[minDistPort.nodeIdx].inputs[minDistPort.portIdx].sources;
      let source = {
        nodeIdx: state.draggingPort.nodeIdx,
        portIdx: state.draggingPort.portIdx,
      }
      if(sources == null) sources = [source];
      else sources.push(source);
    } else {
      let sources = state.nodes[state.draggingPort.nodeIdx].inputs[state.draggingPort.portIdx].sources;
      let source = {
        nodeIdx: minDistPort.nodeIdx,
        portIdx: minDistPort.portIdx,
      }
      if(sources == null) sources = [source];
      else sources.push(source);
    }
  },
  addInputFile(state) {
    let port = state.nodes[state.draggingPort.nodeIdx].inputs[state.draggingPort.portIdx];
    let file = {
      type: 'input',
      name: port.id,
      label: port.label,
      r: 37,
      x: state.draggingPort.mouseX,
      y: state.draggingPort.mouseY,
      inputs: [],
      outputs: [
        {
          id: port.id,
          label: port.label,
          x: 37,
          y: 0,
        }
      ]
    };
    file.id = state.nodeId;
    state.nodeId += 1;
    state.nodes.push(file);
    let sources = state.nodes[state.draggingPort.nodeIdx].inputs[state.draggingPort.portIdx].sources;
    let source = {
      nodeIdx: state.nodes.findIndex(n => n.id == file.id),
      portIdx: 0,
    }
    if(sources == null) sources = [source];
    else sources.push(source);
  },
  addOutputFile(state) {
    let port = state.nodes[state.draggingPort.nodeIdx].inputs[state.draggingPort.portIdx];
    let file = {
      type: 'output',
      name: port.id,
      label: port.label,
      r: 37,
      x: state.draggingPort.mouseX,
      y: state.draggingPort.mouseY,
      inputs: [
        {
          id: port.id,
          label: port.label,
          sources: [
            {
              nodeIdx: state.draggingPort.nodeIdx,
              portIdx: state.draggingPort.portIdx,
            }
          ],
          x: 37,
          y: 0,
        }
      ],
      outputs: [
      ]
    };
    file.id = state.nodeId;
    state.nodeId += 1;
    state.nodes.push(file);
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