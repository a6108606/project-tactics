import * as THREE from 'three';
import {GLTFLoader} from '../vendor/GLTFLoader.js';
import {OrbitControls} from '../vendor/OrbitControls.js';
const $=s=>document.querySelector(s), KEY='project-tactics.ryuu-forms.1';
const palette={skin:'#F1BC85',hair:'#C7D5B4',clothing1:'#51315D',clothing2:'#B0434E',clothing3:'#46394B'};
const labels={skin:'Peau',hair:'Cheveux',clothing1:'Pantalon',clothing2:'Tissu de taille',clothing3:'Gilet et liens'};
const equipmentLabels={leather:'Cuirs et ornements',bandana:'Bandeau et rubans',sash:'Pan de hanche'};
let state={colors:{...palette},equipment:{leather:true,bandana:true,sash:true}},model,rotating=false;
const scene=new THREE.Scene();scene.background=new THREE.Color('#f7f0e2');
const camera=new THREE.OrthographicCamera(-1,1,1.08,-1.08,.01,40);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.AgXToneMapping;renderer.toneMappingExposure=1.2;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.domElement.setAttribute('aria-label','Volume de Ryuu. Utiliser aussi les boutons Face, Profil et Dos.');renderer.domElement.setAttribute('role','img');
$('#viewport').append(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.96,0);controls.enablePan=false;controls.minZoom=.7;controls.maxZoom=1.8;controls.autoRotateSpeed=1;
controls.minPolarAngle=.3;controls.maxPolarAngle=1.7;
function render(){renderer.render(scene,camera);}
function angle(deg){const a=THREE.MathUtils.degToRad(deg);camera.position.set(5*Math.sin(a),1.65,5*Math.cos(a));controls.update();render();}
angle(-25);
function resize(){const r=$('#viewport').getBoundingClientRect();if(!r.width||!r.height)return;camera.left=-1.08*r.width/r.height;camera.right=1.08*r.width/r.height;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height);render();}
new ResizeObserver(resize).observe($('#viewport'));
controls.addEventListener('change',()=>{$('#zoom').value=camera.zoom;render();});
scene.add(new THREE.HemisphereLight(0xfff6e6,0x6c647e,2));
const key=new THREE.DirectionalLight(0xfff1dc,3);key.position.set(-2,4,4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-1.5,right:1.5,top:2.5,bottom:-1,near:.1,far:12});key.shadow.normalBias=.003;key.shadow.bias=-.0001;scene.add(key);
const fill=new THREE.DirectionalLight(0xe3eaff,1);fill.position.set(3,2,-2);scene.add(fill);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.15}));floor.rotation.x=-Math.PI/2;floor.position.y=.005;floor.receiveShadow=true;scene.add(floor);
function status(s){$('#status').textContent=s;}
function apply(){
 if(!model)return;
 model.traverse(o=>{if(o.name.startsWith('equip_'))o.visible=state.equipment[o.name.slice(6)]!==false;
 if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m.name.startsWith('base_')&&state.colors[m.name.slice(5)])m.color.set(state.colors[m.name.slice(5)]);}
 });render();
}
for(const [id,label] of Object.entries(labels)){
 const row=document.createElement('div');row.className='color';row.innerHTML='<label for="color-'+id+'">'+label+'</label><input id="color-'+id+'" type="color" value="'+palette[id]+'"><span>'+palette[id]+'</span>';
 $('#colors').append(row);row.querySelector('input').addEventListener('input',e=>{state.colors[id]=e.target.value.toUpperCase();row.querySelector('span').textContent=state.colors[id];apply();status('Couleur appliquée au volume.');});
}
for(const [id,label] of Object.entries(equipmentLabels)){
 const l=document.createElement('label');l.innerHTML='<input id="equip-'+id+'" type="checkbox" checked> '+label;$('#equipment').append(l);
 l.firstChild.addEventListener('change',e=>{state.equipment[id]=e.target.checked;apply();status('Équipement '+(e.target.checked?'affiché.':'masqué.'));});
}
function sync(){for(const id of Object.keys(palette)){$('#color-'+id).value=state.colors[id];$('#color-'+id).nextElementSibling.textContent=state.colors[id];}for(const id of Object.keys(equipmentLabels))$('#equip-'+id).checked=state.equipment[id];apply();}
$('#reset').addEventListener('click',()=>{state.colors={...palette};sync();status('Palette d’origine restaurée.');});
$('#save').addEventListener('click',()=>{try{localStorage.setItem(KEY,JSON.stringify(state));status('Apparence enregistrée dans ce navigateur.');}catch{status('Enregistrement local indisponible.');}});
$('#referenceChoice').addEventListener('change',e=>{const target=e.target.value==='target';$('#reference').src=target?'ref/target.png':'ref/original-male-crop.png';$('#reference').alt=target?'Cible artistique Imagegen, pas un rendu du modèle':'Ryuu masculin de la fiche originale';$('#referenceLabel').textContent=target?'CIBLE ARTISTIQUE · IMAGE':'FICHE ORIGINALE';});
document.querySelectorAll('[data-angle]').forEach(b=>b.addEventListener('click',()=>{rotating=false;controls.autoRotate=false;$('#rotate').setAttribute('aria-pressed','false');angle(Number(b.dataset.angle));}));
$('#zoom').addEventListener('input',e=>{camera.zoom=Number(e.target.value);camera.updateProjectionMatrix();render();});
$('#rotate').addEventListener('click',()=>{rotating=!rotating;controls.autoRotate=rotating;$('#rotate').setAttribute('aria-pressed',String(rotating));});
$('#png').addEventListener('click',()=>{rotating=false;controls.autoRotate=false;$('#rotate').setAttribute('aria-pressed','false');render();renderer.domElement.toBlob(blob=>{if(!blob){status('Export indisponible.');return;}const link=document.createElement('a');const url=URL.createObjectURL(blob);link.href=url;link.download='ryuu-formes-3d.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);status('PNG exporté depuis le rendu 3D affiché.');},'image/png');});
document.querySelectorAll('button,input').forEach(e=>e.disabled=true);
try{
 const manifestResponse=await fetch('exports/manifest.json');if(!manifestResponse.ok)throw Error('Manifeste inaccessible');const manifest=await manifestResponse.json();
 const response=await fetch('exports/ryuu-forms.glb');if(!response.ok)throw Error('GLB inaccessible');const bytes=await response.arrayBuffer();
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
 if(hash!==manifest.files['ryuu-forms.glb'])throw Error('Empreinte du modèle différente');
 model=(await new GLTFLoader().parseAsync(bytes,'')).scene;
 model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
 scene.add(model);
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&Object.keys(palette).every(k=>/^#[\da-f]{6}$/i.test(saved.colors?.[k]))&&Object.keys(equipmentLabels).every(k=>typeof saved.equipment?.[k]==='boolean'))state={colors:Object.fromEntries(Object.keys(palette).map(k=>[k,saved.colors[k]])),equipment:Object.fromEntries(Object.keys(equipmentLabels).map(k=>[k,saved.equipment[k]]))};}catch{}
 sync();resize();$('#loading').hidden=true;document.querySelectorAll('button,input').forEach(e=>e.disabled=false);
 document.body.dataset.ready='true';status('Modèle chargé · étude de formes, qualité artistique encore à améliorer.');
}catch(error){$('#loading').textContent='Chargement impossible : '+error.message;status(error.message);document.body.dataset.ready='error';}
renderer.setAnimationLoop(()=>{if(rotating){controls.update();render();}});
// Read-only inspection for the same-origin verification page.
export function inspect(){return {state:JSON.parse(JSON.stringify(state)),materials:model?Array.from(new Set([...function*(){const ms=[];model.traverse(o=>{if(o.isMesh)ms.push(...(Array.isArray(o.material)?o.material:[o.material]));});yield*ms;}()])).map(m=>({name:m.name,color:'#'+m.color.getHexString()})):[]};}
