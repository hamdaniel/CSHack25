export interface NodeData {
  id: string;
  label: string;
  url: string;
  color?: string;
  size?: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  index?: number;
}

export interface EdgeData {
  source: string | NodeData;
  target: string | NodeData;
  value?: number;
  color?: string;
}

export interface GraphData {
  nodes: NodeData[];
  links: EdgeData[];
}