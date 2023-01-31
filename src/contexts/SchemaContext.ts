import type { Entity } from '@comake/skql-js-engine';
import { createContext } from "react";

type SetSchemaArgs = { 
  schemas: Record<string, Entity>; 
  coreSchemas: Record<string, Entity>;
};

type SchemaContextType = {
  schemas: Record<string, Entity>;
  coreSchemas: Record<string, Entity>,
  setSchemas: (args: SetSchemaArgs) => void;
  selectedSchema?: string,
  setSelectedSchema: (id: string | undefined) => void;
  openSchemas: string[];
  setOpenSchemas: (openSchemas: string[]) => void;
}

const SchemaContext = createContext<SchemaContextType>({
  schemas: {},
  coreSchemas: {},
  setSchemas: () => {},
  selectedSchema: undefined,
  setSelectedSchema: () => {},
  openSchemas: [],
  setOpenSchemas: () => {},
});

export default SchemaContext;
