import { NodeKey, TextNode, LexicalNode, EditorConfig } from 'lexical';

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
  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.style.color = 'blue';
    return element;
  }
  updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    dom.style.color = 'blue';
    return isUpdated;
  }
}
export function $createMergeTag(text: string) {
  return new MergeTagNode(text);
}
export function $isMergeTag(node: LexicalNode) {
  return node instanceof MergeTagNode;
}
