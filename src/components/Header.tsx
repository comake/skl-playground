import { ReactComponent as SklIcon } from '../images/standard-knowledge-language.svg';
import ThemeToggle from './ThemeToggle';

function Header() { 

  return (
    <div className='Header Centered'>
      <SklIcon className='Header-Logo' />
      <div className='Header-Text Flex-Spacer'>Standard Knowledge Language Playground</div>
      <ThemeToggle />
    </div>
  )
}

export default Header;