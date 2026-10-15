import {prepare,paint,opaqueBounds} from './sprite.js';
const $=s=>document.querySelector(s),KEY='project-tactics.ryuu-isometric.se.1';
const canvas=$('#scene'),ctx=canvas.getContext('2d'),sprite=document.createElement('canvas');
let asset,recipe,colors,sourceImage,original,mode='grid',height=520,debug=false,bg='light',ready=false;
const status=s=>$('#status').textContent=s;
function rhombus(cx,cy,w,h,fill,stroke){ctx.beginPath();ctx.moveTo(cx,cy-h/2);ctx.lineTo(cx+w/2,cy);ctx.lineTo(cx,cy+h/2);ctx.lineTo(cx-w/2,cy);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.stroke();}
function ground(cx,cy,dark){
 for(let sum=-4;sum<=4;sum++)for(let x=-2;x<=2;x++){let y=sum-x;if(y< -2||y>2)continue;const px=cx+(x-y)*68,py=cy+(x+y)*34;const active=x===0&&y===0;rhombus(px,py+5,132,66,dark?'#262f2d':'#cfc6ac',dark?'#29352e':'#cfc6ac');rhombus(px,py,132,66,active?(dark?'#677959':'#d7dfbd'):(dark?((x+y)%2?'#3c493e':'#414f41'):((x+y)%2?'#e4dfca':'#eee7d5')),active?'#9ba176':dark?'#576450':'#d3c9b0');}
}
function draw(){
 if(!ready)return;
 const dark=bg==='dark';ctx.clearRect(0,0,1000,800);ctx.fillStyle=dark?'#29332e':'#f6f0e3';ctx.fillRect(0,0,1000,800);
 const cx=mode==='compare'?720:500,cy=mode==='grid'?635:710;
 if(mode==='grid')ground(cx,cy,dark);
 ctx.save();ctx.translate(cx,cy+8);ctx.scale(1,.35);const shadow=ctx.createRadialGradient(0,0,0,0,0,height*.17);shadow.addColorStop(0,dark?'#00000060':'#65594045');shadow.addColorStop(1,'#65594000');ctx.fillStyle=shadow;ctx.beginPath();ctx.arc(0,0,height*.17,0,Math.PI*2);ctx.fill();ctx.restore();
 const h=mode==='compare'?570:height,s=h/1254;
 if(mode==='compare'&&original){const oh=570,ow=original.width/original.height*oh;ctx.drawImage(original,270-ow/2,cy-oh,ow,oh);ctx.fillStyle=dark?'#d8decb':'#807357';ctx.font='16px system-ui';ctx.textAlign='center';ctx.fillText('FICHE ORIGINALE',270,760);ctx.fillText('SPRITE ISOMÉTRIQUE',720,760);}
 ctx.drawImage(sprite,cx-recipe.anchor[0]*s,cy-recipe.anchor[1]*s,1254*s,1254*s);
 if(mode==='grid'){ctx.fillStyle=dark?'#b5bca6':'#969179';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('RYUU · SUD-EST',500,775);}
}
function repaint(){
 if(!asset)return;const pixels=paint(asset,colors,debug);sprite.getContext('2d').putImageData(new ImageData(pixels,1254,1254),0,0);draw();
}
function sync(){for(const ch of recipe.channels){$('#color-'+ch.id).value=colors[ch.id];$('#hex-'+ch.id).value=colors[ch.id];}repaint();}
function setMode(value){mode=value;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));if(mode==='detail'){height=580;$('#scale').value=580;}$('#gameSize').setAttribute('aria-pressed',String(height===160));draw();}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
$('#background').addEventListener('change',e=>{bg=e.target.value;draw();});
$('#scale').addEventListener('input',e=>{height=Number(e.target.value);$('#gameSize').setAttribute('aria-pressed',String(height===160));draw();});
$('#gameSize').addEventListener('click',()=>{height=height===160?520:160;$('#scale').value=height;setMode('grid');});
$('#masks').addEventListener('change',e=>{debug=e.target.checked;repaint();});
$('#reset').addEventListener('click',()=>{colors={...asset.defaults};sync();status('Palette d’origine restaurée.');});
$('#random').addEventListener('click',()=>{const schemes=[['#C88B63','#E9D9B5','#354F60','#547B80','#263A4C'],['#F7B372','#EFF1D2','#38564B','#547858','#3C4943'],['#A06549','#C9A5CD','#593C64','#923F54','#382E47']];const list=schemes[Math.floor(Math.random()*schemes.length)];recipe.channels.forEach((ch,i)=>colors[ch.id]=list[i]);sync();status('Palette appliquée au sprite.');});
$('#save').addEventListener('click',()=>{try{localStorage.setItem(KEY,JSON.stringify({version:1,recipe:recipe.id,colors}));status('Apparence enregistrée dans ce navigateur.');}catch{status('Enregistrement local indisponible.');}});
$('#export').addEventListener('click',()=>{
 const exportCanvas=document.createElement('canvas');exportCanvas.width=1254;exportCanvas.height=1254;
 exportCanvas.getContext('2d').putImageData(new ImageData(paint(asset,colors,false),1254,1254),0,0);
 exportCanvas.toBlob(blob=>{if(!blob){status('Export impossible.');return;}const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='ryuu-isometrique-sud-est.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);status('PNG transparent exporté avec votre palette.');},'image/png');
});
document.querySelectorAll('button,input,select').forEach(el=>el.disabled=true);
try{
 const response=await fetch('assets/recipe.json');if(!response.ok)throw Error('Recette inaccessible');recipe=await response.json();
 const manifest=await (await fetch('assets/provenance.json')).json();const bytes=await (await fetch('assets/ryuu-male-se-keyed.png')).arrayBuffer();
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');if(hash!==manifest.sprite_sha256)throw Error('Empreinte du sprite différente');
 sourceImage=await createImageBitmap(new Blob([bytes],{type:'image/png'}));if(sourceImage.width!==1254||sourceImage.height!==1254)throw Error('Dimensions du sprite incompatibles');
 sprite.width=1254;sprite.height=1254;sprite.getContext('2d').drawImage(sourceImage,0,0);asset=prepare(sprite.getContext('2d').getImageData(0,0,1254,1254).data,recipe);colors={...asset.defaults};
 original=await createImageBitmap(await (await fetch('../../../content/art/characters/reference-v2/references/ryuu.png')).blob(),12,183,237,537);
 for(const ch of recipe.channels){const row=document.createElement('div');row.className='color';row.innerHTML='<label for="color-'+ch.id+'">'+ch.label+'</label><input id="color-'+ch.id+'" type="color" value="'+ch.color+'"><input id="hex-'+ch.id+'" aria-label="'+ch.label+' en hexadécimal" type="text" value="'+ch.color+'" maxlength="7" spellcheck="false">';$('#colors').append(row);
 row.querySelector('[type=color]').addEventListener('input',e=>{colors[ch.id]=e.target.value.toUpperCase();$('#hex-'+ch.id).value=colors[ch.id];repaint();status('Couleur appliquée au dessin.');});
 row.querySelector('[type=text]').addEventListener('input',e=>{if(/^#[\da-f]{6}$/i.test(e.target.value)){e.target.setCustomValidity('');colors[ch.id]=e.target.value.toUpperCase();$('#color-'+ch.id).value=colors[ch.id];repaint();}else e.target.setCustomValidity('Utiliser # suivi de six caractères hexadécimaux.');});
 }
 for(const [name,list] of Object.entries({'Sauge et ivoire':['#F7B372','#EFF1D2','#38564B','#547858','#3C4943'],'Nuit et jade':['#C88B63','#E9D9B5','#354F60','#547B80','#263A4C'],'Prune et cuivre':['#A06549','#C9A5CD','#593C64','#923F54','#382E47']})){
 const b=document.createElement('button');b.setAttribute('aria-label',name);b.title=name;list.forEach(c=>{const s=document.createElement('i');s.style.background=c;b.append(s);});b.addEventListener('click',()=>{recipe.channels.forEach((ch,i)=>colors[ch.id]=list[i]);sync();status(name+' appliqué.');});$('#presets').append(b);}
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved?.version===1&&saved.recipe===recipe.id&&recipe.channels.every(c=>/^#[\da-f]{6}$/i.test(saved.colors?.[c.id])))colors=Object.fromEntries(recipe.channels.map(c=>[c.id,saved.colors[c.id]]));}catch{}
 ready=true;sync();$('#loading').hidden=true;document.querySelectorAll('button,input,select').forEach(el=>el.disabled=false);document.body.dataset.ready='true';status('Ryuu en 2D isométrique · cinq couleurs actives.');
}catch(e){$('#loading').textContent='Atelier indisponible : '+e.message;status(e.message);document.body.dataset.ready='error';}
export function inspect(){return{source:asset.source,masks:asset.masks,pixels:paint(asset,colors,false),colors:{...colors},defaults:asset.defaults,recipe,bounds:opaqueBounds(asset.source,1254,1254)};}
