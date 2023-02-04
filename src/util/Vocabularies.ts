type Namespace<T extends string, TBase extends string> = {
  [key in T]: `${TBase}${key}`
}

function createNamespace<T extends string, TBase extends string>(
  baseUri: TBase, 
  localNames: T[],
): Namespace<T, TBase> {
  return localNames.reduce((obj, localName): Namespace<T, TBase> => {
    return { ...obj, [localName]: `${baseUri}${localName}`}
  }, {} as Namespace<T, TBase>);
}
 
export const SKL = createNamespace('https://standardknowledge.com/ontologies/core/', [
  'parameters',
  'Verb',
]);

export const SHACL = createNamespace('http://www.w3.org/ns/shacl#', [
  'property',
  'name',
  'minCount',
  'maxCount',
  'path',
  'datatype',
  'class',
  'nodeKind'
]);

export const XSD = createNamespace('http://www.w3.org/2001/XMLSchema#', [
  'boolean',
  'integer',
  'double',
  'decimal',
  'string',
  'float',
  'positiveInteger',
  'negativeInteger',
  'int',
  'date',
  'time',
  'dateTime',
]);

export const GREL = createNamespace('http://users.ugent.be/~bjdmeest/function/grel.ttl#', [
  'array_length',
  'p_array_a',
])