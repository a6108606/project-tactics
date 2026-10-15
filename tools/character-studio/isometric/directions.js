import {opaqueBounds} from './sprite.js';
export const SIZE=1254;
export const cache=new Map();
export async function readJSON(url){const r=await fetch(url);if(!r.ok)throw Error('Fichier inaccessible : '+url);return r.json();}
export function loadView(view){
 if(cache.has(view.id))return cache.get(view.id);
 const promise=(async()=>{
  const recipe=await readJSON(view.recipe),response=await fetch(view.file);if(!response.ok)throw Error('Sprite inaccessible : '+view.label);
  const bytes=await response.arrayBuffer(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  if(hash!==view.sha256)throw Error('Empreinte différente : '+view.label);
  const bitmap=await createImageBitmap(new Blob([bytes],{type:'image/png'}));
  if(bitmap.width!==SIZE||bitmap.height!==SIZE){bitmap.close();throw Error('Dimensions incompatibles : '+view.label);}
  const canvas=document.createElement('canvas');canvas.width=canvas.height=SIZE;const context=canvas.getContext('2d');context.drawImage(bitmap,0,0);bitmap.close();
  const pixels=context.getImageData(0,0,SIZE,SIZE).data;
  const asset=await new Promise((resolve,reject)=>{const worker=new Worker(new URL('./mask-worker.js',import.meta.url),{type:'module'});const timer=setTimeout(()=>{worker.terminate();reject(Error('Préparation trop longue : '+view.label));},60000);const end=()=>{clearTimeout(timer);worker.terminate();};worker.onmessage=({data})=>{end();data.error?reject(Error(data.error)):resolve(data.asset);};worker.onerror=e=>{end();reject(Error(e.message));};worker.postMessage({pixels,recipe},[pixels.buffer]);});
  return {...asset,recipe,view,bounds:opaqueBounds(asset.source,SIZE,SIZE)};
 })().catch(e=>{cache.delete(view.id);throw e;});cache.set(view.id,promise);return promise;
}
