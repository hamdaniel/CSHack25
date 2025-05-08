import React, { useRef, useEffect } from 'react';
import { NodeData } from '../../types/graph';

interface NodeProps {
  node: NodeData;
  handleDrag: (nodeRef: React.RefObject<SVGGElement>, node: NodeData) => void;
}

const Node: React.FC<NodeProps> = ({ node, handleDrag }) => {
  const nodeRef = useRef<SVGGElement>(null);
  
  // Apply drag behavior
  useEffect(() => {
    if (nodeRef.current) {
      handleDrag(nodeRef, node);
    }
  }, [node, handleDrag]);
  
  // Handle node click - open URL
  const handleNodeClick = () => {
    if (node.url) {
      window.open(node.url, '_blank');
    }
  };
  
  // Calculate node properties
  const nodeRadius = node.size || 30;
  const nodeColor = node.color || '#999';
  
  return (
    <g
      ref={nodeRef}
      className="graph-node cursor-pointer"
      transform={`translate(${node.x || 0},${node.y || 0})`}
      onClick={handleNodeClick}
    >
      <defs>
        <radialGradient id={`gradient-${node.id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={`${nodeColor}dd`} />
          <stop offset="100%" stopColor={`${nodeColor}aa`} />
        </radialGradient>
      </defs>
      
      {/* Node circle with gradient */}
      <circle
        r={nodeRadius}
        fill={`url(#gradient-${node.id})`}
        stroke={nodeColor}
        strokeWidth="2"
        className="node-circle transition-all duration-300 hover:filter hover:brightness-110"
      />
      
      {/* Node label */}
      <text
        dy=".35em"
        textAnchor="middle"
        fill="#fff"
        fontSize="12px"
        fontWeight="bold"
        className="select-none pointer-events-none"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
      >
        {node.label}
      </text>
    </g>
  );
};

export default Node;