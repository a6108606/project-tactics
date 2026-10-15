/** V3 five-channel adapter. The shared engine also handles non-human channels. */
import {getRecipe} from './catalog.js';
import {createRecipeMasks,recipeColors} from '../pipeline/mask-engine.js';
export {inside} from '../pipeline/mask-engine.js';
export {CHANNELS,MASK_VERSION} from './appearance-contract.js';
export const REGION_LABELS=Object.fromEntries(getRecipe('ryuu','masculine').channels.map(c=>[c.id,c.region_label]));
// Compatibility for the original pixel regression suite and appearance schema.
export const RYUU=Object.fromEntries(['masculine','feminine'].map(base=>{const r=getRecipe('ryuu',base);return [base,{anchor:r.anchor,colors:recipeColors(r),equipmentSamples:r.equipment_samples}];}));
export function createMasks(source,crop,base){
  const recipe=getRecipe('ryuu',base);if(JSON.stringify(crop)!==JSON.stringify(recipe.crop))throw Error('Cadrage incompatible avec la fiche Ryuu.');
  return createRecipeMasks(source,recipe);
}
