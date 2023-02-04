import { SHACL } from './Vocabularies';

export type SelectElementEvent = React.SyntheticEvent<HTMLSelectElement>;
export type InputElementEvent = React.SyntheticEvent<HTMLInputElement>;
export type TextAreaElementEvent = React.SyntheticEvent<HTMLTextAreaElement>;

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