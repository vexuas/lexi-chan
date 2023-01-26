import styles from './ToolbarPlugin.module.scss';
import {
  $getSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection() as RangeSelection;
    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsUnderline(selection.hasFormat('underline'));
    setIsStrikethrough(selection.hasFormat('strikethrough'));
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        console.log('hello');
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return activeEditor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [activeEditor, updateToolbar]);
  return (
    <div className={styles.Container}>
      <div className={styles.Tools}>
        <button
          className={`${styles.ToolButton} ${isBold ? styles.Active : ''}`}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        >
          B
        </button>
        <button
          className={`${styles.ToolButton} ${isItalic ? styles.Active : ''}`}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        >
          I
        </button>
        <button
          className={`${styles.ToolButton} ${isStrikethrough ? styles.Active : ''}`}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        >
          S
        </button>
        <button
          className={`${styles.ToolButton} ${isUnderline ? styles.Active : ''}`}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        >
          U
        </button>
      </div>
    </div>
  );
}
