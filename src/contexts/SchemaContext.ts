import type { Entity } from '@comake/skl-js-engine';
import { createContext } from "react";

interface SchemaContextType {
  schemas: Record<string, Entity>;
  coreSchemas: Record<string, Entity>,
  setCoreSchemas: (coreSchemas: Record<string, Entity>) => void;
  setSchemas: (schemas: Record<string, Entity>) => void;
  selectedSchema?: string,
  setSelectedSchema: (id: string | undefined) => void;
  openSchemas: string[];
  setOpenSchemas: (openSchemas: string[]) => void;
  addNewSchema: () => void;
  exportSchemas: () => void;
}

const SchemaContext = createContext<SchemaContextType>({
  schemas: {},
  coreSchemas: {},
  setSchemas: () => {},
  setCoreSchemas: () => {},
  selectedSchema: undefined,
  setSelectedSchema: () => {},
  openSchemas: [],
  setOpenSchemas: () => {},
  addNewSchema: () => {},
  exportSchemas: () => {}
});

export default SchemaContext;
