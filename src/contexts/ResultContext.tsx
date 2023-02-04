import { createContext } from 'react';

interface ResultContextType {
  result: string | undefined;
  setResult: (result: string | undefined) => void;
  loadingResult: boolean;
  setLoadingResult: (loading: boolean) => void;
}
const ResultContext = createContext<ResultContextType>({ 
  result: undefined, 
  setResult: (result: string | undefined) => {},
  loadingResult: false,
  setLoadingResult: (loading: boolean) => {},
});

export default ResultContext;