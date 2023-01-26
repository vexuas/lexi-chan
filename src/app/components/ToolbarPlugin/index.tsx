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

/**
 * Plugins are essentially react components that you can use inside the LexicalComposer wrapper
 * It's pretty neat since the composer uses Context, we can get the editor state by just calling a native function (editor instance is passed through all the children)
 * There are native plugins in lexical already but majority of use cases would require us creating custom plugins
 * I haven't fully grasped everything that's happening yet but I'm slowing understanding all the moving parts
 * When you're finally done with the plugin, you can just place it inside the EditorContainer under LexicalComposer
 * @returns
 */
export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  /**
   * Updates the styling of the toolbar
   * Currently only controls if the text format buttons are active
   * Probably would get more complicated with more tool actions
   **/
  const updateToolbar = useCallback(() => {
    const selection = $getSelection() as RangeSelection;
    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsUnderline(selection.hasFormat('underline'));
    setIsStrikethrough(selection.hasFormat('strikethrough'));
  }, [activeEditor]);

  /**
   * Commands lets you register event listeners like `key_enter_command` and contextually react to them wherever & however you'd like
   * This is pretty powerful as you can control pretty much anything that happens in the dom and act accordingly
   * There are already a handful of existing commands you can register under LexicalCommands.d.ts but you can also create custom ones
   * I figure this is the concept that you'll use to do the all fancy editor interactions
   * Only caveat is that there's not really a detailed explanation of what the existing commands do; guess it's somewhat self-explanatory but still you'd have to test them to be sure
   * Below listens for any changes in the selection (highlight) of the editor and updates the state of the toolbar buttons
   */
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  /**
   * Listeners are a mechanism that lets the Editor instance inform the user when a certain operation has occured
   * Different from commands as they listen for user events and this listens for when the editor has done an event
   * Again you'd probably use this in tandem with commands for all the fancy interactions
   * Below listens for any updates to the DOM and updates the toolbar state if it does
   */
  useEffect(() => {
    return activeEditor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [activeEditor, updateToolbar]);
  return (
    <div className={styles.Container}>
      {/* Commands can be dispatched anywhere as long as you have access to the editor state */}
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
