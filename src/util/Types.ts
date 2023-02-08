import { SHACL } from './Vocabularies';

export type SelectElementEvent = React.SyntheticEvent<HTMLSelectElement>;
export type InputElementEvent = React.SyntheticEvent<HTMLInputElement>;
export type TextAreaElementEvent = React.SyntheticEvent<HTMLTextAreaElement>;
export type ClickEvent = React.MouseEvent<HTMLButtonElement>;

export interface ReferenceNodeObject {
  '@id': string;
}

export type ShaclProperty = {
  '@id': string;
  [SHACL.maxCount]?: {
    '@type': 'http://www.w3.org/2001/XMLSchema#integer'; 
    '@value': number;
  };
  [SHACL.minCount]?: {
    '@type': 'http://www.w3.org/2001/XMLSchema#integer';
    '@value': number;
  };
  [SHACL.name]: string;
  [SHACL.path]?: ReferenceNodeObject;
  [SHACL.class]?: ReferenceNodeObject;
  [SHACL.datatype]?: ReferenceNodeObject;
  [SHACL.nodeKind]?: ReferenceNodeObject;
}

export interface ClickLocation {
  x: number;
  y: number;
}

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' |  'unshift';

export type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> =
  Pick<TObj, Exclude<keyof TObj, ArrayLengthMutationKeys>>
  & {
    readonly length: L 
    [I: number ] : T
    [Symbol.iterator]: () => IterableIterator<T>   
  }

export type OrArray<T> = T | T[];