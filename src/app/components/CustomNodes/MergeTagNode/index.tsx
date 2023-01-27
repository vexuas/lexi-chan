import { NodeKey, TextNode, LexicalNode, EditorConfig } from 'lexical';

/**
 * Nodes are a core concept in Lexical
 * They form the visual editor view as well as represent the underlying data model of the editor
 * For more reading, see https://lexical.dev/docs/concepts/nodes
 * There are 5 base nodes but what we're looking for are the 3 nodes that can be extended
 * - ElementNode: mainly used as parents for other nodes
 * - TextNode: Leaf type of node that contains text
 * - DecoratorNode: Wrapper node to insert arbitrary view inside the editor
 * Basically any special tags and entities you'd want to insert in the editor, you'd use these
 */
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
    element.className = 'MergeTag';
    return element;
  }
  updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig): boolean {
    return false;
  }
}
/**
 * Create a merge tag node
 * Lexical states that it's good etiquette to name utility functions from custom nodes with $
 * An important note: To properly create custom nodes, you'd need to register them to the editor by describing them in the editorConfig
 */
export function $createMergeTag(text: string) {
  return new MergeTagNode(text).setMode('token');
}
export function $isMergeTag(node: LexicalNode) {
  return node instanceof MergeTagNode;
}
