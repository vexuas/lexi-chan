import styles from './EditorContainer.module.scss';
import { $getRoot, $getSelection, EditorState, EditorThemeClasses } from 'lexical';
import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

export default function EditorContainer() {
  const theme: EditorThemeClasses = {
    paragraph: styles.Paragraph,
  };
  const onChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const selection = $getSelection();
      console.log(root, selection);
    });
  };
  const onError = (error: any) => {
    console.error(error);
  };
  const initialConfig: InitialConfigType = {
    namespace: 'Lexi-chan',
    theme,
    onError,
  };
  return (
    <div className={styles.Container}>
      <p>Oh wow a cool editor!</p>
      <LexicalComposer initialConfig={initialConfig}>
        <div className={styles.EditorContainer}>
          <PlainTextPlugin
            contentEditable={<ContentEditable className={styles.Input} />}
            placeholder={<div className={styles.Placeholder}>Try me!</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
        </div>
      </LexicalComposer>
    </div>
  );
}
