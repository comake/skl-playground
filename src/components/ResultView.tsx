import { useContext } from 'react';
import CodeEditor from './CodeEditor';
import ResultContext from '../contexts/ResultContext';

function ResultView() {
  const { result, loadingResult } = useContext(ResultContext);

  return (
    <div className='Result-View'>
      { loadingResult && (
        <div className='Result-Loading-Icon-Container Centered'>
          <div className='Result-Loading-Icon'></div>
        </div>
      )}
      { !loadingResult && result && (
        <CodeEditor 
          key={result}
          code={result}
          locked
          hideLineNumbers
          alwaysShowFolds
          classes={'Result-View-Code'}
        />
      )}
    </div>
  )
}

export default ResultView;