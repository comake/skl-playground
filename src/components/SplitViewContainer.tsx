import { useMemo } from 'react';

export interface SplitViewViewProps {
  children: React.ReactNode;
  vertical?: boolean;
  additionalClasses: string[],
}

function SplitViewContainer({ children, vertical, additionalClasses = [] }: SplitViewViewProps) {
  const classes = useMemo(() => {
    return [
      'Split-View-Container', 
      vertical ? 'vertical' : 'horizonatal', 
      ...additionalClasses
    ].join(' ')
  }, [vertical, additionalClasses]);

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

export default SplitViewContainer;