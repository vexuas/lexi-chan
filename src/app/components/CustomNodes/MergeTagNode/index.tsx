import { NodeKey, TextNode, LexicalNode } from 'lexical';

export class MergeTagNode extends TextNode {
  mergeTagText: string;

  constructor(text: string, key?: NodeKey) {
    super(text, key);
    this.mergeTagText = text;
  }
  static getType(): string {
    return 'merge-tag';
  }
  static clone(node: MergeTagNode): MergeTagNode {
    return new MergeTagNode(node.__text, node.__key);
  }
}
export function $createMergeTag(text: string) {
  return new MergeTagNode(text);
}
export function $isMergeTag(node: LexicalNode) {
  return node instanceof MergeTagNode;
}
