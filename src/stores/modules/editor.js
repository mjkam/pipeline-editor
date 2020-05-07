import editor from '../../api/editor';
import _ from 'lodash';
import * as d3 from 'd3';

const state ={
  pt: null,
  area: null,
  usableTools: [],
  draggingTool: {},
  newToolStatus: 'none',
  nodes: [],
  nodeId: 0,
  draggingPort: {},
  draggingNode: {},
  draggingPortStatus: 'none',
  canCreateFile: false,
};

const getters = {
  usableTools: state => state.usableTools,
  newToolStatus: state => state.newToolStatus,
  draggingTool: state => state.draggingTool,
  area: state => state.area,
  pt: state => state.pt,
  nodes: state => state.nodes,
  draggingPort: state => state.draggingPort,
  canCreateFile: state => state.canCreateFile,
  draggingNode: state => state.draggingNode,
  draggingPortStatus: state => state.draggingPortStatus,
};



const mutations = {
  setDraggingPortStatus(state, current) {
    state.draggingPortStatus = current;
  },
  setDraggingNodePos(state, {x, y}) {
    let tmp = _.cloneDeep(state.nodes.find(n => n.id == state.draggingNode.id));
    tmp.x += (x - state.draggingNode.startX);
    tmp.y += (y - state.draggingNode.startY);
    state.nodes.splice(state.nodes.findIndex(n => n.id == state.draggingNode.id), 1, tmp);
  },
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
  setDraggingPort(state, {type, nodeId, portId}) {
    state.draggingPort = {
      type: type,
      nodeId: nodeId,
      portId: portId,
    };
  },
  setDraggingPortMousePos(state, {x, y}) {
    let tmp = _.cloneDeep(state.draggingPort);
    tmp.mouseX = x; tmp.mouseY = y;
    state.draggingPort = tmp;
  },
  setCanCreateFile(state, current) {
    state.canCreateFile = current;
  },
  addSourceToNode(state, minDistPort) {
    if(state.draggingPort.type == 'output') {
      let sources = state.nodes.find(n => n.id == minDistPort.nodeId).inputs.find(port => port.id == minDistPort.portId).sources;
      let source = {
        nodeId: state.draggingPort.nodeId,
        portId: state.draggingPort.portId,
      }
      if(sources == null) sources = [source];
      else sources.push(source);
    } else {
      let sources = state.nodes[state.draggingPort.nodeIdx].inputs[state.draggingPort.portIdx].sources;
      let source = {
        nodeId: minDistPort.nodeId,
        portId: minDistPort.portId,
      }
      if(sources == null) sources = [source];
      else sources.push(source);
    }
  },
  addInputFile(state) {
    let port = state.nodes.find(n => n.id == state.draggingPort.nodeId).inputs.find(p => p.id == state.draggingPort.portId);
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
    let sources = port.sources;
    let source = {
      nodeId: file.id,
      portId: port.id,
    }
    if(sources == null) sources = [source];
    else sources.push(source);
  },
  addOutputFile(state) {
    let port = state.nodes.find(n => n.id == state.draggingPort.nodeId).outputs.find(p => p.id == state.draggingPort.portId);
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
              nodeId: state.draggingPort.nodeId,
              portId: state.draggingPort.portId,
            }
          ],
          x: -37,
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