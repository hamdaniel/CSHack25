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

export function scan(text?: string): GraphData {
  // For now, using sample data. In a real implementation, 
  // this would analyze the provided text
  const sampleScanData: ScanData = {
    'https://example.com': [
      ['https://google.com', 8.5],
      ['https://github.com', 3.2],
      ['https://stackoverflow.com', 6.7]
    ],
    'https://google.com': [
      ['https://youtube.com', 9.1],
      ['https://github.com', 4.8],
      ['https://microsoft.com', 7.2]
    ],
    'https://github.com': [
      ['https://stackoverflow.com', 7.3],
      ['https://npmjs.com', 2.1],
      ['https://gitlab.com', 5.5]
    ],
    'https://stackoverflow.com': [
      ['https://github.com', 8.9],
      ['https://medium.com', 5.5],
      ['https://dev.to', 6.8]
    ],
    'https://youtube.com': [
      ['https://google.com', 9.4],
      ['https://twitter.com', 1.8],
      ['https://facebook.com', 4.2]
    ]
  };

  return convertScanDataToGraphData(sampleScanData);
}