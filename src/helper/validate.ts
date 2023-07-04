import Ajv from 'ajv';
const ajv = new Ajv();


/**
 * 
 * @param data 
 * @param schema 
 * @returns true if validation successful
 * @throws Invalid Data Exception if not validated successful
 */
export function validate(data:any, schema:any) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) throw new Error('Invalid Data Exception');
  return true;
}