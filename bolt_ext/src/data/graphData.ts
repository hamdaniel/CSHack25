import { GraphData } from '../types/graph';

export const sampleGraphData: GraphData = {
  nodes: [
    { id: '1', label: 'Google', url: 'https://google.com', color: '#4285F4' },
    { id: '2', label: 'GitHub', url: 'https://github.com', color: '#24292e' },
    { id: '3', label: 'Stack Overflow', url: 'https://stackoverflow.com', color: '#F48024' },
    { id: '4', label: 'YouTube', url: 'https://youtube.com', color: '#FF0000' },
    { id: '5', label: 'Twitter', url: 'https://twitter.com', color: '#1DA1F2' },
    { id: '6', label: 'LinkedIn', url: 'https://linkedin.com', color: '#0077B5' },
    { id: '7', label: 'Facebook', url: 'https://facebook.com', color: '#1877F2' },
    { id: '8', label: 'Instagram', url: 'https://instagram.com', color: '#E4405F' },
  ],
  links: [
    { source: '1', target: '2', value: 5 },
    { source: '1', target: '3', value: 3 },
    { source: '2', target: '3', value: 8 },
    { source: '3', target: '4', value: 2 },
    { source: '4', target: '5', value: 4 },
    { source: '5', target: '6', value: 3 },
    { source: '6', target: '7', value: 5 },
    { source: '7', target: '8', value: 6 },
    { source: '8', target: '1', value: 2 },
    { source: '2', target: '5', value: 1 },
    { source: '3', target: '6', value: 3 },
    { source: '4', target: '7', value: 2 },
  ]
};