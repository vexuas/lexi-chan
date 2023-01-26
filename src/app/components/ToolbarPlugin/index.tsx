import styles from './ToolbarPlugin.module.scss';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState } from 'react';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  return (
    <div className={styles.Container}>
      <button onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>B</button>
    </div>
  );
}
