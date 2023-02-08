import { ReactNode } from 'react';

import '../css/Modal.css';
import { OrArray } from '../util/Types';
import CloseButton from './CloseButton';

export interface ModalProps {
  children: OrArray<ReactNode>;
  header: string;
  additionalClasses?: string;
  close?: () => void;
}

function Modal({ children, header, additionalClasses, close }: ModalProps) {
  return (
    <div className={`Modal ${additionalClasses ?? ''}`}>
      <div className='Modal-Card'>
        <div className='Modal-Header'>
          <div className='Modal-Header-Text'>{header}</div>
          { close && <CloseButton onClick={close} /> }
        </div>
        { children }
      </div>
    </div>
  )
}

export default Modal;