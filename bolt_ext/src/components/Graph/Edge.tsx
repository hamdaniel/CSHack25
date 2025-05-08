import React from 'react';
import { EdgeData } from '../../types/graph';

interface EdgeProps {
  edge: EdgeData;
}

const Edge: React.FC<EdgeProps> = ({ edge }) => {
  if (!edge.source || !edge.target) return null;
  
  // Extract coordinates
  const sourceNode = edge.source as any;
  const targetNode = edge.target as any;
  
  if (!sourceNode.x || !targetNode.x) return null;
  
  // Calculate edge properties
  const strokeWidth = edge.value ? Math.max(1, Math.min(edge.value, 10)) : 1;
  const edgeColor = edge.color || '#999';
  
  return (
    <line
      x1={sourceNode.x}
      y1={sourceNode.y}
      x2={targetNode.x}
      y2={targetNode.y}
      stroke={edgeColor}
      strokeWidth={strokeWidth}
      strokeOpacity={0.6}
      className="graph-edge"
    />
  );
};

export default Edge;