import { ensureArray, RDFS, SKLEngine } from '@comake/skl-js-engine';
import { NodeObject } from 'jsonld';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import SchemaContext from '../contexts/SchemaContext';
import OperationParameter from './OperationParameter';
import Select, { SelectOption } from './Select';
import { SelectElementEvent, ShaclProperty } from '../util/Types';
import { SHACL, SKL } from '../util/Vocabularies';
import ResultContext from '../contexts/ResultContext';
import { rmlFunctions } from '../rmlFunctions';

function OperationView() {
  const sklEngine = useRef<SKLEngine>();
  const { schemas } = useContext(SchemaContext);
  const { setResult, setLoadingResult, loadingResult } = useContext(ResultContext);
  const [selectedVerb, setSelectedVerb] = useState<string>();
  const [parameterValues, setParameterValues] = useState<Record<string, string | boolean | number>>({});
  const [operationError, setOperationError] = useState<string>();

  const verbSelectSections = useMemo(() => {
    const verbOptions = Object.values(schemas).reduce((arr: SelectOption[], schema): SelectOption[] => {
      if (ensureArray(schema['@type']).includes(SKL.Verb)) {
        arr.push({
          value: schema['@id'],
          label: schema[RDFS.label] as string,
        });
      }
      return arr;
    }, []);
    return [{ options: verbOptions }];
  }, [schemas]);

  const selectedVerbSchema = useMemo(() => {
    if (selectedVerb) {
      return schemas[selectedVerb];
    }
  }, [selectedVerb, schemas]);

  const parameters = useMemo<ShaclProperty[]>((): ShaclProperty[] => {
    if (selectedVerbSchema && SKL.parameters in selectedVerbSchema) {
      const parametersObject = selectedVerbSchema[SKL.parameters] as NodeObject;
      return (ensureArray(parametersObject[SHACL.property]) as ShaclProperty[])
        .sort((aParam, bParam) => {
          const aHasMinCount = SHACL.minCount in aParam;
          const bHasMinCount = SHACL.minCount in bParam;
          if (aHasMinCount && !bHasMinCount) {
            return -1;
          }
          if (!aHasMinCount && bHasMinCount) {
            return 1;
          }
          return 0;
        });
    }
    return [];
  }, [selectedVerbSchema]);

  const updateParameter = useCallback((parameterName: string, value: string | boolean | number) => {
    setOperationError(undefined);
    setParameterValues((prevParameterValues) => ({ ...prevParameterValues, [parameterName]: value }))
  }, []);

  const updateVerb = useCallback((event: SelectElementEvent) => {
    setParameterValues({});
    setSelectedVerb(event.currentTarget.value);
  }, []);

  useEffect(() => {
    sklEngine.current = new SKLEngine({ 
      type: 'memory', 
      schemas: Object.values(schemas),
      functions: rmlFunctions
    });
  }, [schemas]);

  const runOperation = useCallback(() => {
    async function run() {
      if (selectedVerbSchema) {
        setLoadingResult(true);
        const verbName = selectedVerbSchema[RDFS.label] as string;
        setOperationError(undefined);
        setResult(undefined);
        try {
          const response = await sklEngine.current!.verb[verbName](parameterValues);
          setResult(JSON.stringify(response, null, 2));
        } catch (error: unknown) {
          if (error instanceof Error) {
            setOperationError(error.message);
          }
        } finally {
          setLoadingResult(false);
        }
      }
    }
    run();
  }, [parameterValues, selectedVerbSchema, setLoadingResult, setResult]);

  useEffect(() => {
    const selectedVerbInSchema = verbSelectSections[0].options.some((verbOption) => verbOption.value === selectedVerb);
    if (!selectedVerbInSchema) {
      setSelectedVerb(undefined);
      setParameterValues({});
      setOperationError(undefined);
      setResult(undefined);
    }
  }, [selectedVerb, setResult, verbSelectSections])
  
  return (
    <div className='Operation-View'>
      <div className='Operation-Configuration Flex-Spacer'>
        <div className='Operation-Section-Header'>Run a Verb</div>
        <Select
          value={selectedVerb}
          defaultOptionLabel={'Select a Verb'}
          classes={'Verb-Select Flex-Spacer Centered'}
          sections={verbSelectSections}
          onChange={updateVerb}
        />
        { selectedVerb && (
          <div className='Operation-Section-Header'>
            { parameters.length > 0 ? 'Parameters' : 'No parameters' }
          </div>
        )}
        { parameters.map((parameter) => (
          <OperationParameter 
            key={parameter[SHACL.name]}
            parameter={parameter} 
            value={parameterValues[parameter[SHACL.name]]} 
            onChange={updateParameter}
          />
        ))}
      </div>
      <div className='Operation-Toolbar Centered'>
        { operationError && <div className='Operation-Error Error'>{ operationError }</div>}
        <div className='Flex-Spacer'></div>
        { selectedVerb && (
          <button 
            className='CTA-Button Run-Operation-Button' 
            disabled={loadingResult} 
            onClick={runOperation}>
              Run
          </button>
        )}
      </div>
    </div>
  )
}

export default OperationView;