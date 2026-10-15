import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {decode,crop,encode} from '../pipeline/png.mjs';
import {removeChroma,opaqueBounds} from './sprite.js';
import {hsv,families,catalogMasks} from './catalog-masks.js';
const here=path.dirname(new URL(import.meta.url).pathname),dir=path.join(here,'assets/catalog'),cat=JSON.parse(fs.readFileSync(path.join(dir,'catalog.json'))),paths=JSON.parse(fs.readFileSync(process.argv[2]));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),json=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const ids=['n','ne','e','se','s','sw','w','nw'],labels=['Dos','Dos droite','Droite','Face droite','Face','Face gauche','Gauche','Dos gauche'];
const W=384,H=640;
const failures=[];
for(const [id,src]of Object.entries(paths)){try{
 const e=cat.entries.find(e=>e.id===id);if(!e)throw Error('Unknown '+id);
 const dest=path.join(dir,id);fs.mkdirSync(dest,{recursive:true});
 const original=fs.readFileSync(src),im=decode(original);fs.writeFileSync(path.join(dest,'source.png'),original);
 const keyed={...im,data:removeChroma(im.data)};
 const seam=(ideal,radius,score)=>{let best=ideal,cost=Infinity;for(let n=Math.max(2,ideal-radius);n<=ideal+radius;n++){const v=score(n)*1000+Math.abs(n-ideal);if(v<cost){cost=v;best=n;}}return best;};
 const rowSeam=seam(Math.round(im.height/2),60,n=>{let t=0;for(let y=n-2;y<=n+2;y++)for(let x=0;x<im.width;x++)if(keyed.data[(y*im.width+x)*4+3]>100)t++;return t;});
 const rows=[0,rowSeam,im.height],columns=[0,1].map(row=>[0,...[1,2,3].map(c=>seam(Math.round(c*im.width/4),45,n=>{let t=0;for(let y=rows[row];y<rows[row+1];y++)for(let x=n-2;x<=n+2;x++)if(keyed.data[(y*im.width+x)*4+3]>100)t++;return t;})),im.width]);
 const frames=[],report=[];let maxHeight=0;
 for(let k=0;k<8;k++){
  const row=Math.floor(k/4),x=columns[row][k%4],y=rows[row],right=columns[row][k%4+1],bottom=rows[row+1],frame=crop(keyed,[x,y,right-x,bottom-y]);
  const b=opaqueBounds(frame.data,frame.width,frame.height),fw=b[2]-b[0],fh=b[3]-b[1];
  let edge=0;for(let yy=0;yy<frame.height;yy++)for(let xx=0;xx<frame.width;xx++)if((xx<2||xx>=frame.width-2||yy<2||yy>=frame.height-2)&&frame.data[(yy*frame.width+xx)*4+3]>100)edge++;
  if(fw<30||fh<50||fw>W-12||fh>H-25||edge>4)throw Error(`${id}/${ids[k]}: grid unsafe ${fw}x${fh}, edge=${edge}`);
  const data=new Uint8ClampedArray(W*H*4),dx=Math.round(W/2-fw/2),dy=H-25-fh;
  for(let row=0;row<fh;row++)data.set(frame.data.subarray(((b[1]+row)*frame.width+b[0])*4,((b[1]+row)*frame.width+b[2])*4),((dy+row)*W+dx)*4);
  maxHeight=Math.max(maxHeight,fh);frames.push({data,bounds:[dx,dy,dx+fw,dy+fh]});report.push({direction:ids[k],sourceCrop:[x,y,frame.width,frame.height],bounds:b,edgePixels:edge});
 }
 // Find substantial color families across all views; use their median source color as identity reference.
 let channels=[];
 if(e.category!=='heroes'){
  const buckets=families.map(()=>[]);
  for(const f of frames)for(let i=0;i<f.data.length;i+=16){if(f.data[i+3]<230)continue;const [r,g,b]=f.data.subarray(i,i+3),[h,s,v]=hsv(r,g,b);if(s<.16||v<.3)continue;const k=families.findIndex(q=>q.h[0]>q.h[1]?h>=q.h[0]||h<q.h[1]:h>=q.h[0]&&h<q.h[1]);if(k>=0)buckets[k].push([r,g,b]);}
  channels=families.map((q,k)=>({q,list:buckets[k]})).filter(x=>x.list.length>300).sort((a,b)=>b.list.length-a.list.length).slice(0,3).map(({q,list})=>{list.sort((a,b)=>a[0]+a[1]+a[2]-b[0]-b[1]-b[2]);const rgb=list[Math.floor(list.length*.6)];return {id:q.id,label:q.label,color:'#'+rgb.map(c=>c.toString(16).padStart(2,'0')).join('').toUpperCase(),hue:q.h,saturation:[.16,1],value:[.3,1]};});
 }else{
  const name=e.name.toLowerCase(),p=e.palette;
  const hair={ryuu:{hue:[55,160],saturation:[.08,.55]},kael:{hue:[35,65],saturation:[.15,.8]},sela:{hue:[45,160],saturation:[.04,.4]},leo:{hue:[10,40],saturation:[.25,.75]},lina:{hue:[20,75],saturation:[0,.25]}}[name];
  const cloth={ryuu:[[270,345],[270,345],[270,345]],kael:[[260,305],[260,345],[280,330]],sela:[[30,65],[40,80],[5,30]],leo:[[30,65],[15,40],[345,20]],lina:[[35,60],[30,65],[25,48]]}[name];
  channels=[{id:'hair',label:'Cheveux',color:p[1],...hair,value:[name==='leo'?.25:.35,1]},
   {id:'skin',label:'Peau',color:p[0],hue:[15,43],saturation:[.2,.65],value:[.67,1],skin:true},
   ...['clothing1','clothing2','clothing3'].map((id,i)=>({id,label:['Étoffe 1','Étoffe 2','Étoffe 3'][i],color:p[i+2],hue:cloth[i],saturation:name==='ryuu'||name==='kael'?[.12,.7]:i===0&&name!=='lina'?[.03,.25]:[.12,.8],value:[.2,1]}))];
 }
 if(!channels.length)throw Error('No color material '+id);
 const atlas=new Uint8ClampedArray(W*4*H*2*4),views=[];
 for(let k=0;k<8;k++){
  const {data,bounds:b}=frames[k],fh=b[3]-b[1],fy=t=>Math.round(b[1]+fh*t),fx=t=>Math.round(b[0]+(b[2]-b[0])*t);
  const recipe={schema:'project-tactics/catalog-materials',version:1,id:id+'-'+ids[k],crop:[0,0,W,H],anchor:[W/2,H-25],channels:structuredClone(channels),chroma:false};
  if(e.category==='heroes'){
   const ch=Object.fromEntries(recipe.channels.map(c=>[c.id,c]));ch.hair.zone=[0,b[1],W,fy(e.name==='Lina'&&e.base==='feminine'?.68:.41)];
   // Eye/face interiors are protected from palette changes. These conservative rectangles are reviewable recipe data.
   const back=['n','ne','nw'].includes(ids[k]);const ex=back?[]:[[fx(.30),fy(.24),fx(.76),fy(.32)]];ch.hair.exclude=ex;ch.skin.exclude=ex;
   ch.skin.zone=[0,fy(.20),W,H];ch.clothing1.zone=[0,fy(.56),W/2,H];ch.clothing2.zone=[W/2,fy(.56),W,H];ch.clothing3.zone=[0,fy(.38),W,fy(.59)];
  }
  const masks=catalogMasks(data,recipe);report[k].channelPixels=Object.fromEntries(Object.entries(masks).map(([key,v])=>[key,v.reduce((n,x)=>n+(x>0),0)]));
  const png=encode(W,H,data),name=ids[k]+'.png';fs.writeFileSync(path.join(dest,name),png);json(path.join(dest,ids[k]+'.json'),recipe);
  for(let y=0;y<H;y++)atlas.set(data.subarray(y*W*4,(y+1)*W*4),(((Math.floor(k/4)*H+y)*W*4)+(k%4)*W)*4);
  views.push({id:ids[k],label:labels[k],file:`assets/catalog/${id}/${name}`,recipe:`assets/catalog/${id}/${ids[k]}.json`,sha256:hash(png),width:W,height:H,displayHeight:maxHeight});
 }
 fs.writeFileSync(path.join(dest,'atlas.png'),encode(W*4,H*2,atlas));json(path.join(dest,'directions.json'),{id,views});json(path.join(dest,'verification.json'),{source_sha256:hash(original),source_dimensions:[im.width,im.height],frames:report,normalization:'Lossless cell cropping; chroma removal shared with Ryuu; padding and ground anchors; no artistic repainting.',art_review:'Eight idle drawings inspected; local details can differ between views. Hero material masks are conservative preliminary selections.'});
 e.status='ready';e.directions=8;e.manifest=`assets/catalog/${id}/directions.json`;e.thumbnail=`assets/catalog/${id}/se.png`;e.atlas=`assets/catalog/${id}/atlas.png`;e.palette_status=e.category==='heroes'?'preliminary-semantic-zones':'material-hues';
 json(path.join(dir,'catalog.json'),cat);console.log(id,views.length,'views',channels.length,'channels');
}catch(error){failures.push({id,error:error.message});console.error(error.message);}}
json(path.join(dir,'catalog.json'),cat);

json(path.join(dir,'build-errors.json'),failures);if(failures.length)process.exitCode=1;
