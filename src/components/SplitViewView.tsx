import { useMemo } from 'react';

export interface SplitViewViewProps {
  children: React.ReactNode;
  width?: number;
  left?: number;
  top?: number;
  height?: number;
  bottom?: number;
}

function SplitViewView({ children, width, left, top, height, bottom }: SplitViewViewProps) {
  const style = useMemo(() => ({ width, left, top, height, bottom }), [width, left, top, height, bottom]);

  return (
    <div className='Split-View-View' style={style}>
      {children}
    </div>
  );
}

export default SplitViewView;