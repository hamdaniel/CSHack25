import React, { useState, useEffect } from 'react';
import Graph from './components/Graph';
import { scan } from './data/graphData';
import { GraphData } from './types/graph';
import { Loader2 } from 'lucide-react';

function App() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScanText = async (message: any) => {
      if (message.type === 'SCAN_TEXT') {
        setLoading(true);
        setError(null);
        try {
          const data = await scan(message.text);
          setGraphData(data);
        } catch (err) {
          setError('Failed to fetch graph data. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener(handleScanText);
      return () => {
        chrome.runtime.onMessage.removeListener(handleScanText);
      };
    }
  }, []);

  return (
    <div className="w-full h-screen relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-white to-blue-100">
      <Graph data={graphData} />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="mt-4 text-lg font-medium">Scanning...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;