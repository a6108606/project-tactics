import {paint} from './sprite.js';
import {SIZE,loadView,readJSON} from './directions.js';
const $=s=>document.querySelector(s),KEY='project-tactics.ryuu-isometric.8.1',OLD_KEY='project-tactics.ryuu-isometric.se.1';
const canvas=$('#scene'),ctx=canvas.getContext('2d'),sprite=document.createElement('canvas');sprite.width=sprite.height=SIZE;
let asset,recipe,colors,original,views,current='se',mode='grid',height=520,debug=false,bg='light',ready=false,request=0,allAssets;
const status=s=>$('#status').textContent=s;
function rhombus(cx,cy,w,h,fill,stroke){ctx.beginPath();ctx.moveTo(cx,cy-h/2);ctx.lineTo(cx+w/2,cy);ctx.lineTo(cx,cy+h/2);ctx.lineTo(cx-w/2,cy);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.stroke();}
function ground(cx,cy,dark){for(let sum=-4;sum<=4;sum++)for(let x=-2;x<=2;x++){let y=sum-x;if(y< -2||y>2)continue;const px=cx+(x-y)*68,py=cy+(x+y)*34,active=x===0&&y===0;rhombus(px,py+5,132,66,dark?'#262f2d':'#cfc6ac',dark?'#29352e':'#cfc6ac');rhombus(px,py,132,66,active?(dark?'#677959':'#d7dfbd'):(dark?((x+y)%2?'#3c493e':'#414f41'):((x+y)%2?'#e4dfca':'#eee7d5')),active?'#9ba176':dark?'#576450':'#d3c9b0');}}
function surface(a,overlay=false){const c=document.createElement('canvas');c.width=c.height=SIZE;c.getContext('2d').putImageData(new ImageData(paint(a,colors,overlay),SIZE,SIZE),0,0);return c;}
function place(context,image,a,cx,cy,h){const s=h/a.view.displayHeight;context.drawImage(image,cx-a.recipe.anchor[0]*s,cy-a.recipe.anchor[1]*s,SIZE*s,SIZE*s);}
function draw(){
 if(!ready)return;const dark=bg==='dark';ctx.clearRect(0,0,1000,800);ctx.fillStyle=dark?'#29332e':'#f6f0e3';ctx.fillRect(0,0,1000,800);
 if(mode==='all'&&allAssets){allAssets.forEach((a,i)=>{const cx=125+(i%4)*250,cy=340+Math.floor(i/4)*390;place(ctx,surface(a,debug),a,cx,cy,310);ctx.fillStyle=dark?'#d8decb':'#807357';ctx.font='16px system-ui';ctx.textAlign='center';ctx.fillText(a.view.label,cx,cy+45);});return;}
 const cx=mode==='compare'?720:500,cy=mode==='grid'?635:710;if(mode==='grid')ground(cx,cy,dark);
 ctx.save();ctx.translate(cx,cy+8);ctx.scale(1,.35);const shadow=ctx.createRadialGradient(0,0,0,0,0,height*.17);shadow.addColorStop(0,dark?'#00000060':'#65594045');shadow.addColorStop(1,'#65594000');ctx.fillStyle=shadow;ctx.beginPath();ctx.arc(0,0,height*.17,0,Math.PI*2);ctx.fill();ctx.restore();
 if(mode==='compare'&&original){const oh=570,ow=original.width/original.height*oh;ctx.drawImage(original,270-ow/2,cy-oh,ow,oh);ctx.fillStyle=dark?'#d8decb':'#807357';ctx.font='16px system-ui';ctx.textAlign='center';ctx.fillText('FICHE ORIGINALE',270,760);ctx.fillText(asset.view.label.toUpperCase(),720,760);}
 place(ctx,sprite,asset,cx,cy,mode==='compare'?570:height);
 if(mode==='grid'){ctx.fillStyle=dark?'#b5bca6':'#969179';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('RYUU · '+asset.view.label.toUpperCase(),500,775);}
}
function repaint(){if(!asset)return;sprite.getContext('2d').putImageData(new ImageData(paint(asset,colors,debug),SIZE,SIZE),0,0);draw();}
function sync(){for(const ch of recipe.channels){$('#color-'+ch.id).value=colors[ch.id];$('#hex-'+ch.id).value=colors[ch.id];}repaint();}
function busy(message){$('#loading').hidden=!message;if(message)$('#loading').textContent=message;$('#export').disabled=!!message;$('#exportAll').disabled=!!message;document.body.dataset.busy=String(!!message);}
function selected(){document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));document.querySelectorAll('[data-direction]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.direction===current)));$('#viewName').textContent=asset.view.label+' · pose de repos';}
async function chooseDirection(id){
 const ticket=++request;busy('Préparation : '+views.find(v=>v.id===id).label+'…');
 try{const next=await loadView(views.find(v=>v.id===id));if(ticket!==request)return;asset=next;recipe=next.recipe;current=id;if(mode==='all')mode='grid';selected();sync();status('Vue '+asset.view.label.toLowerCase()+' · votre palette est conservée.');}
 catch(e){if(ticket===request)status('Vue indisponible : '+e.message);}finally{if(ticket===request)busy('');}
}
async function setMode(value){
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
function palette(list){recipe.channels.forEach((ch,i)=>colors[ch.id]=list[i]);sync();}
$('#random').addEventListener('click',()=>{palette(Object.values(schemes)[Math.floor(Math.random()*3)]);status('Palette appliquée aux huit directions.');});
$('#save').addEventListener('click',()=>{try{localStorage.setItem(KEY,JSON.stringify({version:2,character:'ryuu-masculine',direction:current,colors}));status('Palette et orientation enregistrées dans ce navigateur.');}catch{status('Enregistrement local indisponible.');}});
$('#export').addEventListener('click',async()=>{await download(surface(asset),`ryuu-isometrique-${current}.png`);status('Vue '+asset.view.label.toLowerCase()+' exportée avec votre palette.');});
$('#exportAll').addEventListener('click',async()=>{busy('Préparation de la planche PNG…');try{const loaded=await Promise.all(views.map(loadView)),c=document.createElement('canvas');c.width=3072;c.height=2560;const context=c.getContext('2d');loaded.forEach((a,i)=>place(context,surface(a),a,384+(i%4)*768,1160+Math.floor(i/4)*1280,1100));await download(c,'ryuu-isometrique-8-directions.png');status('Planche transparente exportée : Dos, Dos droite, Droite, Face droite, Face, Face gauche, Gauche, Dos gauche.');}catch(e){status(e.message);}finally{busy('');}});
document.querySelectorAll('button,input,select').forEach(el=>el.disabled=true);
try{
 views=(await readJSON('assets/directions.json')).views;asset=await loadView(views.find(v=>v.id==='se'));recipe=asset.recipe;colors={...asset.defaults};
 original=await createImageBitmap(await (await fetch('../../../content/art/characters/reference-v2/references/ryuu.png')).blob(),12,183,237,537);
 for(const ch of recipe.channels){const row=document.createElement('div');row.className='color';row.innerHTML='<label for="color-'+ch.id+'">'+({'clothing1':'Jambe droite','clothing2':'Jambe gauche'}[ch.id]||ch.label)+'</label><input id="color-'+ch.id+'" type="color" value="'+ch.color+'"><input id="hex-'+ch.id+'" aria-label="'+ch.label+' en hexadécimal" type="text" value="'+ch.color+'" maxlength="7" spellcheck="false">';$('#colors').append(row);row.querySelector('[type=color]').addEventListener('input',e=>{changeColor(ch.id,e.target.value);status('Couleur appliquée aux directions.');});row.querySelector('[type=text]').addEventListener('input',e=>{if(/^#[\da-f]{6}$/i.test(e.target.value)){e.target.setCustomValidity('');changeColor(ch.id,e.target.value);}else e.target.setCustomValidity('Utiliser # suivi de six caractères hexadécimaux.');});}
 for(const [name,list]of Object.entries(schemes)){const b=document.createElement('button');b.setAttribute('aria-label',name);b.title=name;list.forEach(c=>{const s=document.createElement('i');s.style.background=c;b.append(s);});b.addEventListener('click',()=>{palette(list);status(name+' appliqué aux directions.');});$('#presets').append(b);}
 const positions={nw:1,n:2,ne:3,w:4,e:6,sw:7,s:8,se:9},arrows={nw:'↖',n:'↑',ne:'↗',w:'←',e:'→',sw:'↙',s:'↓',se:'↘'};
 for(const v of views){const b=document.createElement('button');b.dataset.direction=v.id;b.style.gridArea=`${Math.ceil(positions[v.id]/3)} / ${(positions[v.id]-1)%3+1}`;b.innerHTML='<span aria-hidden="true">'+arrows[v.id]+'</span>'+v.label;b.setAttribute('aria-label','Orientation : '+v.label);b.addEventListener('click',()=>chooseDirection(v.id));$('#directions').append(b);}
 $('#directions').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const next=views[(views.findIndex(v=>v.id===current)+(e.key==='ArrowRight'?1:7))%8];chooseDirection(next.id);$('[data-direction="'+next.id+'"]').focus();});
 let saved;try{saved=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(OLD_KEY)||'null');if(saved&&recipe.channels.every(c=>/^#[\da-f]{6}$/i.test(saved.colors?.[c.id])))colors=Object.fromEntries(recipe.channels.map(c=>[c.id,saved.colors[c.id]]));}catch{}
 ready=true;selected();sync();$('#loading').hidden=true;document.querySelectorAll('button,input,select').forEach(el=>el.disabled=false);document.body.dataset.ready='true';document.body.dataset.busy='false';status('Huit orientations · une palette commune.');if(views.some(v=>v.id===saved?.direction)&&saved.direction!=='se')await chooseDirection(saved.direction);
}catch(e){$('#loading').textContent='Atelier indisponible : '+e.message;status(e.message);document.body.dataset.ready='error';}
export function inspect(){return{...asset,pixels:paint(asset,colors,false),colors:{...colors},current,views,mode};}
export {chooseDirection,setMode};
