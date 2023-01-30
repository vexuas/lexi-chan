import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TextNode } from 'lexical';
import { useEffect } from 'react';

export function NodeTransform() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (textNode) => {
      if (textNode.getTextContent().includes('/') && textNode.getStyle() !== 'color: blue') {
        textNode.setStyle('color: blue');
      }
      if (!textNode.getTextContent().includes('/') && textNode.getStyle() === 'color: blue') {
        textNode.setStyle('');
      }
    });
  }, [editor]);
  return null;
}
