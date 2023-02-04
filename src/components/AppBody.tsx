import { useEffect, useMemo, useState } from 'react';
import EditorGroup from './EditorGroup';
import Explorer from './Explorer';
import SplitViewView from './SplitViewView';
import useWindowSize from '../hooks/useWindowSize'
import SplitViewContainer from './SplitViewContainer';
import OperationView from './OperationView';
import ResultView from './ResultView';

const baseExplorerWidth = 250;
const baseOperationViewHeight = 300;

function AppBody() {
  const { width: windowWidth } = useWindowSize(true, 200);
  const [prevWindowWidth, setPrevWindowWidth] = useState(windowWidth);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultEditorAndResultsWidth = useMemo(() => (windowWidth - baseExplorerWidth) / 2, []);
  const [widths, setWidths] = useState([baseExplorerWidth, defaultEditorAndResultsWidth, defaultEditorAndResultsWidth]);

  useEffect(() => {
    if (windowWidth !== prevWindowWidth) {
      setPrevWindowWidth(windowWidth);
      const space = windowWidth - widths[0];
      const ratio = widths[2] / widths[1];
      const newEditorWidth = space / (1 + ratio);
      const newResultsWidth = space - newEditorWidth;
      setWidths([ widths[0], newEditorWidth, newResultsWidth]);
    }
  }, [windowWidth, widths, prevWindowWidth]);
  
  return (
    <SplitViewContainer additionalClasses={['Body', 'Flex-Spacer']}>
      <SplitViewView left={0} width={widths[0]}>
        <Explorer />
      </SplitViewView>
      <SplitViewView left={widths[0]} width={widths[1]}>
        <EditorGroup />
      </SplitViewView>
      <SplitViewView left={widths[0] + widths[1]} width={widths[2]}>
        <SplitViewContainer additionalClasses={['Flex-Spacer']} vertical>
          <SplitViewView top={0} height={baseOperationViewHeight}>
            <OperationView />
          </SplitViewView>
          <SplitViewView top={baseOperationViewHeight} bottom={0}>
            <ResultView />
          </SplitViewView>
        </SplitViewContainer>
      </SplitViewView>
    </SplitViewContainer>
  )
}

export default AppBody;