import {RECIPES} from '../interactive/catalog.js';
import {validateRecipe} from '../pipeline/recipe.js';
import {createRecipeMasks,recipeColors} from '../pipeline/mask-engine.js';
import {recolor,maskPreview} from '../interactive/render.js';
import {History} from '../interactive/history.js';
const $=id=>document.getElementById(id),history=new History(),ROOT='../../../';
const DRAFT_STORAGE='project-tactics.asset-preparation.draft.v1';
let lastDraft=null;
try{const saved=localStorage.getItem(DRAFT_STORAGE);if(saved){lastDraft=validateRecipe(JSON.parse(saved));$('restoreDraft').disabled=false;}}catch{}
let busy=false,waitingRecipe=null,recipe=null,source=null,raw=null,masks=null,channelId='',pending=[],requestId=0,exportPixels=null;
const channel=()=>recipe?.channels.find(c=>c.id===channelId);
function message(text,error=false){$('message').textContent=text;$('message').classList.toggle('error',error);}
async function sha(bytes){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),15000);}
function canvasFrom(width,height,data){const c=document.createElement('canvas');c.width=width;c.height=height;if(data)c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(data),width,height),0,0);return c;}
function refreshPixels(){const [x,y,w,h]=recipe.crop,c=canvasFrom(w,h);c.getContext('2d').drawImage(source,x,y,w,h,0,0,w,h);raw=c.getContext('2d').getImageData(0,0,w,h).data;masks=createRecipeMasks(raw,recipe);}
function stroke(ctx,polygon,color,dash=[],close=true){if(!polygon.length)return;ctx.strokeStyle=color;ctx.lineWidth=1;ctx.setLineDash(dash);ctx.beginPath();polygon.forEach(([x,y],i)=>i?ctx.lineTo(x-recipe.crop[0],y-recipe.crop[1]):ctx.moveTo(x-recipe.crop[0],y-recipe.crop[1]));if(close)ctx.closePath();ctx.stroke();ctx.setLineDash([]);}
function marker(ctx,[x,y],color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x-recipe.crop[0],y-recipe.crop[1],2,0,Math.PI*2);ctx.fill();}
function draw(){
  if(!recipe||!raw)return;const [,,w,h]=recipe.crop,colors={...recipeColors(recipe),[channelId]:$('testColor').value};
  exportPixels=recolor(raw,masks,recipeColors(recipe),colors);
  const bytes=$('view').value==='original'?raw:$('view').value==='custom'?exportPixels:maskPreview(raw,masks),c=$('canvas');c.width=w;c.height=h;c.style.width=w*2+'px';const ctx=c.getContext('2d');ctx.putImageData(new ImageData(new Uint8ClampedArray(bytes),w,h),0,0);
  if($('outlines').checked){for(const p of channel().selection.include)stroke(ctx,p,'#31a96b');for(const p of channel().selection.exclude)stroke(ctx,p,'#db5353',[3,2]);for(const p of recipe.protected)stroke(ctx,p,'#b91923');for(const p of channel().selection.seeds||[])marker(ctx,p,'#27b36a');for(const p of recipe.equipment_samples)marker(ctx,p,'#f1ac35');marker(ctx,recipe.anchor,'#1f64b4');}
  stroke(ctx,pending,'#f2a827',[],false);pending.forEach(p=>marker(ctx,p,'#f2a827'));
  $('finish').disabled=pending.length<3;$('cancel').disabled=!pending.length;
  $('caption').textContent=`${recipe.name} · ${w} × ${h} px · ${recipe.status==='draft'?'brouillon':'pilote de référence'} · ${pending.length} point(s) en cours`;
}
function diagnostics(){
  const list=$('checks');list.replaceChildren();let invalid=false;
  for(const c of recipe.channels){const n=masks[c.id].reduce((sum,v)=>sum+(v>0),0),li=document.createElement('li');li.textContent=c.label+' : '+n+' pixels';if(!n)li.className='bad';list.append(li);}
  for(const [x,y]of recipe.equipment_samples){const i=(y-recipe.crop[1])*recipe.crop[2]+x-recipe.crop[0];if(Object.values(masks).some(m=>m[i])){invalid=true;const li=document.createElement('li');li.className='bad';li.textContent=`Équipement touché en ${x}, ${y}`;list.append(li);}}
  const li=document.createElement('li');li.textContent=invalid?'Corriger les protections avant publication.':'Points témoins d’équipement préservés ('+recipe.equipment_samples.length+').';list.append(li);
  const info=document.createElement('li');info.textContent='Empreinte de la source vérifiée. Aucune validation esthétique automatique.';list.append(info);
}
function refresh(){
  if(!recipe)return;
  for(const id of ['name','kind','sourcePath','cropX','cropY','cropW','cropH','applyCrop','channel','tool','addChannel','removeChannel','removeLast','addPoint','polygonOnly','exportRecipe','exportPng'])$(id).disabled=false;
  $('empty').hidden=true;$('identity').textContent=recipe.id+' · '+recipe.source.size.join(' × ')+' px';$('name').value=recipe.name;$('kind').value=recipe.kind;$('sourcePath').value=recipe.source.path;
  ['cropX','cropY','cropW','cropH'].forEach((id,i)=>$(id).value=recipe.crop[i]);
  if(!recipe.channels.some(c=>c.id===channelId))channelId=recipe.channels[0].id;
  $('channel').replaceChildren(...recipe.channels.map(c=>{const o=document.createElement('option');o.value=c.id;o.textContent=c.label;return o;}));$('channel').value=channelId;
  $('regionLabel').textContent=channel().region_label;const rank=recipe.priority.indexOf(channelId);$('priorityUp').disabled=rank===0;$('priorityDown').disabled=rank===recipe.priority.length-1;$('materialInfo').textContent=channel().selection.mode==='seeded'?'Sélection par composantes et filtre local.':'Sélection dans les contours uniquement.';
  const s=history.status('recipe');$('undo').disabled=!s.undo;$('redo').disabled=!s.redo;$('removeChannel').disabled=recipe.channels.length===1;$('addChannel').disabled=recipe.channels.length>=8;
  refreshPixels();diagnostics();draw();
}
function saveDraft(){try{localStorage.setItem(DRAFT_STORAGE,JSON.stringify(recipe));lastDraft=structuredClone(recipe);$('restoreDraft').disabled=false;message('Brouillon enregistré dans ce navigateur. Exportez la fiche pour la transmettre.');}catch{message('Sauvegarde locale indisponible : exportez la fiche pour conserver vos tracés.',true);}}
function edit(fn){if(!recipe||busy)return;const next=structuredClone(recipe);try{fn(next);next.status='draft';next.review={note:'Préparation locale modifiée ; comparer aux sources avant validation.',approved_by:null,approved_at:null};validateRecipe(next);history.remember('recipe',recipe,next);recipe=next;refresh();saveDraft();}catch(e){message(e.message,true);}}
async function loadRecipe(value,bytes){
  const token=++requestId;busy=true;message('Vérification de la source…');try{
    const checked=validateRecipe(value);waitingRecipe=checked;
    if(!bytes){const response=await fetch(ROOT+checked.source.path);if(!response.ok)throw Error('PNG introuvable. Ouvrez le fichier source correspondant.');bytes=await response.arrayBuffer();}
    if(await sha(bytes)!==checked.source.sha256)throw Error('Le PNG ne correspond pas à l’empreinte de cette fiche.');
    const image=await createImageBitmap(new Blob([bytes],{type:'image/png'}));if(image.width!==checked.source.size[0]||image.height!==checked.source.size[1]){image.close();throw Error('Dimensions de source incorrectes.');}
    if(token!==requestId){image.close();return;}busy=false;source?.close();source=image;waitingRecipe=null;recipe=checked;channelId=recipe.channels[0].id;pending=[];history.clear('recipe');refresh();message('Source vérifiée. Les modifications restent locales jusqu’à l’export de la fiche.');
  }catch(e){if(token===requestId){busy=false;message(e.message,true);}}
}
function addPoint(point){
  if(!recipe||busy)return;const [x,y]=point,[ox,oy,w,h]=recipe.crop,tool=$('tool').value,boundary=['include','exclude','protect'].includes(tool);
  if(!Number.isInteger(x)||!Number.isInteger(y)||x<ox||y<oy||(boundary?x>ox+w||y>oy+h:x>=ox+w||y>=oy+h)){message('Choisissez un point entier dans le cadrage.',true);return;}
  if(['include','exclude','protect'].includes(tool)){pending.push(point);draw();return;}
  if(tool==='seed'&&channel().selection.mode!=='seeded'){message('Cette zone utilise des contours. Les points de départ sont réservés aux zones possédant déjà un filtre de matériau.',true);return;}
  edit(r=>{const c=r.channels.find(c=>c.id===channelId);if(tool==='seed')c.selection.seeds.push(point);if(tool==='sample')r.equipment_samples.push(point);if(tool==='anchor')r.anchor=point;if(tool==='color'){const p=((y-oy)*w+x-ox)*4;c.color='#'+[...raw.slice(p,p+3)].map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase();}});
}
function finish(){if(pending.length<3)return;const points=structuredClone(pending),tool=$('tool').value;edit(r=>{const c=r.channels.find(c=>c.id===channelId);if(tool==='protect')r.protected.push(points);else c.selection[tool].push(points);});pending=[];draw();}
for(const r of RECIPES){const o=document.createElement('option');o.value=r.id;o.textContent=r.name+' · '+(r.kind==='monster'?'monstre':'personnage');$('catalog').append(o);}
$('restoreDraft').addEventListener('click',()=>{if(lastDraft)loadRecipe(lastDraft);});
$('catalog').addEventListener('change',()=>{const r=RECIPES.find(r=>r.id===$('catalog').value);if(r)loadRecipe(r);});
$('openRecipe').addEventListener('click',()=>$('recipeFile').click());$('openSource').addEventListener('click',()=>$('sourceFile').click());
$('recipeFile').addEventListener('change',async e=>{const f=e.target.files[0];try{if(f){if(f.size>2_000_000)throw Error('Fiche trop volumineuse.');await loadRecipe(JSON.parse(await f.text()));}}catch(error){message(error.message,true);}e.target.value='';});
$('sourceFile').addEventListener('change',async e=>{const f=e.target.files[0];try{if(!f)return;if(f.size>40_000_000)throw Error('PNG trop volumineux.');const bytes=await f.arrayBuffer(),hash=await sha(bytes);
  const match=[waitingRecipe,recipe].find(r=>r?.source.sha256===hash);if(match){await loadRecipe(match,bytes);return;}
  const image=await createImageBitmap(f),w=image.width,h=image.height;image.close();const slug=f.name.replace(/\.png$/i,'').toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/^-+|-+$/g,'').slice(0,35)||'creature',id=/^[a-z]/.test(slug)?slug:'creature-'+slug;
  await loadRecipe({schema:'project-tactics/asset-recipe',version:1,id:id+'-default',entity_id:id,kind:'monster',name:f.name.replace(/\.png$/i,''),base_id:'default',view_id:'main',revision:'visible-1',status:'draft',review:{note:'Nouvelle source ; zones à préparer et validation esthétique à obtenir.',approved_by:null,approved_at:null},source:{path:'content/art/incoming/'+id+'.png',sha256:hash,size:[w,h]},crop:[0,0,w,h],anchor:[Math.floor(w/2),h-1],channels:[{id:'body',label:'Corps',region_label:'Surface principale à délimiter',color:'#808080',selection:{mode:'polygon',include:[],exclude:[]},material:{}}],priority:['body'],protected:[],equipment_samples:[],reconstruction:{applied:false,notes:'Aucune reconstruction ; surfaces visibles uniquement.'}},bytes);
}catch(error){message(error.message,true);}finally{e.target.value='';}});
$('name').addEventListener('change',()=>edit(r=>r.name=$('name').value));$('kind').addEventListener('change',()=>edit(r=>r.kind=$('kind').value));$('sourcePath').addEventListener('change',()=>edit(r=>r.source.path=$('sourcePath').value));
$('applyCrop').addEventListener('click',()=>edit(r=>{r.crop=['cropX','cropY','cropW','cropH'].map(id=>Number($(id).value));const [x,y,w,h]=r.crop;if(r.anchor[0]<x||r.anchor[0]>=x+w||r.anchor[1]<y||r.anchor[1]>=y+h)r.anchor=[x+Math.floor(w/2),y+h-1];}));
$('channel').addEventListener('change',()=>{channelId=$('channel').value;pending=[];refresh();});$('tool').addEventListener('change',()=>{pending=[];$('toolHelp').textContent=['include','exclude','protect'].includes($('tool').value)?'Placez les sommets, puis fermez le contour (Entrée). Échap annule le tracé.':'Cliquez un pixel ou entrez ses coordonnées. Un point témoin doit rester inchangé sous toutes les couleurs.';draw();});
$('canvas').addEventListener('click',e=>{if(!recipe)return;const rect=$('canvas').getBoundingClientRect();addPoint([Math.floor((e.clientX-rect.left)/rect.width*recipe.crop[2])+recipe.crop[0],Math.floor((e.clientY-rect.top)/rect.height*recipe.crop[3])+recipe.crop[1]]);});
$('addPoint').addEventListener('click',()=>addPoint([Number($('pointX').value),Number($('pointY').value)]));$('finish').addEventListener('click',finish);$('cancel').addEventListener('click',()=>{pending=[];draw();});
$('removeLast').addEventListener('click',()=>{if(pending.length){pending.pop();draw();return;}edit(r=>{const t=$('tool').value,c=r.channels.find(c=>c.id===channelId);if(t==='protect')r.protected.pop();else if(t==='sample')r.equipment_samples.pop();else if(t==='seed')c.selection.seeds?.pop();else if(['include','exclude'].includes(t))c.selection[t].pop();});});
for(const [id,step]of [['priorityUp',-1],['priorityDown',1]])$(id).addEventListener('click',()=>edit(r=>{const i=r.priority.indexOf(channelId),j=i+step;if(j>=0&&j<r.priority.length)[r.priority[i],r.priority[j]]=[r.priority[j],r.priority[i]];}));
$('polygonOnly').addEventListener('click',()=>edit(r=>{const c=r.channels.find(c=>c.id===channelId);c.selection={mode:'polygon',include:c.selection.include,exclude:c.selection.exclude};c.material={};}));
for(const id of ['view','testColor','outlines'])$(id).addEventListener('input',draw);
for(const action of ['undo','redo'])$(action).addEventListener('click',()=>{const r=history[action]('recipe',recipe);if(r){recipe=r;pending=[];refresh();saveDraft();}});
$('addChannel').addEventListener('click',()=>$('newChannel').showModal());$('cancelChannel').addEventListener('click',()=>$('newChannel').close());
$('channelForm').addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.target),id=form.get('id'),before=recipe;edit(r=>{if(r.channels.length>=8)throw Error('Huit zones maximum.');r.channels.push({id,label:form.get('label'),region_label:form.get('label'),color:form.get('color').toUpperCase(),selection:{mode:'polygon',include:[],exclude:[]},material:{}});r.priority.push(id);});if(recipe!==before){channelId=id;refresh();$('newChannel').close();e.target.reset();}});
$('removeChannel').addEventListener('click',()=>{if(recipe.channels.length>1)edit(r=>{r.channels=r.channels.filter(c=>c.id!==channelId);r.priority=r.priority.filter(id=>id!==channelId);});});
$('exportRecipe').addEventListener('click',()=>{try{const r=validateRecipe(recipe);r.status='draft';r.review={note:'Export de préparation ; comparer les preuves avant de promouvoir en pilote.',approved_by:null,approved_at:null};if(!r.revision.endsWith('-draft'))r.revision+='-draft';download(new Blob([JSON.stringify(r,null,2)+'\n'],{type:'application/json'}),r.id+'.json');message('Fiche exportée comme brouillon. Conservez le PNG original au chemin indiqué, puis lancez la vérification du catalogue.');}catch(e){message(e.message,true);}});
$('exportPng').addEventListener('click',()=>{const c=canvasFrom(recipe.crop[2],recipe.crop[3],exportPixels);c.toBlob(blob=>{if(blob)download(blob,recipe.id+'-temoin.png');},'image/png');});
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)||$('newChannel').open)return;if(e.key==='Escape'){pending=[];draw();}if(e.key==='Enter'&&e.target===$('canvas')){e.preventDefault();finish();}});
