import styles from './EditorContainer.module.scss';
import { $getRoot, $getSelection, EditorState } from 'lexical';

export default function EditorContainer() {
  const theme = {};
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
  const initialConfig = {
    namespace: 'Lexi-chan',
    theme,
    onError,
  };
  return (
    <div className={styles.Container}>
      <p>Oh wow a cool editor!</p>
    </div>
  );
}
