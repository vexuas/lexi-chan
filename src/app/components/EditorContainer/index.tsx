import styles from './EditorContainer.module.scss';
import { $getRoot, $getSelection, EditorState, EditorThemeClasses } from 'lexical';
import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ToolbarPlugin } from '../ToolbarPlugin';
import { MergeTagNode } from '../CustomNodes/MergeTagNode';

//Definitely check out this first and play with the demo: https://lexical.dev/docs/getting-started/react
export default function EditorContainer() {
  /**
   * Theme styling goes here
   * Basically this adds optional classes to elements used inside the editor content
   * Full list found in typing in EditorThemeClasses under LexicalEditor.d.ts
   * More reading here too: https://lexical.dev/docs/getting-started/theming
   */
  const theme: EditorThemeClasses = {
    paragraph: styles.Paragraph,
    text: {
      underline: styles.Underline,
      strikethrough: styles.Strikethrough,
      bold: styles.Bold,
      italic: styles.Italic,
    },
  };
  /**
   * Custom handler for when content changes in the editor
   * You'd want to pass this in the OnChangePlugin which will call this whenever the editor changes
   * Interesting that building the editor requires you to use their built-in plugins and then add your interactions after
   */
  const onChange = (editorState: EditorState) => {
    //Read the contents of the EditorState here
    editorState.read(() => {
      const root = $getRoot();
      const selection = $getSelection();
      console.log(root, selection);
    });
  };
  //Error handling during lexical updates; not really sure what to do with this for now
  const onError = (error: any) => {
    console.error(error);
  };
  /**
   * Config necessary in creating a new EditorState
   * Full list found in LexicalComposer.d.ts
   */
  const initialConfig: InitialConfigType = {
    namespace: 'Lexi-chan',
    theme,
    onError,
    nodes: [MergeTagNode], //Custom Nodes
  };
  return (
    <div className={styles.Container}>
      <div className={styles.Header}>Lexichan</div>
      {/* Pretty cool that you can just add native plugins on a per-need basis. More reading here: https://lexical.dev/docs/react/plugins */}
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className={styles.EditorContainer}>
          <RichTextPlugin
            contentEditable={<ContentEditable className={styles.Input} />}
            placeholder={<div className={styles.Placeholder}>Try me...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}
