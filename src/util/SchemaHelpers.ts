import { Entity } from '@comake/skl-js-engine';
import type { NodeObject } from 'jsonld';
import jsonld from 'jsonld';
import core from '../assets/schemas/core.json';
import { JsonLdArray } from 'jsonld/jsonld-spec';
import { OWL, SKL } from './Vocabularies';
import { Project } from '../PreloadedProjects';
import { SchemaSection as SchemaSectionType } from './Types';

export const SCHEMA_SECTIONS = {
  Nouns: 'Nouns',
  Properties: 'Properties',
  Integrations: 'Integrations',
  Verbs: 'Verbs',
  Mappings: 'Mappings',
  Accounts: 'Accounts',
  Other: 'Other',
}

export const SCHEMA_TYPE_TO_SECTION = {
  [SKL.OpenApiDescription]: SCHEMA_SECTIONS.Integrations,
  [SKL.Integration]: SCHEMA_SECTIONS.Integrations,
  [OWL.Class]: SCHEMA_SECTIONS.Nouns,
  [SKL.Verb]: SCHEMA_SECTIONS.Verbs,
  [SKL.VerbIntegrationMapping]: SCHEMA_SECTIONS.Mappings,
  [SKL.VerbNounMapping]: SCHEMA_SECTIONS.Mappings,
  [SKL.Account]: SCHEMA_SECTIONS.Accounts,
  [SKL.SecurityCredentials]: SCHEMA_SECTIONS.Accounts,
};

export function keyOnId<T extends { id: string }>(arr: T[]) {
  return arr.reduce((obj: Record<string, T>, item) => (
    { ...obj, [item.id]: item }
  ), {});
}
function keySchemasOnId(schemas: Entity[]): Record<string, Entity> {
  return schemas.reduce((obj, schema) => {
    return { ...obj, [schema['@id']]: schema }
  }, {});
}

async function frameSchemas(schemas: JsonLdArray, frameTypes: string[]): Promise<Entity[]> {
  const frame = {
    '@type': frameTypes,
    'http://www.w3.org/2000/01/rdf-schema#subClassOf': {
      '@embed': '@never',
      "@omitDefault": true
    },
    'https://standardknowledge.com/ontologies/core/parameters': {
      "@omitDefault": true,
      'http://www.w3.org/ns/shacl#property': {
        "@omitDefault": true,
        '@container': '@list',
        'http://www.w3.org/ns/shacl#minCount': {
          "@omitDefault": true
        },
        'http://www.w3.org/ns/shacl#maxCount': {
          "@omitDefault": true
        },
        'http://www.w3.org/ns/shacl#class': {
          '@embed': '@never',
          "@omitDefault": true
        },
        'http://www.w3.org/ns/shacl#path': {
          "@omitDefault": true
        },
        'http://www.w3.org/ns/shacl#datatype': {
          "@omitDefault": true
        }
      }
    },
    'http://www.w3.org/ns/shacl#property': {
      "@omitDefault": true,
      '@container': '@list',
      'http://www.w3.org/ns/shacl#minCount': {
        "@omitDefault": true
      },
      'http://www.w3.org/ns/shacl#maxCount': {
        "@omitDefault": true
      },
      'http://www.w3.org/ns/shacl#class': {
        '@embed': '@never',
        "@omitDefault": true
      },
      'http://www.w3.org/ns/shacl#path': {
        "@omitDefault": true
      },
      'http://www.w3.org/ns/shacl#datatype': {
        "@omitDefault": true
      }
    },
    'https://standardknowledge.com/ontologies/core/integration': {
      '@embed': '@never',
      "@omitDefault": true
    },
    'https://standardknowledge.com/ontologies/core/noun': {
      '@embed': '@never',
      "@omitDefault": true
    },
    'https://standardknowledge.com/ontologies/core/verb': {
      '@embed': '@never',
      "@omitDefault": true
    },
    'https://standardknowledge.com/ontologies/core/returnValue': {
      '@embed': '@never',
      "@omitDefault": true
    },
    'https://standardknowledge.com/ontologies/core/account': {
      '@embed': '@never',
      "@omitDefault": true
    },
  }
  const framedSchema = await jsonld.frame(schemas, frame, { requireAll: false });
  return framedSchema['@graph'] as Entity[];
}

export async function frameAndCombineSchemas(
  schema: NodeObject,
  frameTypes: string[] = [OWL.Class]
): Promise<Entity[]> {
  const expandedSchema = await jsonld.expand(schema);
  return await frameSchemas(expandedSchema, frameTypes);
}

export async function loadCoreSchemas(): Promise<Record<string, Entity>> {
  const coreSchemas = await frameAndCombineSchemas(core);
  return keySchemasOnId(coreSchemas);
}

export async function loadSchemasForProject(
  project: Project,
  coreSchemas: Record<string, Entity>
): Promise<Record<string, Entity>> {
  if (project.unframedSchemas) {
    const rawSchemas = project.unframedSchemas;
    const coreSchemaTypes = Object.values(coreSchemas).map(schema => schema['@id']);
    const schemas = await frameAndCombineSchemas(rawSchemas, coreSchemaTypes);
    return keySchemasOnId(schemas);
  } 
  return {};
}

export function schemasBySection(schemas: Record<string, Entity>) {
  const sectionsByName = Object.values(schemas).reduce((obj: Record<string, SchemaSectionType>, schema) => {
    const section = sectionForSchema(schema);
    if (section in obj) {
      if (obj[section].schemas) {
        obj[section].schemas!.push(schema);
      } else {
        obj[section].schemas = [ schema ];
      }
    } else {
      obj[section] = {
        name: section,
        schemas: [ schema ],
      }
    }
    return obj;
  }, {});
  return Object.values(sectionsByName);
}

export function sectionForSchema(schema: Entity): (typeof SCHEMA_SECTIONS)[keyof typeof SCHEMA_SECTIONS] {
  let tab;
  if (Array.isArray(schema['@type'])) {
    tab = schema['@type'].map(type => SCHEMA_TYPE_TO_SECTION[type as keyof typeof SCHEMA_TYPE_TO_SECTION]).filter(Boolean)[0];
  } else {
    tab = SCHEMA_TYPE_TO_SECTION[schema['@type'] as keyof typeof SCHEMA_TYPE_TO_SECTION]
  }
  return tab ||= SCHEMA_SECTIONS.Other;
}