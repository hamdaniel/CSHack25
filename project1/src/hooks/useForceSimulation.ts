import { useEffect, useRef, useState } from 'react';
import * as d3Force from 'd3-force';
import * as d3Drag from 'd3-drag';
import * as d3Selection from 'd3-selection';
import { GraphData, NodeData, EdgeData } from '../types/graph';

export const useForceSimulation = (graphData: GraphData, width: number, height: number) => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [links, setLinks] = useState<EdgeData[]>([]);
  const simulationRef = useRef<d3Force.Simulation<NodeData, EdgeData> | null>(null);
  
  useEffect(() => {
    if (!graphData || !width || !height) return;
    
    const nodesClone = JSON.parse(JSON.stringify(graphData.nodes)) as NodeData[];
    
    const simulation = d3Force.forceSimulation<NodeData, EdgeData>(nodesClone)
      .force('link', d3Force.forceLink<NodeData, EdgeData>()
        .id(d => d.id)
        .distance(100)
        .strength(0.1))
      .force('charge', d3Force.forceManyBody().strength(-300))
      .force('center', d3Force.forceCenter(width / 2, height / 2))
      .force('collision', d3Force.forceCollide().radius(50))
      // Add boundary forces
      .force('x', d3Force.forceX(width / 2).strength(0.1))
      .force('y', d3Force.forceY(height / 2).strength(0.1));
      
    const linksClone = JSON.parse(JSON.stringify(graphData.links)) as EdgeData[];
    
    linksClone.forEach(link => {
      if (typeof link.source === 'string') {
        link.source = nodesClone.find(node => node.id === link.source) as NodeData;
      }
      if (typeof link.target === 'string') {
        link.target = nodesClone.find(node => node.id === link.target) as NodeData;
      }
    });
    
    (simulation.force('link') as d3Force.ForceLink<NodeData, EdgeData>).links(linksClone);
    
    simulation.on('tick', () => {
      // Constrain nodes within boundaries
      nodesClone.forEach(node => {
        node.x = Math.max(50, Math.min(width - 50, node.x || 0));
        node.y = Math.max(50, Math.min(height - 50, node.y || 0));
      });
      
      setNodes([...nodesClone]);
      setLinks([...linksClone]);
    });
    
    simulationRef.current = simulation;
    
    setNodes(nodesClone);
    setLinks(linksClone);
    
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graphData, width, height]);
  
  const handleDrag = (nodeRef: React.RefObject<SVGGElement>, node: NodeData) => {
    if (!nodeRef.current) return;
    
    const dragBehavior = d3Drag.drag<SVGGElement, unknown>()
      .on('start', (event) => {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0.3).restart();
        }
        node.fx = node.x;
        node.fy = node.y;
      })
      .on('drag', (event) => {
        // Constrain drag within boundaries
        node.fx = Math.max(50, Math.min(width - 50, event.x));
        node.fy = Math.max(50, Math.min(height - 50, event.y));
      })
      .on('end', (event) => {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0);
        }
        node.fx = Math.max(50, Math.min(width - 50, event.x));
        node.fy = Math.max(50, Math.min(height - 50, event.y));
      });
      
    d3Selection.select(nodeRef.current).call(dragBehavior);
  };
  
  return { nodes, links, handleDrag };
};