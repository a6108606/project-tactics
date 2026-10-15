import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {decode} from '../pipeline/png.mjs';import {prepare,paint,opaqueBounds} from './sprite.js';
const here=path.dirname(new URL(import.meta.url).pathname),file='assets/catalog/catalog.json',cat=JSON.parse(fs.readFileSync(path.join(here,file))),rows=[];
const check=(name,pass,detail)=>rows.push({name,pass:!!pass,...detail===undefined?{}:{detail}}),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
check('53 unique forms',cat.entries.length===53&&new Set(cat.entries.map(e=>e.id)).size===53);
check('10 heroes / 30 bestiary / 10 base summons / 3 legacy',JSON.stringify(['heroes','bestiary','summons','legacy'].map(c=>cat.entries.filter(e=>e.category===c).length))==='[10,30,10,3]');
for(const e of cat.entries.filter(e=>e.status==='ready')){
 const manifest=JSON.parse(fs.readFileSync(path.join(here,e.id==='ryuu-masculine'?'assets/directions.json':e.manifest)));
 check(e.id+' eight unique sources',manifest.views.length===8&&new Set(manifest.views.map(v=>v.sha256)).size===8);
 const totals={};
 for(const view of manifest.views){
  const bytes=fs.readFileSync(path.join(here,view.file)),im=decode(bytes),recipe=JSON.parse(fs.readFileSync(path.join(here,view.recipe))),a=prepare(im.data,recipe),b=opaqueBounds(a.source,im.width,im.height),name=e.id+'/'+view.id;
  check(name+' dimensions / SHA-256',hash(bytes)===view.sha256&&im.width===(view.width||1254)&&im.height===(view.height||1254));
  check(name+' alpha and safe margins',a.source[3]===0&&b[0]>1&&b[1]>1&&b[2]<im.width-1&&b[3]<im.height-1);
  check(name+' original palette identity',Buffer.from(paint(a,a.defaults)).equals(Buffer.from(a.source)));
  const out=paint(a,Object.fromEntries(recipe.channels.map(c=>[c.id,'#0044FF'])));let alpha=true,fixed=true,changed=0;
  for(let i=0;i<im.width*im.height;i++){const p=i*4;alpha&&=out[p+3]===a.source[p+3];const selected=Object.values(a.masks).some(m=>m[i]);const delta=out[p]!==a.source[p]||out[p+1]!==a.source[p+1]||out[p+2]!==a.source[p+2];if(delta)changed++;if(!selected&&delta)fixed=false;}
  check(name+' recolor changes only mask RGB, preserves alpha',alpha&&fixed&&changed>100,{changed});
  for(const [id,m]of Object.entries(a.masks))totals[id]=(totals[id]||0)+m.reduce((n,v)=>n+(v>0),0);
 }
 check(e.id+' all color channels active over eight views',Object.values(totals).every(n=>n>100),totals);
}
const report={forms:cat.entries.filter(e=>e.status==='ready').length,total:cat.entries.length,pass:rows.filter(r=>r.pass).length,fail:rows.filter(r=>!r.pass).length,rows};fs.writeFileSync(path.join(here,'verification-catalog.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({forms:report.forms,pass:report.pass,fail:report.fail,failures:rows.filter(r=>!r.pass)},null,2));if(report.fail)process.exitCode=1;
