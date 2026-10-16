import {STORAGE} from './state.js';
/** Getter injection also covers browsers that throw when accessing localStorage. */
export function saveLocal(state,getStorage=()=>localStorage) {
  try{getStorage().setItem(STORAGE,JSON.stringify(state));return true;}catch{return false;}
}
