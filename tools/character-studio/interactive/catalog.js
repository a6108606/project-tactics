import {RECIPES} from './assets/recipes.js';
import {CHANNELS} from './appearance-contract.js';
export {RECIPES};
// The preparation catalogue is general; the existing hero UI has five fixed slots.
export const isHeroCompatible=r=>r.view_id==='main'&&r.status!=='draft'&&r.channels.length===CHANNELS.length&&CHANNELS.every(id=>r.channels.some(c=>c.id===id));
export const getRecipe=(entity,base)=>RECIPES.find(r=>r.entity_id===entity&&r.base_id===base&&isHeroCompatible(r));
