import { NodeKey, DecoratorNode, LexicalNode, EditorConfig, LexicalEditor } from 'lexical';
import { ReactNode } from 'react';

/**
 * Nodes are a core concept in Lexical
 * They form the visual editor view as well as represent the underlying data model of the editor
 * For more reading, see https://lexical.dev/docs/concepts/nodes
 * There are 5 base nodes but what we're looking for are the 3 nodes that can be extended
 * - ElementNode: mainly used as parents for other nodes
 * - TextNode: Leaf type of node that contains text
 * - DecoratorNode: Wrapper node to insert arbitrary view inside the editor
 * Basically any special tags and entities you'd want to insert in the editor, you'd use these
 * Experimentally using DecoratorNode below to render custom html tags; still torn between this and TextNode
 */
export class MergeTagNode extends DecoratorNode<ReactNode> {
  mergeTagText: string;

  constructor(text: string, key?: NodeKey) {
    super(key);
    this.mergeTagText = text;
  }
  static getType(): string {
    return 'merge-tag';
  }
  static clone(node: MergeTagNode): MergeTagNode {
    return new MergeTagNode(node.__text, node.__key);
  }
  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    return document.createElement('merge-tag');
  }
  updateDOM(_prevNode: unknown, _dom: HTMLElement, _config: EditorConfig): boolean {
    return false;
  }
  decorate(): ReactNode {
    return this.mergeTagText;
  }
  isIsolated(): boolean {
    return true;
  }
}
/**
 * Create a merge tag node
 * Lexical states that it's good etiquette to name utility functions from custom nodes with $
 * An important note: To properly create custom nodes, you'd need to register them to the editor by describing them in the editorConfig
 */
export function $createMergeTag(text: string) {
  return new MergeTagNode(text);
}
export function $isMergeTag(node: LexicalNode) {
  return node instanceof MergeTagNode;
}
