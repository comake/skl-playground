import { useEffect, useMemo, useState } from 'react';
import EditorGroup from './EditorGroup';
import Explorer from './Explorer';
import SplitViewView from './SplitViewView';
import useWindowSize from './hooks/useWindowSize'

const baseExplorerWidth = 260;

function AppBody() {
  const { width: windowWidth } = useWindowSize(true, 200);
  const [prevWindowWidth, setPrevWindowWidth] = useState(windowWidth);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultEditorAndResultsWidth = useMemo(() => (windowWidth - baseExplorerWidth) / 2, []);
  const [widths, setWidths] = useState([baseExplorerWidth, defaultEditorAndResultsWidth, defaultEditorAndResultsWidth]);

  useEffect(() => {
    if (windowWidth !== prevWindowWidth) {
      setPrevWindowWidth(windowWidth);
      const change = windowWidth / prevWindowWidth;
      const newEditorWidth = widths[1] * change;
      const newResultsWidth = widths[2] * change;
      setWidths([ widths[0], newEditorWidth, newResultsWidth]);
    }
  }, [windowWidth, widths, prevWindowWidth]);
  
  return (
    <div className='Body Flex-Spacer'>
      <SplitViewView left={0} width={widths[0]}>
        <Explorer />
      </SplitViewView>
      <SplitViewView left={widths[0]} width={widths[1]}>
        <EditorGroup />
      </SplitViewView>
      <SplitViewView left={widths[0] + widths[1]} width={widths[2]}>
        <div className='Results-View'></div>
      </SplitViewView>
    </div>
  )
}

export default AppBody;