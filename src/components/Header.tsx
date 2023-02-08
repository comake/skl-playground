import { ReactComponent as SklIcon } from '../images/standard-knowledge-language.svg';
import DiscordButton from './DiscordButton';
import GithubButton from './GithubButton';
import ThemeToggle from './ThemeToggle';

function Header() { 

  return (
    <div className='Header Centered'>
      <SklIcon className='Header-Logo' />
      <div className='Header-Text Flex-Spacer'>Standard Knowledge Language Playground</div>
      <DiscordButton />
      <GithubButton />
      <ThemeToggle />
    </div>
  )
}

export default Header;