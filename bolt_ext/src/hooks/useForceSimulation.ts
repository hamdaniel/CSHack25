import { useEffect, useRef, useState } from 'react';
import * as d3Force from 'd3-force';
import * as d3Drag from 'd3-drag';
import * as d3Selection from 'd3-selection';
import { GraphData, NodeData, EdgeData } from '../types/graph';

export const useForceSimulation = (graphData: GraphData, width: number, height: number) => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [links, setLinks] = useState<EdgeData[]>([]);
  const simulationRef = useRef<d3Force.Simulation<NodeData, EdgeData> | null>(null);
  
  // Initialize simulation
  useEffect(() => {
    if (!graphData || !width || !height) return;
    
    // Deep clone to avoid modifying the original data
    const nodesClone = JSON.parse(JSON.stringify(graphData.nodes)) as NodeData[];
    
    // Create the simulation with forces
    const simulation = d3Force.forceSimulation<NodeData, EdgeData>(nodesClone)
      .force('link', d3Force.forceLink<NodeData, EdgeData>()
        .id(d => d.id)
        .distance(100)
        .strength(0.1))
      .force('charge', d3Force.forceManyBody().strength(-300))
      .force('center', d3Force.forceCenter(width / 2, height / 2))
      .force('collision', d3Force.forceCollide().radius(50));
      
    // Process links
    const linksClone = JSON.parse(JSON.stringify(graphData.links)) as EdgeData[];
    
    // Replace source and target id strings with node references
    linksClone.forEach(link => {
      if (typeof link.source === 'string') {
        link.source = nodesClone.find(node => node.id === link.source) as NodeData;
      }
      if (typeof link.target === 'string') {
        link.target = nodesClone.find(node => node.id === link.target) as NodeData;
      }
    });
    
    // Set the simulation links
    (simulation.force('link') as d3Force.ForceLink<NodeData, EdgeData>).links(linksClone);
    
    // Update state on each tick
    simulation.on('tick', () => {
      setNodes([...nodesClone]);
      setLinks([...linksClone]);
    });
    
    simulationRef.current = simulation;
    
    // Initialize nodes and links
    setNodes(nodesClone);
    setLinks(linksClone);
    
    // Clean up simulation on unmount
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graphData, width, height]);
  
  // Handle node dragging
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
        node.fx = event.x;
        node.fy = event.y;
      })
      .on('end', (event) => {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0);
        }
        // Keep the node fixed at its new position
        node.fx = event.x;
        node.fy = event.y;
      });
      
    d3Selection.select(nodeRef.current).call(dragBehavior);
  };
  
  return { nodes, links, handleDrag };
};