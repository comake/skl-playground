import { Entity } from '@comake/skql-js-engine';
import type { NodeObject } from 'jsonld';
import jsonld from 'jsonld';
import files from './assets/schemas/files.json';
import events from './assets/schemas/events.json';
import core from './assets/schemas/core.json';
import { JsonLdArray } from 'jsonld/jsonld-spec';

export const SCHEMA_SETS = {
  files: 'files',
  events: 'events',
} as const;

export type SchemaSet = keyof typeof SCHEMA_SETS;

function keySchemasOnId(schemas: Entity[]): Record<string, Entity> {
  return schemas.reduce((obj, schema) => {
    return { ...obj, [schema['@id']]: schema }
  }, {});
}

async function frameSchemas(schemas: JsonLdArray): Promise<Entity[]> {
  const nonBlankNodes = schemas
    .map((schema): string | undefined => schema['@id'] as string | undefined)
    .filter((id): boolean => id !== undefined && !id.startsWith('_:'));
  const framedSchema = await jsonld.frame(
    schemas,
    {
      '@context': {},
      '@id': nonBlankNodes as any,
    },
  );

  return framedSchema['@graph'] as Entity[];
}

export async function frameAndCombineSchemas(
  schema: NodeObject,
): Promise<Entity[]> {
  const expandedSchema = await jsonld.expand(schema);
  return await frameSchemas(expandedSchema);
}

export async function loadSchemaSet(
  schemaSet: SchemaSet
): Promise<{
  coreSchemas: Record<string, Entity>,
  schemas: Record<string, Entity>,
}> {
  const rawSchemas = schemaSet === 'files' ? files : events;
  const schemas = await frameAndCombineSchemas(rawSchemas);
  const coreSchemas = await frameAndCombineSchemas(core);
  return {
    schemas: keySchemasOnId(schemas),
    coreSchemas: keySchemasOnId(coreSchemas),
  }
}