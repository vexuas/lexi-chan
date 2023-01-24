import styles from './App.module.scss';
import EditorContainer from './app/components/EditorContainer';

function App() {
  return (
    <div className={styles.Container}>
      <EditorContainer />
    </div>
  );
}

export default App;
