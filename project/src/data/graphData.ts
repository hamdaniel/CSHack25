import { GraphData, ScanData } from '../types/graph';
import { scaleLinear } from 'd3-scale';

function getRandomScore(): number {
  return Math.random() * 10;
}

function scoreToColor(score: number): string {
  const colorScale = scaleLinear<string>()
    .domain([0, 5, 10])
    .range(['#ff0000', '#ffa500', '#00ff00']);
  return colorScale(score);
}

export function convertScanDataToGraphData(data: ScanData): GraphData {
  const nodes = new Map<string, number>();
  const links: { source: string; target: string; value: number }[] = [];

  Object.entries(data).forEach(([source, edges]) => {
    if (!nodes.has(source)) {
      nodes.set(source, getRandomScore());
    }
    
    edges.forEach(([target, score]) => {
      if (!nodes.has(target)) {
        nodes.set(target, getRandomScore());
      }
      links.push({ source, target, value: score });
    });
  });

  const graphData: GraphData = {
    nodes: Array.from(nodes.entries()).map(([url, score]) => ({
      id: url,
      label: new URL(url).hostname.replace('www.', ''),
      url,
      color: scoreToColor(score),
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