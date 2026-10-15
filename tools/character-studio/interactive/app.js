import {rectPixels} from './geometry.js';
import {saveLocal} from './storage.js';
import {icon,injectIcons} from './icons.js';
import {CHANNELS} from './appearance-contract.js';
import {getRecipe} from './catalog.js';
import {createRecipeMasks,recipeColors} from '../pipeline/mask-engine.js';
import {History} from './history.js';
import {recolor,maskPreview} from './render.js';
import {BASES,STORAGE,canonical,validate,importAppearance,initialState,restore} from './state.js';

const $=id=>document.getElementById(id);
const ROOT='../../../content/art/characters/reference-v2/';
const LABELS=['Peau','Cheveux','Vêtement 1','Vêtement 2','Vêtement 3'];
const BASE_LABEL={masculine:'Masculine',feminine:'Féminine'};
const DIR_LABEL=['Sud','Sud-Ouest','Ouest','Nord-Ouest','Nord','Nord-Est','Est','Sud-Est'];
const PANELS=['character','colors','equipment','reference'];
const PRESETS=[
  {id:'night',name:'Nuit & jade',colors:['#65412F','#222E45','#356C72','#526E52','#B48760']},
  {id:'ivory',name:'Ivoire & sauge',colors:['#E1B48F','#EAE4DA','#566D58','#455C68','#B99563']},
  {id:'ember',name:'Braise & cuivre',colors:['#A66B49','#322831','#834950','#5D4543','#B9854B']},
];
let study='face';
let references,lock,state,images={},cache={},ready=false,storageWorks=true,toastTimer;
const hero=()=>references.find(h=>h.id===state.hero);
const current=()=>state.configs[state.hero][state.base];
const supported=()=>Boolean(getRecipe(state.hero,state.base));
const history=new History();
const historyKey=()=>state.hero+'/'+state.base;
function remember(before){history.remember(historyKey(),before,current());updateHistoryControls();}
function updateHistoryControls(){const h=history.status(historyKey());$('undoColors').disabled=!editable()||!h.undo;$('redoColors').disabled=!editable()||!h.redo;}
function moveHistory(action){if(!editable())return;const value=history[action](historyKey(),current());if(value){state.configs[state.hero][state.base]=value;render();}}
const editable=()=>supported()&&state.mode==='illustration';
const changed=()=>JSON.stringify(current().colors)!==JSON.stringify(canonical(state.hero,state.base,references).colors);

function crop(h,box) {
  const [x,y,w,height]=rectPixels(h,box),canvas=document.createElement('canvas');
  canvas.width=w;canvas.height=height;canvas.getContext('2d').drawImage(images[h.id],x,y,w,height,0,0,w,height);
  return canvas;
}
function copy(target,source) {target.width=source.width;target.height=source.height;target.getContext('2d').drawImage(source,0,0);}
function baseData(h,base) {
  const key=h.id+'-'+base;if(cache[key])return cache[key];
  const box=rectPixels(h,h[base]),canvas=crop(h,h[base]);
  const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height),recipe=getRecipe(h.id,base);
  if(recipe&&(recipe.source.sha256!==h.sha256||JSON.stringify(box)!==JSON.stringify(recipe.crop)))throw Error('Fiche de préparation incompatible : '+h.name+' '+base);
  return cache[key]={box,canvas,data,masks:getRecipe(h.id,base)?createRecipeMasks(data.data,getRecipe(h.id,base)):null};
}
function appearance(h,base,original=false,showMasks=false) {
  const b=baseData(h,base),c=document.createElement('canvas');c.width=b.canvas.width;c.height=b.canvas.height;
  const bytes=original||!b.masks?b.data.data:showMasks?maskPreview(b.data.data,b.masks):recolor(b.data.data,b.masks,recipeColors(getRecipe(h.id,base)),state.configs[h.id][base].colors);
  c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(bytes),c.width,c.height),0,0);return c;
}
function joinCanvases(parts,labels=[],vertical=false) {
  if(parts.length===1&&!labels.length)return parts[0];
  const gap=22,heading=labels.length?30:0,c=document.createElement('canvas');
  c.width=vertical?Math.max(...parts.map(p=>p.width)):parts.reduce((s,p)=>s+p.width,0)+gap*(parts.length-1);
  c.height=vertical?parts.reduce((s,p)=>s+p.height+heading,0)+gap*(parts.length-1):Math.max(...parts.map(p=>p.height))+heading;
  const ctx=c.getContext('2d');ctx.fillStyle='#f7f0e2';ctx.fillRect(0,0,c.width,c.height);let offset=0;
  parts.forEach((p,i)=>{const x=vertical?(c.width-p.width)/2:offset,y=vertical?offset:0;
    ctx.fillStyle='#203442';ctx.font='12px sans-serif';ctx.textAlign='center';if(labels.length)ctx.fillText(labels[i],x+p.width/2,y+19);
    ctx.drawImage(p,x,y+heading);offset+=(vertical?p.height+heading:p.width)+gap;
  });return c;
}
function stageCanvas() {
  const h=hero(),bases=state.duo?BASES:[state.base];
  if(state.mode==='illustration') {
    if(state.compare)return joinCanvases(bases.flatMap(b=>[appearance(h,b,true),appearance(h,b,false,state.masks)]),bases.flatMap(b=>[BASE_LABEL[b]+' · originale',BASE_LABEL[b]+' · '+(state.masks?'zones':'personnalisée')]));
    return joinCanvases(bases.map(b=>appearance(h,b,false,state.masks)),state.duo?bases.map(b=>BASE_LABEL[b]):[]);
  }
  if(state.mode==='sheet')return crop(h,null);
  if(state.mode==='equipment')return crop(h,h.equipment);
  const parts=bases.map(b=>crop(h,state.mode==='iso'?h.directions[b][state.direction]:h.poses[b]));
  return joinCanvases(parts,[],state.mode==='poses');
}
function toast(message) {$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),7000);}
function persist() {
  storageWorks=saveLocal(state);
  $('storageStatus').textContent=storageWorks?'Sauvegarde locale dans ce navigateur':'Stockage indisponible — exportez votre JSON';
  $('storageStatus').classList.toggle('status-warning',!storageWorks);$('saveCount').textContent=state.saved.length;
  return storageWorks;
}
function paletteUpdate() {
  $('palettePreview').replaceChildren(...CHANNELS.map((k,i)=>{const el=document.createElement('span');el.style.background=current().colors[k];el.title=LABELS[i]+' · '+current().colors[k];return el;}));
  $('paletteState').textContent=changed()?'Personnalisée':'D’origine';$('customStatus').textContent=changed()?'Personnalisée':'D’origine';
  for(const b of document.querySelectorAll('[data-preset]')){const preset=PRESETS.find(p=>p.id===b.dataset.preset);b.setAttribute('aria-pressed',String(CHANNELS.every((k,i)=>current().colors[k]===preset.colors[i])));}
}
function buildColors() {
  $('colorRows').replaceChildren();
  CHANNELS.forEach((k,i)=>{
    const row=document.createElement('div');row.className='color-row';
    const chip=document.createElement('label');chip.className='color-chip';
    const input=document.createElement('input');input.type='color';input.id='color-'+k;input.value=current().colors[k];input.setAttribute('aria-label','Couleur '+LABELS[i]);input.disabled=!editable();chip.append(input);
    const label=document.createElement('label');label.className='color-label';label.htmlFor=input.id;label.textContent=LABELS[i];
    if(supported()){const small=document.createElement('small');small.textContent=getRecipe(state.hero,state.base).channels.find(c=>c.id===k).region_label.replace('Pantalon : ','');label.append(small);}
    const hex=document.createElement('input');hex.id='hex-'+k;hex.className='hex-input';hex.maxLength=7;hex.pattern='#[0-9A-Fa-f]{6}';hex.value=current().colors[k];hex.setAttribute('aria-label','Code hexadécimal '+LABELS[i]);hex.disabled=!editable();
    const update=value=>{const before=structuredClone(current());current().colors[k]=value.toUpperCase();remember(before);input.value=value;hex.value=value.toUpperCase();paletteUpdate();drawStage();persist();};
    input.addEventListener('input',()=>update(input.value));
    hex.addEventListener('input',()=>{if(/^#[0-9a-f]{6}$/i.test(hex.value))update(hex.value);});
    hex.addEventListener('change',()=>{if(/^#[0-9a-f]{6}$/i.test(hex.value))update(hex.value);else{hex.value=current().colors[k];toast('Couleur refusée : utilisez six chiffres hexadécimaux, par exemple #C7D5B4.');}});
    const reset=document.createElement('button');reset.className='color-reset';reset.textContent='↺';reset.title='Rétablir '+LABELS[i];reset.setAttribute('aria-label','Rétablir la couleur '+LABELS[i]);reset.disabled=!editable();reset.addEventListener('click',()=>update(canonical(state.hero,state.base,references).colors[k]));row.append(chip,label,hex,reset);$('colorRows').append(row);
  });
  $('randomColors').disabled=!editable();$('resetColors').disabled=!editable();for(const b of document.querySelectorAll('[data-preset]'))b.disabled=!editable();updateHistoryControls();
}
function buildStudies(kind) {
  const isFace=kind==='face',host=$(isFace?'faceGrid':'hairGrid');host.replaceChildren();
  (isFace?hero().faces:hero().hairs).forEach((box,i)=>{
    const button=document.createElement('button');button.className='study-button';button.disabled=true;button.setAttribute('aria-pressed','false');button.setAttribute('aria-label',`${isFace?'Visage':'Coiffure'} — étude ${i+1}, calque indisponible`);
    button.title='Étude de référence ; aucune variante composable disponible.';
    const text=document.createElement('span');text.textContent=String(i+1).padStart(2,'0');button.append(crop(hero(),box),text);host.append(button);
  });
  $(isFace?'faceCurrent':'hairCurrent').textContent='9 études · '+(isFace?'visage':'coiffure')+' d’origine dans l’aperçu';
}
function buildNav() {
  $('heroNav').replaceChildren(...references.map(h=>{
    const b=document.createElement('button');b.className='hero-tab';b.dataset.hero=h.id;b.setAttribute('role','tab');b.setAttribute('aria-label',h.name+' — '+h.subtitle);b.setAttribute('aria-controls','stage');
    const av=document.createElement('span');av.className='nav-avatar';av.append(crop(h,h.avatar));
    const info=document.createElement('span'),title=document.createElement('strong'),sub=document.createElement('small');title.textContent=h.name;sub.textContent=getRecipe(h.id,state.base)?'Personnalisable':'Référence';b.title=h.subtitle;info.append(title,sub);
    b.append(av,info);
    b.addEventListener('click',()=>{state.hero=h.id;state.zoom=100;state.compare=false;state.masks=false;render();});return b;
  }));
}
function drawStage() {
  const h=hero();copy($('mainCanvas'),stageCanvas());
  $('stage').className='stage '+state.mode+(state.compare?' compare':'');$('mainCanvas').style.transform=`scale(${state.zoom/100})`;
  $('heroTitle').textContent=h.name;
  const description=state.mode==='illustration'?(state.duo?'Deux bases':'Base '+BASE_LABEL[state.base].toLowerCase())+' · '+(state.masks?'zones de couleur':supported()?'personnalisable':'référence'):{iso:'Études isométriques · '+DIR_LABEL[state.direction],poses:'Études de mouvements',sheet:'Fiche maître complète',equipment:'Équipements · études originales'}[state.mode];
  $('heroViewSubtitle').textContent=description;$('mainCanvas').setAttribute('aria-label',h.name+' — '+description);
  $('previewCaption').textContent=state.mode!=='illustration'?'Étude d’origine · vos couleurs ne sont pas appliquées à cette vue':!supported()?'Dessin d’origine · personnalisation à venir':state.masks?'Zones de couleur · équipements protégés':state.compare?'Originale à gauche · votre apparence à droite':'Visage, coiffure et équipements d’origine';

  $('directionWrap').hidden=state.mode!=='iso';$('zoomRange').value=state.zoom;$('zoomOutput').value=state.zoom+' %';
  for(const b of document.querySelectorAll('[data-mode]')){const selected=b.dataset.mode===state.mode;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;}
  $('duoToggle').setAttribute('aria-pressed',String(state.duo));$('duoToggle').disabled=['sheet','equipment'].includes(state.mode);
  $('compareToggle').setAttribute('aria-pressed',String(state.compare));$('maskToggle').setAttribute('aria-pressed',String(state.masks));
  $('compareToggle').disabled=!editable();$('maskToggle').disabled=!editable();
  $('exportPreview').disabled=!editable()||state.masks||state.compare;
  $('exportPreview').title=!supported()?'Personnalisation à venir pour ce personnage.':!editable()||state.masks||state.compare?'Revenez à l’illustration seule pour exporter votre apparence.':'PNG à la résolution source, identique au rendu central.';
}
function renderDirections() {
  $('directionGrid').replaceChildren(...hero().directions[state.base].map((box,i)=>{
    const b=document.createElement('button');b.className='dir-button'+(i===state.direction?' active':'');b.setAttribute('aria-label','Étude '+DIR_LABEL[i]);b.setAttribute('aria-pressed',String(i===state.direction));
    const text=document.createElement('span');text.textContent=DIR_LABEL[i];b.append(crop(hero(),box),text);b.addEventListener('click',()=>{state.direction=i;drawStage();renderDirections();});return b;
  }));
}
function render() {
  if(!ready)return;
  for(const b of document.querySelectorAll('[data-hero]')){const selected=b.dataset.hero===state.hero;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;}
  for(const b of document.querySelectorAll('[data-base]')){b.classList.toggle('active',b.dataset.base===state.base);b.setAttribute('aria-pressed',String(b.dataset.base===state.base));}
  for(const b of document.querySelectorAll('[data-panel]')){const selected=b.dataset.panel===state.tab;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;}
  for(const t of PANELS)$('pane-'+t).hidden=state.tab!==t;
  for(const b of document.querySelectorAll('[data-study]')){const selected=b.dataset.study===study;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;}
  for(const t of ['face','hair'])$('pane-'+t).hidden=study!==t;
  for(const base of BASES)copy($(base==='masculine'?'baseMasculine':'baseFeminine'),appearance(hero(),base,true));
  $('heroAvailability').textContent=supported()?'Couleurs personnalisables':'Référence · couleurs à venir';
  $('colorContext').textContent=hero().name+' · '+BASE_LABEL[state.base];
  $('chooseColors').firstChild.textContent=supported()?'Personnaliser les couleurs ':'Voir la palette ';
  buildColors();buildStudies('face');buildStudies('hair');paletteUpdate();drawStage();renderDirections();
  copy($('sheetThumb'),crop(hero(),null));copy($('equipmentThumb'),crop(hero(),hero().equipment));$('signatureDescription').textContent=hero().description;
  $('refSource').textContent=`PNG original · ${hero().width} × ${hero().height} px · empreinte vérifiée`;
  $('capabilityNote').textContent=!supported()?'Les couleurs de ce personnage seront personnalisables après Ryuu. Sa palette d’origine est affichée.':state.mode!=='illustration'?'Revenez à l’onglet Illustration pour appliquer vos couleurs.':'Les armes et accessoires conservent leurs couleurs. Les trois zones textiles correspondent au pantalon.';
  persist();
}
function openDialog(id){if(!$(id).open)$(id).showModal();}
function closeMenu(){$('exportMenu').hidden=true;$('exportBtn').setAttribute('aria-expanded','false');}
function zoomDialog(value){$('dialogZoomOutput').value=value+' %';$('dialogCanvas').style.width=$('dialogCanvas').width*value/100+'px';}
function openImage(kind) {
  copy($('dialogCanvas'),kind==='sheet'?crop(hero(),null):kind==='equipment'?crop(hero(),hero().equipment):$('mainCanvas'));
  $('imageDialogTitle').textContent=hero().name+' — '+(kind==='sheet'?'fiche maître':kind==='equipment'?'équipements':'aperçu affiché');
  $('imageDialogSubtitle').textContent=kind==='view'?'Agrandissement du rendu affiché.':'Extrait original de la fiche approuvée.';
  $('downloadDialog').textContent=kind==='view'?'PNG de cet aperçu':'PNG de référence';
  $('dialogZoom').value=80;zoomDialog(80);openDialog('imageDialog');
}
function download(blob,name) {
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
}
function downloadJSON(data,name){download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),name);}
function downloadCanvas(c,name){c.toBlob(blob=>blob?download(blob,name):toast('Échec de l’export PNG.'),'image/png');}
function saveLook() {
  if(state.saved.length>=50){toast('50 apparences enregistrées. Exportez ou supprimez une apparence.');return;}
  state.saved.push({id:crypto.randomUUID(),name:hero().name+' · '+BASE_LABEL[state.base]+' · '+(state.saved.length+1),appearance:structuredClone(current())});
  const ok=persist();toast(ok?'Apparence enregistrée.':'Stockage indisponible : cette apparence reste en mémoire. Exportez le JSON pour la conserver.');
}
function savedDialog() {
  $('savesTitle').textContent='Mes apparences';
  const host=$('savedBody');host.replaceChildren();
  if(!state.saved.length){host.textContent='Aucune apparence enregistrée. Personnalisez Ryuu, puis utilisez « Enregistrer ».';openDialog('savesDialog');return;}
  for(const entry of [...state.saved].reverse()) {
    const card=document.createElement('section');card.className='look-card';const title=document.createElement('strong');title.textContent=entry.name;
    const controls=document.createElement('div');controls.className='look-controls';
    const load=document.createElement('button');load.className='btn-soft';load.textContent='Charger';load.addEventListener('click',()=>{const c=validate(entry.appearance,references);state.hero=c.character_id;state.base=c.body_variant_id;const before=state.configs[state.hero][state.base];state.configs[state.hero][state.base]=c;remember(before);state.duo=false;state.mode='illustration';state.compare=state.masks=false;render();$('savesDialog').close();});
    const remove=document.createElement('button');remove.className='btn-soft';remove.textContent='Supprimer';remove.setAttribute('aria-label','Supprimer '+entry.name);remove.addEventListener('click',()=>{state.saved=state.saved.filter(x=>x!==entry);persist();savedDialog();});
    controls.append(load,remove);card.append(title,controls);host.append(card);
  }openDialog('savesDialog');
}
function buildGallery() {
  $('galleryGrid').replaceChildren(...references.map(h=>{const button=document.createElement('button');button.className='gallery-card';const label=document.createElement('span');label.className='gc-name';label.textContent=h.name;button.append(crop(h,h.duo),label);button.addEventListener('click',()=>{state.hero=h.id;render();$('galleryDialog').close();openImage('sheet');});return button;}));openDialog('galleryDialog');
}
function review() {
  const h=references.find(h=>h.id==='ryuu'),host=$('reviewBody');host.replaceChildren();
  const intro=document.createElement('p');intro.textContent='Le pilote applique cinq couleurs sur les deux dessins approuvés. Les trois zones textiles sont limitées au pantalon ; les bandeaux, ceintures, cuirs, pans rouges et ornements restent protégés. Cette répartition est proposée pour validation.';host.append(intro);
  const grid=document.createElement('div');grid.className='review-grid';
  for(const base of BASES) {
    const f=document.createElement('figure'),title=document.createElement('h3');title.textContent='Ryuu · '+BASE_LABEL[base];
    const c=appearance(h,base,true),ctx=c.getContext('2d'),box=baseData(h,base).box;
    // Review annotation only: no pixels are used in the appearance renderer.
    ctx.strokeStyle='#BD633E';ctx.lineWidth=2;ctx.setLineDash([5,4]);
    const region=base==='masculine'?[55,193,167,169]:[262,195,190,207];ctx.strokeRect(region[0]-box[0],region[1]-box[1],region[2],region[3]);
    const cap=document.createElement('figcaption');cap.textContent='Zone à préparer : mèches avant/arrière, contour du visage, raccord au bandeau et aux oreilles. Aucune reconstruction n’est appliquée dans ce pilote.';f.append(title,c,cap);grid.append(f);
  }host.append(grid);
  const note=document.createElement('div');note.className='technical-note';note.textContent='Pour changer réellement le visage et la coiffure, il faut restituer localement les parties actuellement cachées par les mèches et le bandeau, puis adapter les études à cette vue. Les vignettes sont plus petites et ne constituent pas des calques complets. Les contrôles restent désactivés jusqu’à la préparation et à la validation de ces éléments.';host.append(note);
  const text=document.createElement('p');text.textContent='Aucune déformation du dessin, aucun visage générique, aucun agrandissement de vignette collé sur la tête. Les autres héros restent consultables dans leur forme originale.';host.append(text);
  const actions=document.createElement('div');actions.className='review-actions';
  for(const [url,label]of [['../../../docs/art/ATELIER_V3_STATUS.md','État des critères ART-01 à ART-12'],['README.md','Ouvrir et vérifier le pilote']]){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.textContent=label;actions.append(a);}host.append(actions);openDialog('reviewDialog');
}
function wire() {
  $('undoColors').addEventListener('click',()=>moveHistory('undo'));$('redoColors').addEventListener('click',()=>moveHistory('redo'));
  $('palettePresets').replaceChildren(...PRESETS.map(preset=>{
    const button=document.createElement('button');button.className='preset-card';button.dataset.preset=preset.id;button.setAttribute('aria-pressed','false');
    const swatches=document.createElement('span');swatches.className='preset-swatches';swatches.setAttribute('aria-hidden','true');
    swatches.append(...preset.colors.map(color=>{const i=document.createElement('i');i.style.background=color;return i;}));
    const label=document.createElement('span');label.textContent=preset.name;button.append(swatches,label);
    button.addEventListener('click',()=>{if(!editable())return;const before=structuredClone(current());CHANNELS.forEach((k,i)=>current().colors[k]=preset.colors[i]);remember(before);render();});return button;
  }));
  function switchPanel(panel){state.tab=panel;render();$('tab-'+panel).focus();}
  $('chooseColors').addEventListener('click',()=>switchPanel('colors'));
  $('changeCharacter').addEventListener('click',()=>switchPanel('character'));
  for(const b of document.querySelectorAll('[data-study]'))b.addEventListener('click',()=>{study=b.dataset.study;render();});
  for(const b of document.querySelectorAll('[data-base]'))b.addEventListener('click',()=>{state.base=b.dataset.base;state.duo=false;state.zoom=100;render();});
  for(const b of document.querySelectorAll('[data-panel]'))b.addEventListener('click',()=>{state.tab=b.dataset.panel;render();});
  for(const b of document.querySelectorAll('[data-mode]'))b.addEventListener('click',()=>{state.mode=b.dataset.mode;state.compare=state.masks=false;state.zoom=100;render();});
  for(const b of document.querySelectorAll('[data-close]'))b.addEventListener('click',()=>$(b.dataset.close).close());
  $('compareToggle').addEventListener('click',()=>{state.compare=!state.compare;drawStage();});$('maskToggle').addEventListener('click',()=>{state.masks=!state.masks;drawStage();});$('reviewBtn').addEventListener('click',review);
  $('duoToggle').addEventListener('click',()=>{state.duo=!state.duo;drawStage();persist();});
  function zoom(value){state.zoom=Math.max(75,Math.min(150,value));drawStage();}
  $('zoomRange').addEventListener('input',e=>zoom(Number(e.target.value)));$('zoomOut').addEventListener('click',()=>zoom(state.zoom-10));$('zoomIn').addEventListener('click',()=>zoom(state.zoom+10));
  $('resetColors').addEventListener('click',()=>{const before=structuredClone(current());state.configs[state.hero][state.base]=canonical(state.hero,state.base,references);remember(before);render();toast('Couleurs d’origine rétablies.');});
  $('randomColors').addEventListener('click',()=>{const before=structuredClone(current());const pools=[['#F4D4AF','#865239','#56392C'],['#EAE4DA','#1B2439','#C77A88'],['#406C73','#77558B','#647442'],['#3D5872','#8E5269','#777352'],['#46676B','#80573C','#674775']];CHANNELS.forEach((k,i)=>current().colors[k]=pools[i][Math.floor(Math.random()*pools[i].length)]);remember(before);render();});
  $('sheetPreview').addEventListener('click',()=>openImage('sheet'));$('equipmentBtn').addEventListener('click',()=>openImage('equipment'));$('expandView').addEventListener('click',()=>openImage('view'));$('dialogZoom').addEventListener('input',e=>zoomDialog(Number(e.target.value)));
  $('downloadDialog').addEventListener('click',()=>downloadCanvas($('dialogCanvas'),'project-tactics-'+state.hero+'-apercu.png'));
  $('galleryBtn').addEventListener('click',buildGallery);$('saveLook').addEventListener('click',saveLook);$('savesBtn').addEventListener('click',savedDialog);
  $('rulesBtn').addEventListener('click',()=>openDialog('rulesDialog'));$('downloadLock').addEventListener('click',()=>downloadJSON(lock,'project-tactics-reference-v2-lock.json'));
  $('exportBtn').addEventListener('click',()=>{const open=$('exportMenu').hidden;$('exportMenu').hidden=!open;$('exportBtn').setAttribute('aria-expanded',String(open));});
  $('exportConfig').addEventListener('click',()=>{downloadJSON(validate(current(),references),`project-tactics-${state.hero}-${state.base}-v3.json`);closeMenu();});
  $('exportPreview').addEventListener('click',()=>{downloadCanvas($('mainCanvas'),`project-tactics-${state.hero}-${state.duo?'duo':state.base}-v3.png`);closeMenu();});
  $('exportSheet').addEventListener('click',()=>{downloadCanvas(crop(hero(),null),`project-tactics-${state.hero}-reference.png`);closeMenu();});
  $('importBtn').addEventListener('click',()=>{$('importFile').click();closeMenu();});
  $('importFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try {
    if(f.size>1024*1024)throw Error('Fichier trop volumineux (maximum 1 Mo).');
    const {appearance:c,warnings}=importAppearance(JSON.parse(await f.text()),references);
    state.hero=c.character_id;state.base=c.body_variant_id;const before=state.configs[state.hero][state.base];state.configs[state.hero][state.base]=c;remember(before);state.duo=false;state.mode='illustration';state.compare=state.masks=false;render();
    if(warnings.length){$('savedBody').replaceChildren();const p=document.createElement('p');p.textContent=warnings.join(' ');$('savedBody').append(p);$('savesTitle').textContent='Migration du projet V2';openDialog('savesDialog');}else toast('Apparence importée et appliquée.');
  }catch(err){toast('Import refusé : '+err.message);}finally{e.target.value='';}});
  document.addEventListener('click',e=>{if(!e.target.closest('.export-wrap'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();
    if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||document.querySelector('dialog[open]'))return;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();moveHistory(e.shiftKey?'redo':'undo');return;}
    const tab=e.target.closest('[role=tab]');
    if(tab&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){const tabs=[...tab.parentElement.querySelectorAll('[role=tab]')];let i=tabs.indexOf(tab);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;e.preventDefault();tabs[i].focus();tabs[i].click();return;}
    if(e.key>='1'&&e.key<='5'){state.hero=references[Number(e.key)-1].id;state.compare=state.masks=false;render();}
  });
}
async function init() {
  const controls=[...document.querySelectorAll('button,input,select')];const enabled=controls.filter(c=>!c.disabled);enabled.forEach(c=>c.disabled=true);injectIcons();
  try {
    const response=await fetch('assets/references.json');if(!response.ok)throw Error('Manifeste des références indisponible.');lock=await response.json();references=lock.sources;
    state=initialState(references);let storageError='';
    try{const raw=localStorage.getItem(STORAGE);if(raw)state=restore(JSON.parse(raw),references);}catch{storageError='Sauvegarde locale indisponible ou invalide. Les apparences canoniques sont affichées ; exportez votre JSON pour les conserver.';storageWorks=false;}
    await Promise.all(references.map(async h=>{const response=await fetch(ROOT+h.original_png_file);if(!response.ok)throw Error('PNG introuvable : '+h.name);const bytes=await response.arrayBuffer();const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');if(hash!==h.sha256)throw Error('Empreinte source incorrecte : '+h.name);return new Promise((resolve,reject)=>{const im=new Image(),url=URL.createObjectURL(new Blob([bytes],{type:'image/png'}));im.onload=()=>{URL.revokeObjectURL(url);if(im.naturalWidth!==h.width||im.naturalHeight!==h.height){reject(Error('Dimensions incorrectes : '+h.name));return;}images[h.id]=im;resolve();};im.onerror=()=>{URL.revokeObjectURL(url);reject(Error('PNG illisible : '+h.name));};im.src=url;});}));
    enabled.forEach(c=>c.disabled=false);wire();ready=true;buildNav();render();
    $('sourceList').replaceChildren(...references.map(h=>{const d=document.createElement('div');d.textContent=h.name;const code=document.createElement('code');code.textContent=h.sha256.slice(0,16)+'…';code.title=h.sha256;d.append(code);return d;}));
    $('loading').hidden=true;$('integrityLabel').textContent='Ryuu personnalisable · 4 héros en référence';document.body.dataset.ready='true';
    if(storageError)toast(storageError);
  }catch(e){$('loading').textContent=e.message+' — Lancez le serveur local indiqué dans le README.';$('loading').setAttribute('role','alert');}
}
init();
