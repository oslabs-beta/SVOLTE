export interface Message {
  type: string;
  source: string;
  anchor?: number;
  target?: number;
  node: Node;
}
export interface Node {
  id: number;
  children: Array<Node> | [];
  parent: Node | null;
  invalidate?: () => void;
  _timeout?: number;
  tagName: string;
  type: string;
  detail?: {
    attributes: any[];
    listeners: [];
    ctx: any[];
  };
}
export interface SnapShot {
  id: string;
  tagName: string;
  type: string;
  diff: Array<Difference>;
}

interface Difference {
  path: Array<string>;
  value1: any;
  value2: any;
}
