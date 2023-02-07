import { ReactNode, useMemo } from 'react';
import EditorGroup from './EditorGroup';
import Explorer from './Explorer';
import SplitViewContainer from './SplitViewContainer';
import OperationView from './OperationView';
import ResultView from './ResultView';
import { FixedLengthArray } from '../util/Types';

const baseExplorerWidth = 250;
const baseOperationViewHeight = 400;

function AppBody() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultBodyWidths = useMemo(() => 
    [baseExplorerWidth, undefined, undefined] as FixedLengthArray<number | undefined, 3>, 
    [],
  );
  const defaultEditorAndResultsHeights = useMemo(() => 
    [baseOperationViewHeight, undefined] as FixedLengthArray<number | undefined, 2>, 
    [],
  );

  const verbAndResultsSplitContent = useMemo(() => ([
    <OperationView />,
    <ResultView />
  ] as FixedLengthArray<ReactNode, 2>), []);

  const content = useMemo(() => ([
    <Explorer />,
    <EditorGroup />,
    <SplitViewContainer
      defaultViewDimensions={defaultEditorAndResultsHeights}
      viewContent={verbAndResultsSplitContent}
      additionalClasses={['Flex-Spacer']}
      vertical
    />
  ] as FixedLengthArray<ReactNode, 3>), [defaultEditorAndResultsHeights, verbAndResultsSplitContent]);
  
  return (
    <SplitViewContainer
      defaultViewDimensions={defaultBodyWidths}
      viewContent={content}
      additionalClasses={['Body', 'Flex-Spacer']}
    />
  )
}

export default AppBody;