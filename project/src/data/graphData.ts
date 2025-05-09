import { GraphData, ScanData } from '../types/graph';
import { scaleLinear } from 'd3-scale';

function scoreToColor(score: number): string {
  const colorScale = scaleLinear<string>()
    .domain([0, 0.5, 1])
    .range(['#ff0000', '#ffa500', '#00ff00']);
  return colorScale(score);
}

export function convertScanDataToGraphData(data: ScanData): GraphData {
  const nodes = new Map<string, { score: number; rating: number | null }>();
  const links: { source: string; target: string; value: number }[] = [];

  // Add "Your Quote" as the starting node
  nodes.set("Your Quote", { score: 1, rating: null });

  Object.entries(data.graph).forEach(([source, edges]) => {
    if (!nodes.has(source)) {
      nodes.set(source, { score: 0.7, rating: null });
    }
    
    edges.forEach(([target, score, rating]) => {
      if (!nodes.has(target)) {
        nodes.set(target, { score, rating: rating || null });
      }
      links.push({ source, target, value: score });
    });
  });

  const graphData: GraphData = {
    nodes: Array.from(nodes.entries()).map(([url, { score, rating }]) => ({
      id: url,
      label: url === "Your Quote" ? "Your Quote" : new URL(url).hostname.replace('www.', ''),
      url: url === "Your Quote" ? "" : url,
      color: scoreToColor(score),
      size: rating ? Math.max(30, rating * 10) : 30,
      score
    })),
    links
  };

  return graphData;
}

export async function scan(text?: string): Promise<GraphData> {
  if (!text) return { nodes: [], links: [] };
  
  try {
    const response = await fetch(`http://localhost:8000/search?phrase=${encodeURIComponent(text)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return convertScanDataToGraphData(data);
  } catch (error) {
    console.error('Error fetching graph data:', error);
    return { nodes: [], links: [] };
  }
}