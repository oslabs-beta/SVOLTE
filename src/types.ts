export interface Message {
  type: string;
  source: string;
  anchor?: number;
  target?: number;
  node: Node;
}

export interface Node {
  id: number;
  children: Array<Node> | any[];
  parent: Node | null;
  invalidate?: () => void;
  _timeout?: number;
  tagName: string;
  type: string;
  detail?: {
    attributes: any[];
    listeners: any[];
    ctx: any[];
  };
}

export interface SnapShot {
  _id: number;
  id: string;
  tagName: string;
  type: string;
  detail: {
    attributes: any[];
    listeners: any[];
    ctx: any[];
  };
  diff: Array<Difference>;
}

export interface Difference {
  id: number;
  path: Array<string>;
  value1: any;
  value2: any;
}
