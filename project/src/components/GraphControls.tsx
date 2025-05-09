import React from 'react';
import { Plus, Minus, RefreshCw } from 'lucide-react';

interface GraphControlsProps {
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const GraphControls: React.FC<GraphControlsProps> = ({ onReset, onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
      <button 
        onClick={onZoomIn}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Zoom in"
      >
        <Plus size={20} />
      </button>
      <button 
        onClick={onZoomOut}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Zoom out"
      >
        <Minus size={20} />
      </button>
      <button 
        onClick={onReset}
        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Reset view"
      >
        <RefreshCw size={20} />
      </button>
    </div>
  );
};

export default GraphControls;