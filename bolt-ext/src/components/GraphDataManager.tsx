import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { GraphData, NodeData, EdgeData } from '../types/graph';

interface GraphDataManagerProps {
  onDataUpdate: (data: GraphData) => void;
}

const GraphDataManager: React.FC<GraphDataManagerProps> = ({ onDataUpdate }) => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [newNode, setNewNode] = useState({ id: '', label: '', url: '' });
  const [newEdge, setNewEdge] = useState({ source: '', target: '' });
  
  const handleAddNode = () => {
    if (!newNode.label || !newNode.url) return;
    
    const node: NodeData = {
      id: newNode.id || String(nodes.length + 1),
      label: newNode.label,
      url: newNode.url,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    
    const updatedNodes = [...nodes, node];
    setNodes(updatedNodes);
    setNewNode({ id: '', label: '', url: '' });
    
    updateGraph(updatedNodes);
  };
  
  const handleAddEdge = () => {
    if (!newEdge.source || !newEdge.target) return;
    
    const updatedLinks = [
      ...links,
      { source: newEdge.source, target: newEdge.target, value: 3 }
    ];
    setLinks(updatedLinks);
    setNewEdge({ source: '', target: '' });
    
    updateGraph(nodes, updatedLinks);
  };
  
  const [links, setLinks] = useState<EdgeData[]>([]);
  
  const handleRemoveNode = (id: string) => {
    const updatedNodes = nodes.filter(node => node.id !== id);
    const updatedLinks = links.filter(
      link => link.source !== id && link.target !== id
    );
    setNodes(updatedNodes);
    setLinks(updatedLinks);
    updateGraph(updatedNodes, updatedLinks);
  };
  
  const updateGraph = (updatedNodes = nodes, updatedLinks = links) => {
    onDataUpdate({ nodes: updatedNodes, links: updatedLinks });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Graph Data Manager</h2>
      
      {/* Add Node Form */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Add Node</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ID (optional)"
            value={newNode.id}
            onChange={e => setNewNode({ ...newNode, id: e.target.value })}
            className="flex-1 px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Label"
            value={newNode.label}
            onChange={e => setNewNode({ ...newNode, label: e.target.value })}
            className="flex-1 px-3 py-2 border rounded"
          />
          <input
            type="url"
            placeholder="URL"
            value={newNode.url}
            onChange={e => setNewNode({ ...newNode, url: e.target.value })}
            className="flex-2 px-3 py-2 border rounded"
          />
          <button
            onClick={handleAddNode}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      {/* Add Edge Form */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Add Edge</h3>
        <div className="flex gap-2">
          <select
            value={newEdge.source}
            onChange={e => setNewEdge({ ...newEdge, source: e.target.value })}
            className="flex-1 px-3 py-2 border rounded"
          >
            <option value="">Select source node</option>
            {nodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
          <select
            value={newEdge.target}
            onChange={e => setNewEdge({ ...newEdge, target: e.target.value })}
            className="flex-1 px-3 py-2 border rounded"
          >
            <option value="">Select target node</option>
            {nodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddEdge}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      {/* Node List */}
      <div>
        <h3 className="font-medium mb-2">Nodes</h3>
        <div className="space-y-2">
          {nodes.map(node => (
            <div
              key={node.id}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <span>
                {node.label} ({node.url})
              </span>
              <button
                onClick={() => handleRemoveNode(node.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphDataManager;