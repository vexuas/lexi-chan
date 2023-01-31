import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TextNode } from 'lexical';
import { useEffect } from 'react';

/**
 * Transforms are the most efficient mechanism to respond to changes to the EditorState
 * They're exeuted sequentially before changes are propogated to the DOM; multiple transforms still lead to a single DOM reconcilliation
 * This is important as updating the DOM is the most expensive operation in Lexical's lifecycle
 * In most cases, it is possible to achieve the same or very similar result through an update listener
 * However this is discouraged as it triggers an additional render hence stick with transforms
 * Would need to experiment more on this to better see the use cases
 */
export function NodeTransform() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (textNode) => {
      if (textNode.getTextContent().includes('blue') && textNode.getStyle() !== 'color: blue') {
        textNode.setStyle('color: blue');
      }
      if (!textNode.getTextContent().includes('blue') && textNode.getStyle() === 'color: blue') {
        textNode.setStyle('');
      }
    });
  }, [editor]);
  return null;
}
