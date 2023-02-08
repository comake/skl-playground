import { useContext } from 'react';
import SchemaContext from '../contexts/SchemaContext';
import { ReactComponent as PlusIcon } from '../images/plus.svg';

function NewSchemaButton() {
  const { addNewSchema } = useContext(SchemaContext);
  return (
    <button 
      onClick={addNewSchema}
      className='Project-Header-Button' 
      title='New Schema'>
        <PlusIcon />
    </button>
  )
}

export default NewSchemaButton;