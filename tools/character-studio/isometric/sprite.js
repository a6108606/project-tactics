import {createRecipeMasks,recipeColors} from '../pipeline/mask-engine.js';
import {recolor,maskPreview} from '../interactive/render.js';
import {catalogMasks} from './catalog-masks.js';
export function removeChroma(image){
 const out=new Uint8ClampedArray(image);
 for(let p=0;p<out.length;p+=4){
  const [r,g,b]=out.slice(p,p+3),d=g-Math.max(r,b);
  if(d>180&&r<70&&b<70){out[p]=out[p+1]=out[p+2]=out[p+3]=0;continue;}
  if(d>40&&g>90){
   const a=Math.max(0,1-d/255);
   out[p]=Math.min(255,r/a);out[p+1]=Math.max(0,Math.min(255,(g-255*(1-a))/a));out[p+2]=Math.min(255,b/a);out[p+3]=Math.round(255*a);
  }
 }
 return out;
}
export function prepare(image,recipe){const source=recipe.chroma===false?new Uint8ClampedArray(image):removeChroma(image);return{source,masks:recipe.schema==='project-tactics/catalog-materials'?catalogMasks(source,recipe):createRecipeMasks(source,recipe),defaults:recipeColors(recipe)};}
export function paint(asset,colors,debug=false){return debug?maskPreview(asset.source,asset.masks):recolor(asset.source,asset.masks,asset.defaults,colors);}
export function opaqueBounds(source,w,h){let x0=w,y0=h,x1=-1,y1=-1;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(source[(y*w+x)*4+3]>10){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}return[x0,y0,x1+1,y1+1];}
