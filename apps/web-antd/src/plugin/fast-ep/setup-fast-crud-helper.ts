import { fieldToFastCrud, parserSchema } from './ep-parser';

export function formSchemasToFastCrud(schema: string) {
  const fields: any[] = parserSchema(schema);
  if (!fields) {
    return [];
  }
  const fastCrudConfig = fieldToFastCrud(fields);
  // 外层加上 columns 包裹
  return {
    columns: fastCrudConfig,
  };
}
