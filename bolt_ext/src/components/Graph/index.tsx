import React, { useState, useEffect, useRef } from 'react';
import Node from './Node';
import Edge from './Edge';
import { useForceSimulation } from '../../hooks/useForceSimulation';
import { GraphData } from '../../types/graph';

interface GraphProps {
  data: GraphData;
  width?: number;
  height?: number;
}

const Graph: React.FC<GraphProps> = ({ data, width: propWidth, height: propHeight }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Update dimensions when container or props change
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: propWidth || clientWidth,
          height: propHeight || clientHeight
        });
      }
    };
    
    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [propWidth, propHeight]);
  
  // Initialize force simulation
  const { nodes, links, handleDrag } = useForceSimulation(
    data,
    dimensions.width,
    dimensions.height
  );
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[500px] bg-gray-50 rounded-lg overflow-hidden shadow-lg"
    >
      <svg width={dimensions.width} height={dimensions.height} className="graph-container">
        <g className="links">
          {links.map((link, i) => (
            <Edge key={`edge-${i}`} edge={link} />
          ))}
        </g>
        <g className="nodes">
          {nodes.map(node => (
            <Node key={`node-${node.id}`} node={node} handleDrag={handleDrag} />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default Graph;