import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import useDocumentEvent from '../hooks/useDocumentEvent';
import { ClickEvent } from '../util/Types';

import DropdownPortal from './DropdownPortal';

export interface DropdownProps {
  buttonContents: ReactNode;
  children: ReactNode;
  dontCloseOnDropdownClick?: boolean;
  dontCloseOnButtonClick?: boolean;
  additionalClasses?: string;
  align?: 'right' | 'adjacent-right' | 'adjacent-left' | 'left';
}

function Dropdown({
  buttonContents,
  children,
  dontCloseOnDropdownClick,
  dontCloseOnButtonClick,
  additionalClasses,
  align = 'left',
}: DropdownProps) {
  const [hasOpened, setHasOpened] = useState(false)
  const prevOpen = useRef(false)
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const openChangeTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleButtonClick = useCallback((event: ClickEvent) => {
    const target = event.target as Node;
    const dropdown = dropdownRef.current;
    const clickIsWithinDropdown = dropdown && dropdown.contains(target)
    if (
      !(dontCloseOnButtonClick && isOpen) &&
      !clickIsWithinDropdown
    ) {
      setIsOpen(!isOpen);
    }
  }, [dontCloseOnButtonClick, isOpen]);

  const handleClickOutsideDropdown = useCallback((event: MouseEvent) => {
    const target = event.target;
    const dropdown = dropdownRef.current;
    if (hasOpened && isOpen &&
        containerRef.current &&
        !containerRef.current.contains(target as Node) &&
        dropdown &&
        !dropdown.contains(target as Node) &&
        dropdown.querySelectorAll('input:focus').length === 0
    ) {
      setIsOpen(false);
    } else if (
      dropdown &&
      dropdown.contains(target as Node) &&
      !dontCloseOnDropdownClick
    ) {
      if (openChangeTimeout.current) {
        clearTimeout(openChangeTimeout.current)
      }

      openChangeTimeout.current = setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }
  }, [isOpen, hasOpened, containerRef, dropdownRef, dontCloseOnDropdownClick]);

  useEffect(() => {
    return () => {
      if (openChangeTimeout.current) {
        clearTimeout(openChangeTimeout.current)
      }
    }
  }, []);

  useDocumentEvent('click', hasOpened && isOpen, handleClickOutsideDropdown);

  useEffect(() => {
    if (isOpen !== prevOpen.current) {
      prevOpen.current = isOpen

      if (isOpen) {
        setTimeout(() => setHasOpened(true), 100)
      } else {
        setHasOpened(false)
      }
    }
  }, [isOpen])

  let dropdownStyle: any = {}
  if (isOpen && containerRef.current) {
    const containerRect = containerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current && dropdownRef.current.getBoundingClientRect();
    if (containerRect.top + (dropdownRect || containerRect).height > window.innerHeight - 20) {
      dropdownStyle.bottom = 20
    } else {
      dropdownStyle.top = containerRect.top > 20
        ? containerRect.top + containerRect.height
        : 20;
    }
    switch (align) {
      case 'right':
        dropdownStyle.right = document.body.clientWidth - containerRect.left - containerRef.current.offsetWidth;
        break;
      case 'adjacent-right':
        dropdownStyle.left = containerRect.right;
        break;
      case 'adjacent-left':
        dropdownStyle.right = containerRect.left;
        break;
      default:
        dropdownStyle.left = containerRect.left;
        break;
    }
    dropdownStyle.position = 'fixed';
  }

  const dropdownProps = {
    ref: dropdownRef,
    className: 'Dropdown',
    style: dropdownStyle
  };

  return (
    <div
      className={`Dropdown-Container ${isOpen ? 'open' : ''} ${additionalClasses}`}
      ref={containerRef}>
        <button
          onClick={handleButtonClick}
          className={'Dropdown-Button'}
          ref={buttonRef}>
            { buttonContents }
        </button>
        { isOpen && (
          <DropdownPortal>
            <div {...dropdownProps}>{children}</div>
          </DropdownPortal>
        )}
    </div>
  );
}

export default Dropdown;
