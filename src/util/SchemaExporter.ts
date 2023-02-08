import { downloadZip } from 'client-zip';
import { Entity } from '@comake/skl-js-engine';
import { sectionForSchema } from './SchemaHelpers';
import { RDFS } from './Vocabularies';

export class SchemaExporter {
  private readonly schemas: Record<string, Entity>;
  private readonly coreSchemas: Record<string, Entity>;
  private readonly projectName: string;

  public constructor(
    projectName: string,
    schemas: Record<string, Entity>, 
    coreSchemas: Record<string, Entity>
  ) {
    this.projectName = projectName;
    this.schemas = schemas;
    this.coreSchemas = coreSchemas;
  }

  public async exportSchemas(): Promise<void> {
    const combinedSchema = { '@graph': [] as Entity[] };
    const schemasToZip = [];
    for (const coreSchema of Object.values(this.coreSchemas)) {
      combinedSchema['@graph'].push(coreSchema);
      schemasToZip.push({
        name: `itemized/core-schemas/${coreSchema[RDFS.label] || coreSchema['@id']}.json`,
        input: JSON.stringify(coreSchema),
      });
    }
    for (const schema of Object.values(this.schemas)) {
      combinedSchema['@graph'].push(schema);
      const section = sectionForSchema(schema);
      schemasToZip.push({
        name: `itemized/schemas/${section}/${schema[RDFS.label] || schema['@id']}.json`,
        input: JSON.stringify(schema),
      });
    }
    schemasToZip.push({
      name: 'combined.json',
      input: JSON.stringify(combinedSchema),
    })
    const blob = await downloadZip(schemasToZip).blob();
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${this.projectName}.zip`
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
} 

export default SchemaExporter;