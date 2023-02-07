import { useMemo } from 'react'
import useWindowSize from './useWindowSize';

const VERTICAL_PADDING = 20;
const HORIZONTAL_PADDING = 5;
const RESIZE_TIMEOUT_DURATION = 200;
const DEFAULT_WIDTH = 150;

export interface UseOverhangAdjustmentProps {
  x: number;
  y: number;
  height: number;
  width?: number;
  xOffset?: number;
  yOffset?: number;
  alignLeft?: boolean;
  edgeBuffer?: number;
}
function useOverhangAdjustment({ 
  x, 
  y, 
  height, 
  width=DEFAULT_WIDTH, 
  xOffset=0,
  yOffset=0, 
  alignLeft=true, 
  edgeBuffer=0,
}: UseOverhangAdjustmentProps) {
  const windowSize = useWindowSize(true, RESIZE_TIMEOUT_DURATION);
  const adjustedLocation = useMemo(() => {
    if (x == null || y == null) {
      return null
    } else {
      let xVal = x + xOffset;
      let yVal = y + yOffset;

      if (windowSize.height - yVal < height + VERTICAL_PADDING) {
        yVal = windowSize.height - height - VERTICAL_PADDING
      }

      if (alignLeft && (windowSize.width - xVal < width + HORIZONTAL_PADDING)) {
        xVal = windowSize.width - width - HORIZONTAL_PADDING;
      }

      if (!alignLeft && xVal < HORIZONTAL_PADDING) {
        xVal = HORIZONTAL_PADDING;
      }

      if (alignLeft && edgeBuffer > 0) {
        xVal = Math.max(xVal, edgeBuffer)
      }

      if (!alignLeft && edgeBuffer > 0) {
        xVal = Math.min(xVal, windowSize.width - width - edgeBuffer)
      }

      return { x: xVal, y: yVal }
    }
  }, [x, y, xOffset, yOffset, windowSize, height, alignLeft, width, edgeBuffer])

  return adjustedLocation
}

export default useOverhangAdjustment;
