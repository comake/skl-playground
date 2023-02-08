import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import useOverhangAdjustment from '../hooks/useOverhangAdjustment';
import { ClickLocation, OrArray } from '../util/Types';
import DropdownPortal from './DropdownPortal';

export interface ContextMenuProps {
  location: ClickLocation;
  children: OrArray<ReactNode>;
  xOffset?: number;
  yOffset?: number;
}

function ContextMenu({ location, children, xOffset=0, yOffset=0 }: ContextMenuProps) {
  const dropdownContainer = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [calcedWidth, setCalcedWidth] = useState(0);

  useEffect(() => {
    if (dropdownContainer.current && (calcedWidth === 0 || height === 0)) {
      setTimeout(() => {
        const boundingClientRect = dropdownContainer.current!.getBoundingClientRect()
        setHeight(boundingClientRect.height);
        setCalcedWidth(boundingClientRect.width);
      }, 1) // Wait for children to be rendered
    } else if (!dropdownContainer.current) {
      setHeight(0);
      setCalcedWidth(0);
    }
  }, [calcedWidth, height]);

  const adjustedLocation = useOverhangAdjustment({
    x: location.x,
    y: location.y,
    height,
    width: calcedWidth,
    xOffset,
    yOffset,
  })

  const style = useMemo(() => (adjustedLocation 
    ? { left: adjustedLocation.x, top: adjustedLocation.y }
    : {}
  ), [adjustedLocation]);

  if (adjustedLocation) {
    return <DropdownPortal zIndex={600}>
      <div
        className={'Context-Menu-Dropdown Dropdown'}
        ref={dropdownContainer}
        style={style}
      >
        { children }
      </div>
    </DropdownPortal>
  } else {
    return <></>;
  }
}


export default ContextMenu;
