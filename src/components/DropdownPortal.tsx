import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

export interface DropdownPortalProps {
  zIndex?: number;
  children: ReactNode;
}

class DropdownPortal extends React.Component {
  private el: HTMLDivElement;
  props: DropdownPortalProps;
  
  constructor(props: DropdownPortalProps) {
    super(props);
    this.props = props;
    this.el = document.createElement('div');
    this.el.classList.add('Dropdown-Portal');
    this.el.style.zIndex = props.zIndex ? props.zIndex.toString() : '100';
  }

  componentDidMount() {
    const overlayContainer = document.getElementsByClassName("App")[0] || document.body;
    overlayContainer.appendChild(this.el);
  }

  componentWillUnmount() {
    const overlayContainer = document.getElementsByClassName("App")[0] || document.body;
    if (document.body.contains(this.el) && overlayContainer.contains(this.el)) {
      overlayContainer.removeChild(this.el);
    }
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}


export default DropdownPortal;
