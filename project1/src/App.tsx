import React, { useState, useEffect } from 'react';
import Graph from './components/Graph';
import Rating from './components/Rating';
import { scan } from './data/graphData';
import { GraphData } from './types/graph';
import { Loader2 } from 'lucide-react';

function App() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(true);

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.runtime?.connect) {
      console.log('Not running in Chrome extension context');
      return;
    }

    let port: chrome.runtime.Port;

    const connectToBackground = () => {
      try {
        port = chrome.runtime.connect({ name: 'popup-port' });
        
        port.onMessage.addListener(async (message) => {
          if (message.type === 'SCAN_TEXT') {
            setShowRating(false);
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
        });

        port.onDisconnect.addListener(() => {
          console.log('Disconnected from background script');
        });
      } catch (err) {
        console.error('Failed to connect to background script:', err);
        setError('Failed to connect to extension background script');
      }
    };

    connectToBackground();

    return () => {
      if (port) {
        port.disconnect();
      }
    };
  }, []);

  const handleRating = (rating: number) => {
    console.log('Received rating:', rating);
    // Here you can implement the logic to handle the rating
    // For example, send it to your backend
  };

  return (
    <div className="w-[800px] h-[600px] relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-white to-blue-100">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 rounded-lg">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-lg font-medium text-gray-700">Analyzing text relationships...</p>
            <p className="text-sm text-gray-500">This may take a few moments</p>
          </div>
        </div>
      ) : showRating ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Rating onSubmit={handleRating} />
        </div>
      ) : (
        <Graph data={graphData} />
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