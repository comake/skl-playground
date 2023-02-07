import { DragEvent, useCallback, useMemo, useRef, useState } from 'react';

const DRAG_HOVER_TIMEOUT_DURATION = 380;

export interface SplitViewViewProps {
  children: React.ReactNode;
  dimensionsComputed: boolean;
  dimension?: number;
  offset?: number;
  vertical?: boolean;
  isLast?: boolean;
  onDimensionChange: (change: number) => void;
}

function SplitViewView({ children, offset, dimension, vertical, dimensionsComputed, isLast, onDimensionChange }: SplitViewViewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const prevDragPosition = useRef<{ x: number; y: number }>();
  const hoverTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [hasLongHovered, setHasLongHovered] = useState(false);
  const onMouseEnter = useCallback(() => {
    if (!hoverTimeout.current) {
      hoverTimeout.current = setTimeout(() => setHasLongHovered(true), DRAG_HOVER_TIMEOUT_DURATION);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = undefined;
    }
    setHasLongHovered(false);
  }, []);

  const handleDrag = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (!(event.clientX === 0 && event.clientY === 0)) {
      if (prevDragPosition.current) {
        const dimensionChange = vertical 
          ? event.clientY - prevDragPosition.current.y
          : event.clientX - prevDragPosition.current.x;
        onDimensionChange(dimensionChange);
      }
      prevDragPosition.current = { x: event.clientX, y: event.clientY }
    }
  }, [onDimensionChange, vertical]);

  const handleDragStart = useCallback((event: DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    prevDragPosition.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleDragEnd = useCallback(() => {
    prevDragPosition.current = undefined;
    setIsDragging(false);
  }, []);

  const style = useMemo(() => (
    dimensionsComputed 
      ? { 
          position: 'absolute',
          width: vertical ? '100%' : dimension, 
          left: vertical ? '0px' : offset, 
          height: vertical ? dimension : '100%', 
          top: vertical ? offset : '0px', 
        } as const
      : {
          position: 'relative',
          flex: dimension ? undefined : 1,
          width: vertical ? '100%' : dimension, 
          height: vertical ? dimension : '100%', 
        } as const
  ), [dimensionsComputed, vertical, dimension, offset]);

  return (
    <div className={`Split-View-View ${isDragging ? 'dragging' : ''} ${hasLongHovered ? 'drag-handle-long-hover' : ''}`} style={style}>
      {children}
      { !isLast && (
        <div 
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className='Drag-Handle'
          draggable='true'
          onDrag={handleDrag}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        ></div>
      )}
    </div>
  );
}

export default SplitViewView;