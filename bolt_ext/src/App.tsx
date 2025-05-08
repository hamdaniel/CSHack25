import React, { useState } from 'react';
import Graph from './components/Graph';
import GraphControls from './components/GraphControls';
import GraphDataManager from './components/GraphDataManager';
import { GraphData } from './types/graph';
import { sampleGraphData } from './data/graphData';

function App() {
  const [graphData, setGraphData] = useState<GraphData>(sampleGraphData);
  const [scale, setScale] = useState(1);
  
  const handleReset = () => {
    window.location.reload();
  };
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };
  
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="w-[800px]">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Graph Visualization</h1>
          <p className="text-gray-600 text-sm mt-1">Add nodes and edges using the form below</p>
        </header>
        
        <GraphDataManager onDataUpdate={setGraphData} />
        
        <div
          className="relative bg-white rounded-xl shadow-xl overflow-hidden h-[400px]"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
        >
          <Graph data={graphData} />
          <GraphControls
            onReset={handleReset}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
        </div>
      </div>
    </div>
  );
}

export default App;