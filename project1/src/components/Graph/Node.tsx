import React, { useRef, useEffect } from 'react';
import { NodeData } from '../../types/graph';

interface NodeProps {
  node: NodeData;
  handleDrag: (nodeRef: React.RefObject<SVGGElement>, node: NodeData) => void;
}

const Node: React.FC<NodeProps> = ({ node, handleDrag }) => {
  const nodeRef = useRef<SVGGElement>(null);
  
  useEffect(() => {
    if (nodeRef.current) {
      handleDrag(nodeRef, node);
    }
  }, [node, handleDrag]);
  
  const handleNodeClick = () => {
    if (node.url) {
      chrome.tabs.create({ url: node.url, active: false });
    }
  };
  
  const nodeRadius = node.size || 30;
  const nodeColor = node.color || '#999';
  const gradientId = `gradient-${node.id.replace(/[^a-zA-Z0-9]/g, '-')}`;
  const label = node.label.replace('.com', '');
  const isClickable = Boolean(node.url);
  
  return (
    <g
      ref={nodeRef}
      className={`graph-node ${isClickable ? 'cursor-pointer' : 'cursor-grab'}`}
      transform={`translate(${node.x || 0},${node.y || 0})`}
      onClick={handleNodeClick}
      style={{ opacity: isClickable ? 1 : 0.7 }}
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="white" />
          <stop offset="40%" stopColor="white" />
          <stop offset="80%" stopColor={nodeColor} />
        </radialGradient>
      </defs>
      
      <circle
        r={nodeRadius}
        fill={`url(#${gradientId})`}
        stroke={nodeColor}
        strokeWidth="2"
        className="node-circle transition-all duration-300 hover:filter hover:brightness-110"
      />
      
      {isClickable && (
        <circle
          r={nodeRadius + 4}
          fill="none"
          stroke={nodeColor}
          strokeWidth="1"
          strokeDasharray="4 2"
          className="animate-[spin_10s_linear_infinite]"
          opacity={0.3}
        />
      )}
      
      <text
        dy=".35em"
        textAnchor="middle"
        fill="#333"
        fontSize="10px"
        fontWeight="bold"
        className="select-none pointer-events-none"
        style={{ textShadow: '0 1px 3px rgba(255,255,255,0.5)' }}
      >
        {label}
      </text>
    </g>
  );
};

export default Node;