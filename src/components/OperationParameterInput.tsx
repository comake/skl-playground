import { ensureArray, RDFS } from '@comake/skl-js-engine';
import { useCallback, useContext } from 'react';
import SchemaContext from '../contexts/SchemaContext';
import { InputElementEvent, SelectElementEvent, ShaclProperty, TextAreaElementEvent } from '../util/Types';
import { SHACL, XSD } from '../util/Vocabularies';
import CodeEditor from './CodeEditor';
import Select from './Select';

export interface OperationParameterInputProps {
  parameter: ShaclProperty;
  value: string | number | boolean;
  onChange: (value: any) => void;
}

const booleanSelectOptionSections = [{
  options: [
    { value: 'true', label: 'True' },
    { value: 'false', label: 'False' },
  ]
}]


function OperationParameterInput({ parameter, value, onChange }: OperationParameterInputProps) {
  const { schemas } = useContext(SchemaContext);

  const updateStringValue = useCallback((event: InputElementEvent | SelectElementEvent | TextAreaElementEvent) => {
    onChange(event.currentTarget.value);
  }, [onChange]);

  const updateNumberValue = useCallback((event: InputElementEvent) => {
    onChange(Number.parseInt(event.currentTarget.value));
  }, [onChange]);

  const updateBooleanValue = useCallback((event: SelectElementEvent) => {
    onChange(event.currentTarget.value === 'true');
  }, [onChange]);

  const updateCodeValue = useCallback((code: string) => {
    try {
      const jsonValue = JSON.parse(code);
      onChange(jsonValue);
    } catch (error: unknown) {
      console.log('invalid json', error);
    }
  }, [onChange]);

  if (SHACL.datatype in parameter) {
    switch(parameter[SHACL.datatype]!['@id']) {
      case XSD.string:
        return <input 
          className='Operation-Parameter-Input' 
          type='text' 
          value={value as string} 
          onChange={updateStringValue} 
        />
      case XSD.integer:
      case XSD.negativeInteger:
      case XSD.positiveInteger:
        return <input 
          className='Operation-Parameter-Input' 
          type='number' 
          value={value as number} 
          onChange={updateNumberValue} 
        />
      case XSD.boolean:
        return <Select
          value={String(value)}
          defaultOptionLabel={'Select'}
          sections={booleanSelectOptionSections}
          onChange={updateBooleanValue}
        />
      default:
        throw new Error('Unsupported SHACL data type');
    }
  } else if (SHACL.class in parameter) {
    const targetClass = parameter[SHACL.class]!['@id'];
    const options = Object.values(schemas).reduce((arr, schema) => {
      const types = ensureArray(schema['@type']);
      if (types.includes(targetClass)) {
        arr.push({ 
          value: schema['@id'], 
          label: schema[RDFS.label] as string || schema['@id'] 
        });
      }
      return arr;
    }, [] as { value: string, label: string }[]);
    return <Select
      value={value !== undefined ? String(value) : undefined}
      defaultOptionLabel={'Select'}
      sections={[{ options }]}
      onChange={updateStringValue}
    />
  } else if (SHACL.nodeKind in parameter) {
    return <></>
  }

  const stringValue = value ? JSON.stringify(value, null, 2) : '{\n   \n}';
  return (
    <CodeEditor 
      classes={'Operation-Parameter-Input'}
      code={stringValue} 
      onChange={updateCodeValue} 
    />
  )
}

export default OperationParameterInput;