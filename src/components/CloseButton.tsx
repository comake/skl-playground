import { ReactComponent as CloseIcon } from '../images/close.svg';
import { ClickEvent } from '../util/Types';

export interface CloseButtonProps {
  label?: string;
  onClick: (event: ClickEvent) => void;
}

function CloseButton({ onClick, label }: CloseButtonProps) {
  return (
    <button className='Close-Button' onClick={onClick}>
      <CloseIcon className='Close-Icon'/>
      {label}
    </button>
  )
}

export default CloseButton;