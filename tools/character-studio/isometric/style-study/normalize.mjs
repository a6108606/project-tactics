import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {decode,crop,encode} from '../../pipeline/png.mjs';
import {removeChroma,opaqueBounds} from '../sprite.js';
const dir=path.dirname(new URL(import.meta.url).pathname),ids=['plumet-des-mousses','bourlaine-jeune'],report=[];
for(const id of ids){
 for(const version of ['before','after']){
  const source=path.join(dir,version==='before'?`../assets/catalog/${id}/se.png`:`${id}-source.png`),bytes=fs.readFileSync(source),im=decode(bytes);
  const data=version==='after'?removeChroma(im.data):im.data,b=opaqueBounds(data,im.width,im.height);
  if(b[0]<4||b[1]<4||b[2]>im.width-4||b[3]>im.height-4)throw Error(id+' needs background or margin correction');
  const box=[Math.max(0,b[0]-4),Math.max(0,b[1]-4),Math.min(im.width,b[2]+4)-Math.max(0,b[0]-4),Math.min(im.height,b[3]+4)-Math.max(0,b[1]-4)],out=crop({...im,data},box),png=encode(out.width,out.height,out.data);
  fs.writeFileSync(path.join(dir,`${id}-${version}.png`),png);
  let transparent=0;for(let p=3;p<out.data.length;p+=4)transparent+=out.data[p]===0;
  report.push({id,version,source_sha256:crypto.createHash('sha256').update(bytes).digest('hex'),output_sha256:crypto.createHash('sha256').update(png).digest('hex'),crop:box,dimensions:[out.width,out.height],fully_transparent_pixels:transparent,method:version==='after'?'Shared Ryuu chroma removal, alpha crop without resizing or repainting':'Alpha crop without resizing or repainting'});
 }
}
fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify({date:'2026-10-16',images:report},null,2)+'\n');console.log(JSON.stringify(report.map(({id,version,dimensions,fully_transparent_pixels})=>({id,version,dimensions,fully_transparent_pixels})),null,2));
