import type { Entity } from '@comake/skl-js-engine';
import { createContext } from "react";

interface SetSchemaArgs { 
  schemas: Record<string, Entity>; 
  coreSchemas: Record<string, Entity>;
};

interface SchemaContextType {
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
