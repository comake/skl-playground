import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useWindowEvent from '../hooks/useWindowEvent';
import { FixedLengthArray } from '../util/Types';
import SplitViewView from './SplitViewView';

const RESIZE_TIMEOUT_DURATION = 100;
const MINIMUM_DIMENSION = 130;

export interface SplitViewViewProps<T extends number> {
  viewContent: FixedLengthArray<ReactNode, T>;
  defaultViewDimensions: FixedLengthArray<number | undefined, T>;
  vertical?: boolean;
  additionalClasses: string[],
}

function SplitViewContainer<T extends number>({ 
  viewContent,
  defaultViewDimensions,
  vertical, 
  additionalClasses = [],
}: SplitViewViewProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [dimensions, setDimensions] = useState<FixedLengthArray<number | undefined, T>>(defaultViewDimensions);

  const updateDimensions = useCallback(() => {
    const totalContainerDimension = vertical
      ? containerRef.current!.offsetHeight
      : containerRef.current!.offsetWidth;

    const usedDimensions = dimensions.reduce((sum: number, dim) => (
      dim !== undefined ? sum + dim : sum
    ), 0);
    const leftoverSpace = totalContainerDimension - usedDimensions;
    const leftoverCount = dimensions.filter(dim => dim === undefined).length;
    const newDimensions = dimensions.map(dim => {
      return dim === undefined ? leftoverSpace / leftoverCount : dim;
    }) as unknown as FixedLengthArray<number, T>;
    
    setDimensions(newDimensions);
  }, [dimensions, vertical]);

  const hasUndefinedDimensions = useMemo(() => dimensions.some(dim => dim === undefined), [dimensions]);

  useEffect(() => {
    if (hasUndefinedDimensions && containerRef.current) {
      updateDimensions();
    }
  }, [hasUndefinedDimensions, updateDimensions]);

  const recalcWidths = useCallback(() => {
    const totalContainerDimension = vertical
      ? containerRef.current!.offsetHeight
      : containerRef.current!.offsetWidth;

    const indiciesOfPreferedWidths = defaultViewDimensions.reduce((arr: number[], oldDimension, index) => {
      if (oldDimension !== undefined) {
        arr.push(index);
      }
      return arr;
    }, []);

    let totalPreferredSpace = 0;
    let totalNonPreferedSpace = 0;
    dimensions.forEach((oldDimension, index) => {
      if (indiciesOfPreferedWidths.includes(index)) {
        totalPreferredSpace += oldDimension ?? 0;
      } else {
        totalNonPreferedSpace += oldDimension ?? 0;
      }
    });

    const newLeftoverSpace = Math.abs(totalContainerDimension - totalPreferredSpace);

    const newDimensions = dimensions.map((oldDimension, index) => {
      if (indiciesOfPreferedWidths.includes(index)) {
        return oldDimension
      } else {
        return newLeftoverSpace * ( (oldDimension ?? 0) / totalNonPreferedSpace )
      }
    });

    setDimensions(newDimensions as unknown as FixedLengthArray<number | undefined, T>);
  }, [defaultViewDimensions, dimensions, vertical]);

  const onResize = useCallback(() => {
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }

    resizeTimeout.current = setTimeout(recalcWidths, RESIZE_TIMEOUT_DURATION);
  }, [recalcWidths]);

  useWindowEvent('resize', true, onResize);

  const classes = useMemo(() => {
    return [
      'Split-View-Container', 
      vertical ? 'vertical' : 'horizonatal', 
      ...additionalClasses
    ].join(' ')
  }, [vertical, additionalClasses]);

  const style = useMemo(() => (
    hasUndefinedDimensions 
      ? {
          display: 'flex', 
          flexDirection: vertical ? 'column' : 'row'
        } as const
      : { position: 'relative' } as const
  ), [hasUndefinedDimensions, vertical]);

  const offsets = useMemo(() => {
    return dimensions.map((dim, index) => {
      return dimensions.slice(0, index).reduce((sum: number, dim) => sum + (dim ?? 0), 0);
    })
  }, [dimensions]);

  const handleDimensionChange = useCallback((changedIndex: number, dimensionChange: number) => {
    let canApplyDimensionChange = (dimensions[changedIndex] ?? 0) + dimensionChange > MINIMUM_DIMENSION &&
      (dimensions[changedIndex + 1] ?? 0) - dimensionChange > MINIMUM_DIMENSION
    if (canApplyDimensionChange) {
      setDimensions((dimensions) => dimensions.map((dim: number | undefined, index) => {
        if (index === changedIndex) {
          return (dim ?? 0) + dimensionChange;
        } else if (index === changedIndex + 1) {
          return (dim ?? 0) - dimensionChange;
        }
        return dim;
      }) as unknown as FixedLengthArray<number | undefined, T>);
    }
  }, [dimensions]);

  return (
    <div 
      ref={containerRef}
      className={classes}
      style={style}
    >
      { viewContent.map((content, index) => (
        <SplitViewView 
          key={index}
          onDimensionChange={handleDimensionChange.bind(null, index)}
          dimensionsComputed={!hasUndefinedDimensions}
          offset={offsets[index]} 
          dimension={dimensions[index]} 
          vertical={vertical}
          isLast={index === viewContent.length - 1}
        >
          { content }
        </SplitViewView>
      ))}
    </div>
  );
}

export default SplitViewContainer;