import styles from './ToolbarPlugin.module.scss';
import {
  $getSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  FORMAT_TEXT_COMMAND,
  LexicalCommand,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import { $createMergeTag } from '../CustomNodes/MergeTagNode';
import DownShift from 'downshift';

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
   * As stated above, you are able create custom commands.
   * You can control whatever is passed in and the necessary interactions that follows
   * In this case, this creates a new command and registers it in inserting a merge tag in the selectedSelection
   * And this command can be called wherever you need it
   */
  const CREATE_MERGE_TAG_COMMAND: LexicalCommand<undefined> = createCommand();
  useEffect(() => {
    return editor.registerCommand(
      CREATE_MERGE_TAG_COMMAND,
      (payload: string) => {
        const selection = $getSelection() as RangeSelection;
        const newMergeTag = $createMergeTag(payload);
        selection.insertNodes([newMergeTag]);
        selection.insertText(' ');
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );
  });

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

  const tagItems = [
    { name: 'tag_name_1', label: 'Tag Name 1' },
    {
      name: 'tag_name_2',
      label: 'Tag Name 2',
    },
  ];
  return (
    <div className={styles.Container}>
      {/* Commands can be dispatched anywhere as long as you have access to the editor state */}
      <div className={styles.Tools}>
        <button
          className={`${styles.ToolButton} ${isBold ? styles.Active : ''}`}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        >
          <i className="fa-solid fa-bold"></i>
        </button>
        <button
          className={`${styles.ToolButton} ${isItalic ? styles.Active : ''}`}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        >
          <i className="fa-solid fa-italic"></i>
        </button>
        <button
          className={`${styles.ToolButton} ${isStrikethrough ? styles.Active : ''}`}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        >
          <i className="fa-solid fa-strikethrough"></i>
        </button>
        <button
          className={`${styles.ToolButton} ${isUnderline ? styles.Active : ''}`}
          onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        >
          <i className="fa-solid fa-underline"></i>
        </button>
        <span className={styles.Divider}></span>
        {/* Experimenting with downshift for easier select dropdown implementation; kinda interesting but not sure if I like it so much */}
        <DownShift
          onSelect={(selected, action) => {
            if (selected) {
              activeEditor.dispatchCommand(CREATE_MERGE_TAG_COMMAND, selected.label);
              action.reset();
              action.toggleMenu();
            }
          }}
          itemToString={(item) => (item ? item.label : '')}
        >
          {({ isOpen, getToggleButtonProps, getMenuProps, getItemProps }) => {
            return (
              <div
                className={`${styles.ToolButton} ${isOpen ? styles.MenuActive : ''}`}
                {...getToggleButtonProps()}
              >
                <i className="fa-regular fa-clipboard"></i>
                <i className={`${styles.Caret} fa-solid fa-caret-down`}></i>
                {isOpen ? (
                  <div className={styles.TagMenu} {...getMenuProps()}>
                    {tagItems.map((item, index) => {
                      return (
                        <span
                          className={styles.TagItem}
                          {...getItemProps({ key: item.name, index, item })}
                        >
                          <span>{item.label}</span>
                        </span>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          }}
        </DownShift>
      </div>
    </div>
  );
}
