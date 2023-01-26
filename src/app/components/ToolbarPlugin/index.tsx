import styles from './ToolbarPlugin.module.scss';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState } from 'react';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  return (
    <div className={styles.Container}>
      <div className={styles.Tools}>
        <button
          className={styles.ToolButton}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        >
          B
        </button>
        <button
          className={styles.ToolButton}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        >
          I
        </button>
        <button
          className={styles.ToolButton}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        >
          S
        </button>
        <button
          className={styles.ToolButton}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        >
          U
        </button>
      </div>
    </div>
  );
}
