import { getValueIfDefined } from '@comake/skl-js-engine';
import { useCallback, useMemo } from 'react';
import { ShaclProperty } from '../util/Types';
import { SHACL } from '../util/Vocabularies';
import OperationParameterInput from './OperationParameterInput';

export interface OperationParameterProps {
  parameter: ShaclProperty;
  value: string | boolean | number;
  onChange: (parameterName: string, value: string | boolean | number) => void;
}


function OperationParameter({ parameter, value, onChange }: OperationParameterProps) {
  const updateValue = useCallback((value:  string | boolean | number) => {
    onChange(parameter[SHACL.name], value)
  }, [onChange, parameter]);

  const required = useMemo(() => {
    return SHACL.minCount in parameter && 
      getValueIfDefined<number>(parameter[SHACL.minCount])! > 0;
  }, [parameter]);

  return (
    <div className='Parameter-Input-Row'>
      <div className='Parameter-Name'>
        {parameter[SHACL.name]}{ required && '*' }
      </div>
      <div className='Parameter-Input-Wrapper'>
        <OperationParameterInput parameter={parameter} value={value} onChange={updateValue} />
      </div>
    </div>
  )
}

export default OperationParameter;