import { useMemo } from 'react';

export interface SplitViewViewProps {
  children: React.ReactNode;
  width: number;
  left: number;
}

function SplitViewView({ children, width, left }: SplitViewViewProps) {
  const style = useMemo(() => ({ width, left }), [width, left]);

  return (
    <div className='Split-View-View' style={style}>
      {children}
    </div>
  );
}

export default SplitViewView;