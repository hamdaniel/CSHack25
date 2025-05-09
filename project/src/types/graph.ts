export interface NodeData {
  id: string;
  label: string;
  url: string;
  color?: string;
  size?: number;
  score?: number;
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

export interface ScanData {
  graph: {
    [key: string]: [string, number, number | null][];
  };
  trace: {
    url: string;
    from: string;
    score: number;
    date: string | null;
    sentences: string;
  }[];
}