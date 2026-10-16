import {paint} from './sprite.js';
import {SIZE,loadView,readJSON,cache} from './directions.js';
const $=s=>document.querySelector(s),KEY='project-tactics.ryuu-isometric.8.1',OLD_KEY='project-tactics.ryuu-isometric.se.1';
const canvas=$('#scene'),ctx=canvas.getContext('2d'),sprite=document.createElement('canvas');sprite.width=sprite.height=SIZE;
let catalogue,entity,asset,recipe,colors,original,views,current='se',mode='grid',height=520,debug=false,bg='light',ready=false,request=0,allAssets;
const status=s=>$('#status').textContent=s;
function rhombus(cx,cy,w,h,fill,stroke){ctx.beginPath();ctx.moveTo(cx,cy-h/2);ctx.lineTo(cx+w/2,cy);ctx.lineTo(cx,cy+h/2);ctx.lineTo(cx-w/2,cy);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.stroke();}
function ground(cx,cy,dark){for(let sum=-4;sum<=4;sum++)for(let x=-2;x<=2;x++){let y=sum-x;if(y< -2||y>2)continue;const px=cx+(x-y)*68,py=cy+(x+y)*34,active=x===0&&y===0;rhombus(px,py+5,132,66,dark?'#262f2d':'#cfc6ac',dark?'#29352e':'#cfc6ac');rhombus(px,py,132,66,active?(dark?'#677959':'#d7dfbd'):(dark?((x+y)%2?'#3c493e':'#414f41'):((x+y)%2?'#e4dfca':'#eee7d5')),active?'#9ba176':dark?'#576450':'#d3c9b0');}}
function surface(a,overlay=false,palette=colors){const c=document.createElement('canvas');c.width=a.width;c.height=a.height;c.getContext('2d').putImageData(new ImageData(paint(a,palette,overlay),a.width,a.height),0,0);return c;}
function place(context,image,a,cx,cy,h){const s=h/a.view.displayHeight;context.drawImage(image,cx-a.recipe.anchor[0]*s,cy-a.recipe.anchor[1]*s,a.width*s,a.height*s);}
function draw(){
 if(!ready)return;const dark=bg==='dark';ctx.clearRect(0,0,1000,800);ctx.fillStyle=dark?'#29332e':'#f6f0e3';ctx.fillRect(0,0,1000,800);
 if(mode==='all'&&allAssets){allAssets.forEach((a,i)=>{const cx=125+(i%4)*250,cy=340+Math.floor(i/4)*390;place(ctx,surface(a,debug),a,cx,cy,310);ctx.fillStyle=dark?'#d8decb':'#807357';ctx.font='16px system-ui';ctx.textAlign='center';ctx.fillText(a.view.label,cx,cy+45);});return;}
 const cx=mode==='compare'?720:500,cy=mode==='grid'?635:710;if(mode==='grid')ground(cx,cy,dark);
 ctx.save();ctx.translate(cx,cy+8);ctx.scale(1,.35);const shadow=ctx.createRadialGradient(0,0,0,0,0,height*.17);shadow.addColorStop(0,dark?'#00000060':'#65594045');shadow.addColorStop(1,'#65594000');ctx.fillStyle=shadow;ctx.beginPath();ctx.arc(0,0,height*.17,0,Math.PI*2);ctx.fill();ctx.restore();
 if(mode==='compare'&&original){const oh=Math.min(570,420*original.height/original.width),ow=original.width/original.height*oh;ctx.drawImage(original,270-ow/2,cy-oh,ow,oh);ctx.fillStyle=dark?'#d8decb':'#807357';ctx.font='16px system-ui';ctx.textAlign='center';ctx.fillText(entity.category==='heroes'?'FICHE ORIGINALE':entity.reference_image?'RÉFÉRENCE CHOISIE':'PALETTE D’ORIGINE',270,760);ctx.fillText(asset.view.label.toUpperCase(),720,760);}
 place(ctx,sprite,asset,cx,cy,mode==='compare'?Math.min(570,420*asset.view.displayHeight/asset.width):height);
 if(mode==='grid'){ctx.fillStyle=dark?'#b5bca6':'#969179';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText(entity.name.toUpperCase()+' · '+asset.view.label.toUpperCase(),500,775);}
}
function repaint(){if(!asset)return;sprite.width=asset.width;sprite.height=asset.height;sprite.getContext('2d').putImageData(new ImageData(paint(asset,colors,debug),asset.width,asset.height),0,0);if(entity.category!=='heroes'&&!entity.reference_image){original=document.createElement('canvas');original.width=asset.width;original.height=asset.height;original.getContext('2d').putImageData(new ImageData(asset.source,asset.width,asset.height),0,0);}draw();}
function sync(){for(const ch of recipe.channels){$('#color-'+ch.id).value=colors[ch.id];$('#hex-'+ch.id).value=colors[ch.id];}repaint();}
function busy(message){document.querySelectorAll('aside button,aside input,.scene button,[data-mode]').forEach(el=>el.disabled=!!message);$('#loading').hidden=!message;if(message)$('#loading').textContent=message;$('#export').disabled=!!message;$('#exportAll').disabled=!!message;document.body.dataset.busy=String(!!message);}
function selected(){document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));document.querySelectorAll('[data-direction]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.direction===current)));$('#viewName').textContent=asset.view.label+' · pose de repos';}
async function chooseDirection(id){
 const ticket=++request;busy('Préparation : '+views.find(v=>v.id===id).label+'…');
 try{const next=await loadView(views.find(v=>v.id===id));if(ticket!==request)return;asset=next;recipe=next.recipe;current=id;if(mode==='all')mode='grid';selected();sync();status('Vue '+asset.view.label.toLowerCase()+' · votre palette est conservée.');}
 catch(e){if(ticket===request)status('Vue indisponible : '+e.message);}finally{if(ticket===request)busy('');}
}
async function setMode(value){
 if(!ready)return;
 const ticket=++request;mode=value;selected();busy('');
 if(mode==='detail'){height=580;$('#scale').value=580;}
 $('#gameSize').setAttribute('aria-pressed',String(height===160));
 if(mode==='all'&&!allAssets){busy('Préparation des huit directions…');try{const loaded=await Promise.all(views.map(loadView));if(ticket!==request)return;allAssets=loaded;}catch(e){if(ticket!==request)return;mode='grid';selected();status(e.message);}finally{if(ticket===request)busy('');}}
 if(ticket===request)draw();
}
function download(c,name){return new Promise(resolve=>c.toBlob(blob=>{if(!blob){status('Export impossible.');resolve();return;}const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);resolve();},'image/png'));}
function changeColor(id,value){colors[id]=value.toUpperCase();$('#color-'+id).value=colors[id];$('#hex-'+id).value=colors[id];repaint();}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
$('#background').addEventListener('change',e=>{bg=e.target.value;draw();});
$('#scale').addEventListener('input',e=>{height=Number(e.target.value);$('#gameSize').setAttribute('aria-pressed',String(height===160));draw();});
$('#gameSize').addEventListener('click',()=>{height=height===160?520:160;$('#scale').value=height;setMode('grid');});
$('#masks').addEventListener('change',e=>{debug=e.target.checked;repaint();});
$('#reset').addEventListener('click',()=>{colors={...asset.defaults};sync();status('Palette d’origine restaurée pour les huit vues.');});
const schemes={'Sauge et ivoire':['#F7B372','#EFF1D2','#38564B','#547858','#3C4943'],'Nuit et jade':['#C88B63','#E9D9B5','#354F60','#547B80','#263A4C'],'Prune et cuivre':['#A06549','#C9A5CD','#593C64','#923F54','#382E47']};
function palette(list){const order=['skin','hair','clothing1','clothing2','clothing3'];recipe.channels.forEach((ch,i)=>colors[ch.id]=list[entity.category==='heroes'?order.indexOf(ch.id):i]);sync();}
$('#random').addEventListener('click',()=>{palette(Object.values(schemes)[Math.floor(Math.random()*3)]);status('Palette appliquée aux huit directions.');});
$('#save').addEventListener('click',()=>{try{localStorage.setItem(entity.id==='ryuu-masculine'?KEY:'project-tactics.iso.'+entity.id,JSON.stringify({version:2,character:entity.id,direction:current,colors}));status('Palette et orientation enregistrées dans ce navigateur.');}catch{status('Enregistrement local indisponible.');}});
$('#export').addEventListener('click',async()=>{await download(surface(asset),`${entity.id}-isometrique-${current}.png`);status('Vue '+asset.view.label.toLowerCase()+' exportée avec votre palette.');});
$('#exportAll').addEventListener('click',async()=>{
 const ticket=request,exportId=entity.id,exportPalette={...colors},exportViews=[...views];
 busy('Préparation de la planche PNG…');
 try{const loaded=await Promise.all(exportViews.map(loadView)),c=document.createElement('canvas');c.width=3072;c.height=2560;const context=c.getContext('2d');loaded.forEach((a,i)=>place(context,surface(a,false,exportPalette),a,384+(i%4)*768,1160+Math.floor(i/4)*1280,1100));await download(c,exportId+'-isometrique-8-directions.png');if(ticket===request)status('Planche transparente exportée : Dos, Dos droite, Droite, Face droite, Face, Face gauche, Gauche, Dos gauche.');}catch(e){if(ticket===request)status(e.message);}finally{if(ticket===request)busy('');}
});

function buildColors(){
 $('#colors').replaceChildren();
 for(const ch of recipe.channels){const row=document.createElement('div');row.className='color';
 const label=document.createElement('label');label.htmlFor='color-'+ch.id;label.textContent=entity.id==='ryuu-masculine'?({'clothing1':'Jambe droite','clothing2':'Jambe gauche'}[ch.id]||ch.label):ch.label;
 const picker=document.createElement('input');picker.type='color';picker.id='color-'+ch.id;picker.value=colors[ch.id];
 const hex=document.createElement('input');hex.type='text';hex.id='hex-'+ch.id;hex.value=colors[ch.id];hex.maxLength=7;hex.spellcheck=false;hex.setAttribute('aria-label',ch.label+' en hexadécimal');
 picker.addEventListener('input',e=>{changeColor(ch.id,e.target.value);status('Couleur appliquée aux huit orientations.');});
 hex.addEventListener('input',e=>{if(/^#[\da-f]{6}$/i.test(e.target.value)){e.target.setCustomValidity('');changeColor(ch.id,e.target.value);}else e.target.setCustomValidity('Utiliser # suivi de six caractères hexadécimaux.');});
 row.append(label,picker,hex);$('#colors').append(row);
 }
}
const crops={ryuu:{masculine:[12,177,252,696],feminine:[261,181,466,696]},kael:{masculine:[19,178,267,724],feminine:[251,190,498,724]},sela:{masculine:[15,174,239,710],feminine:[239,183,465,710]},leo:{masculine:[15,185,285,725],feminine:[258,207,486,725]},lina:{masculine:[15,180,265,723],feminine:[248,214,485,723]}};
async function chooseEntity(id){
 const nextEntity=catalogue.entries.find(e=>e.id===id);if(!nextEntity||nextEntity.status!=='ready')return;
 const ticket=++request;busy('Préparation : '+nextEntity.name+'…');
 try{
  const manifest=nextEntity.id==='ryuu-masculine'?'assets/directions.json':nextEntity.manifest;
  const nextViews=(await readJSON(manifest)).views;
  const next=await loadView(nextViews.find(v=>v.id==='se'));let nextOriginal;
  if(nextEntity.category==='heroes'){
   const bmp=await createImageBitmap(await(await fetch('../../../'+nextEntity.source)).blob());const c=crops[nextEntity.name.toLowerCase()][nextEntity.base],x=Math.round(c[0]/1100*bmp.width),y=Math.round(c[1]/1400*bmp.height),w=Math.round((c[2]-c[0])/1100*bmp.width),h=Math.round((c[3]-c[1])/1400*bmp.height);
   nextOriginal=await createImageBitmap(bmp,x,y,w,h);bmp.close();
  }
  if(nextEntity.reference_image){
   const bmp=await createImageBitmap(await(await fetch('../../../'+nextEntity.reference_image)).blob()),box=nextEntity.reference_crop;
   if(box){nextOriginal=await createImageBitmap(bmp,box[0],box[1],box[2]-box[0],box[3]-box[1]);bmp.close();}else nextOriginal=bmp;
  }
  if(ticket!==request){nextOriginal?.close();return;}
  original?.close?.();cache.clear();entity=nextEntity;asset=next;views=nextViews;recipe=next.recipe;colors={...next.defaults};current='se';allAssets=null;original=nextOriginal;mode='grid';
  let saved;try{saved=JSON.parse(localStorage.getItem(entity.id==='ryuu-masculine'?KEY:'project-tactics.iso.'+entity.id)||(entity.id==='ryuu-masculine'?localStorage.getItem(OLD_KEY):null)||'null');if(saved&&recipe.channels.every(c=>/^#[\da-f]{6}$/i.test(saved.colors?.[c.id])))colors=Object.fromEntries(recipe.channels.map(c=>[c.id,saved.colors[c.id]]));}catch{}
  $('#entityName').textContent=entity.name;$('#entityBase').textContent=entity.base?entity.base==='feminine'?'Féminin':'Masculin':entity.rank?'Rang I':entity.family;
  $('#entitySelect').value=entity.id;$('#scene').setAttribute('aria-label',entity.name+' — illustration isométrique personnalisable');
  $('#artNote').textContent=entity.reconstruction+(entity.palette_status==='preliminary-semantic-zones'?' Masques de couleurs provisoires : contrôle visuel à affiner.':'');
  $('#paletteNote').textContent=entity.id==='ryuu-masculine'?'Cuirs, ornements, bandeau et rubans conservent leurs couleurs.':entity.category==='heroes'?'Cinq zones de base. Les masques de cette nouvelle adaptation restent à affiner.':'Les teintes du dessin sont regroupées par famille de couleurs ; les contours sombres sont préservés.';
  document.title=entity.name+' · Atelier isométrique';buildColors();ready=true;selected();sync();renderGallery();document.body.dataset.ready='true';
  status(entity.name+' · huit orientations disponibles.');if(saved&&views.some(v=>v.id===saved.direction)&&saved.direction!=='se')await chooseDirection(saved.direction);
 }catch(e){status('Chargement impossible : '+e.message);if(!ready)document.body.dataset.ready='error';}
 finally{if(ticket===request)busy('');}
}
function renderGallery(){
 const needle=$('#search').value.toLocaleLowerCase('fr'),category=$('#category').value;$('#gallery').replaceChildren();
 const filtered=catalogue.entries.filter(e=>(category==='all'||category===e.category)&&(!needle||(e.name+' '+e.family+' '+(e.base||'')).toLocaleLowerCase('fr').includes(needle)));
 for(const e of filtered){const b=document.createElement('button');b.className='catalog-card';b.disabled=e.status!=='ready';b.setAttribute('aria-pressed',String(e.id===entity?.id));b.setAttribute('aria-label',e.name+(e.base?' · '+(e.base==='feminine'?'Féminin':'Masculin'):''));
 if(e.status==='ready'){const img=document.createElement('img');img.src=e.thumbnail||'assets/ryuu-male-se.png';img.alt='';img.loading='lazy';b.append(img);}else{const placeholder=document.createElement('span');placeholder.className='pending-art';placeholder.textContent='À produire';b.append(placeholder);}
 const name=document.createElement('strong');name.textContent=e.name;const meta=document.createElement('small');meta.textContent=(e.base?(e.base==='feminine'?'Féminin':'Masculin'):e.family)+' · '+e.directions+'/8';b.append(name,meta);b.addEventListener('click',()=>chooseEntity(e.id));$('#gallery').append(b);
 }
 const done=catalogue.entries.filter(e=>e.status==='ready').length;$('#catalogCount').textContent=done+' / '+catalogue.entries.length+' formes · '+(done*8)+' vues réalisées';
}
$('#entitySelect').addEventListener('change',e=>chooseEntity(e.target.value));$('#search').addEventListener('input',renderGallery);$('#category').addEventListener('change',renderGallery);
try{
 catalogue=await readJSON('assets/catalog/catalog.json');
 for(const e of catalogue.entries){const o=document.createElement('option');o.value=e.id;o.textContent=e.name+(e.base?' · '+(e.base==='feminine'?'Féminin':'Masculin'):'')+(e.status!=='ready'?' — à produire':'');o.disabled=e.status!=='ready';$('#entitySelect').append(o);}
 for(const [name,list]of Object.entries(schemes)){const b=document.createElement('button');b.setAttribute('aria-label',name);b.title=name;list.forEach(c=>{const s=document.createElement('i');s.style.background=c;b.append(s);});b.addEventListener('click',()=>{if(!ready)return;palette(list);status(name+' appliqué aux directions.');});$('#presets').append(b);}
 const positions={nw:1,n:2,ne:3,w:4,e:6,sw:7,s:8,se:9},arrows={nw:'↖',n:'↑',ne:'↗',w:'←',e:'→',sw:'↙',s:'↓',se:'↘'},labels={n:'Dos',ne:'Dos droite',e:'Droite',se:'Face droite',s:'Face',sw:'Face gauche',w:'Gauche',nw:'Dos gauche'};
 for(const id of catalogue.directions){const b=document.createElement('button');b.dataset.direction=id;b.style.gridArea=`${Math.ceil(positions[id]/3)} / ${(positions[id]-1)%3+1}`;b.innerHTML='<span aria-hidden="true">'+arrows[id]+'</span>'+labels[id];b.setAttribute('aria-label','Orientation : '+labels[id]);b.addEventListener('click',()=>{if(ready)chooseDirection(id);});$('#directions').append(b);}
 $('#directions').addEventListener('keydown',e=>{if(!ready||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const next=views[(views.findIndex(v=>v.id===current)+(e.key==='ArrowRight'?1:7))%8];chooseDirection(next.id);$('[data-direction="'+next.id+'"]').focus();});
 const selectedId=new URLSearchParams(location.search).get('entity');await chooseEntity(catalogue.entries.some(e=>e.id===selectedId&&e.status==='ready')?selectedId:'ryuu-masculine');
}catch(e){$('#loading').textContent='Atelier indisponible : '+e.message;status(e.message);document.body.dataset.ready='error';}
export function inspect(){return{...asset,pixels:paint(asset,colors,false),colors:{...colors},current,views,mode,entity,catalogue};}
export {chooseDirection,setMode,chooseEntity};
