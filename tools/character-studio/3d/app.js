import * as THREE from 'three';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {defaults,validate,applyAppearance,CHANNELS,COLORS,EQUIPMENT} from './appearance.js';

const $=s=>document.querySelector(s), KEY='project-tactics.ryuu-3d-study.1';
const states={masculine:defaults(),feminine:defaults('feminine')};
let current='masculine', renderer, scene, camera, controls, model, manifest, busy=true, ticket=0, rotating=false;
const models=new Map();
const status=text=>{$('#status').textContent=text;};
function restore(){try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw){for(const b of Object.keys(states))states[b]=validate(raw.states[b]);if(!states[raw.current])throw Error('Base inconnue');current=raw.current;status('Apparence enregistrée restaurée.');}}catch(e){status('Sauvegarde indisponible ou invalide : '+e.message);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify({current,states}));status('Les deux bases ont été enregistrées dans ce navigateur.');}catch(e){status('Enregistrement impossible : '+e.message);}}
function setBusy(value){busy=value;document.querySelectorAll('main button,main input,main select').forEach(el=>el.disabled=value);}
function render(){if(renderer&&model)renderer.render(scene,camera);}
function updateView(){const s=states[current],a=THREE.MathUtils.degToRad(s.view.azimuth),e=THREE.MathUtils.degToRad(s.view.elevation);camera.position.set(10*Math.sin(a)*Math.cos(e),2.12+10*Math.sin(e),10*Math.cos(a)*Math.cos(e));camera.zoom=s.view.zoom;camera.updateProjectionMatrix();controls.target.set(0,2.12,0);controls.update();$('#angle').value=s.view.azimuth;$('#zoom').value=s.view.zoom;render();}
function resize(){if(!renderer)return;const {width,height}=$('#viewport').getBoundingClientRect();if(!width||!height)return;const half=2.5;camera.left=-half*width/height;camera.right=half*width/height;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(width,height);render();}
function sync(){const s=states[current];document.querySelectorAll('[name=base]').forEach(el=>el.checked=el.value===current);$('#face').value=s.face_variant_id;$('#hair').value=s.hair_variant_id;for(const k of Object.keys(CHANNELS)){$('#color-'+k).value=s.colors[k];$('#hex-'+k).value=s.colors[k];}for(const k of Object.keys(EQUIPMENT))$('#equip-'+k).checked=s.equipment[k];$('#baseLabel').textContent='Base '+(current==='masculine'?'masculine':'féminine');if(model)applyAppearance(model,s);render();}
function changed(){if(busy)return;sync();status('Rendu personnalisé · proposition à valider.');}
function download(blob,name){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
async function verifyAsset(url,hash){const response=await fetch(url);if(!response.ok)throw Error('Fichier inaccessible : '+url);const bytes=await response.arrayBuffer();const digest=await crypto.subtle.digest('SHA-256',bytes);const actual=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');if(actual!==hash)throw Error('Empreinte du fichier différente : '+url);return bytes;}
let referenceImage;
async function drawReference(){if(!referenceImage)return;const r=current==='masculine'?[12,183,237,537]:[258,187,202,533],c=$('#referenceCanvas');c.width=r[2];c.height=r[3];c.getContext('2d').drawImage(referenceImage,...r,0,0,r[2],r[3]);}
async function setBase(base){
  const id=++ticket;setBusy(true);document.body.dataset.ready='loading';$('#exportPng').disabled=true;$('#loading').hidden=false;$('#loading').textContent='Chargement du volume…';current=base;
  if(model){scene.remove(model);model=null;}sync();drawReference();
  try{
    if(!models.has(base)){
      const file='ryuu-'+base+'.glb';const bytes=await verifyAsset('models/'+file,manifest.files[file]);
      const gltf=await new GLTFLoader().parseAsync(bytes,'');
      const materials=new Map();const gradient=new THREE.DataTexture(new Uint8Array([95,158,208,255]),4,1,THREE.RedFormat);gradient.minFilter=gradient.magFilter=THREE.NearestFilter;gradient.needsUpdate=true;
      gltf.scene.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=false;
        const convert=m=>{if(!materials.has(m.uuid)){const next=new THREE.MeshToonMaterial({color:m.color,gradientMap:gradient});next.name=m.name;materials.set(m.uuid,next);}return materials.get(m.uuid);};
        o.material=Array.isArray(o.material)?o.material.map(convert):convert(o.material);
      });models.set(base,gltf.scene);
    }
    if(id!==ticket)return;model=models.get(base);scene.add(model);setBusy(false);sync();updateView();resize();$('#loading').hidden=true;$('#exportPng').disabled=false;document.body.dataset.ready='true';status('Ryuu '+(base==='masculine'?'masculin':'féminin')+' · vrai volume 3D, rendu à valider.');
  }catch(e){if(id!==ticket)return;$('#loading').textContent='Impossible de charger le modèle. '+e.message;status('Chargement interrompu : '+e.message);document.body.dataset.ready='error';}
}
for(const [k,label] of Object.entries(CHANNELS)){
  const row=document.createElement('div');row.className='color-row';row.innerHTML=`<label for="color-${k}">${label}</label><input id="color-${k}" type="color" value="${COLORS[k]}"><input id="hex-${k}" type="text" value="${COLORS[k]}" maxlength="7" aria-label="${label} en hexadécimal" spellcheck="false">`;$('#colors').append(row);
  row.querySelector('[type=color]').addEventListener('input',e=>{states[current].colors[k]=e.target.value.toUpperCase();changed();});
  row.querySelector('[type=text]').addEventListener('change',e=>{if(!/^#[\da-f]{6}$/i.test(e.target.value)){e.target.setCustomValidity('Utiliser # puis six chiffres hexadécimaux.');e.target.reportValidity();return;}e.target.setCustomValidity('');states[current].colors[k]=e.target.value.toUpperCase();changed();});
  row.querySelector('[type=text]').addEventListener('input',e=>{e.target.setCustomValidity('');if(/^#[\da-f]{6}$/i.test(e.target.value)){states[current].colors[k]=e.target.value.toUpperCase();$('#color-'+k).value=states[current].colors[k];if(model)applyAppearance(model,states[current]);render();status('Rendu personnalisé · proposition à valider.');}});
}
for(const [k,label] of Object.entries(EQUIPMENT)){const l=document.createElement('label');l.innerHTML=`<input id="equip-${k}" type="checkbox" checked>${label}`;$('#equipment').append(l);l.firstChild.addEventListener('change',e=>{states[current].equipment[k]=e.target.checked;changed();});}
$('#face').addEventListener('change',e=>{states[current].face_variant_id=e.target.value;changed();});
$('#hair').addEventListener('change',e=>{states[current].hair_variant_id=e.target.value;changed();});
document.querySelectorAll('[name=base]').forEach(el=>el.addEventListener('change',()=>setBase(el.value)));
$('#resetColors').addEventListener('click',()=>{states[current].colors={...COLORS};changed();});
$('#reset').addEventListener('click',()=>{rotating=false;controls.autoRotate=false;$('#rotate').setAttribute('aria-pressed','false');states[current]=defaults(current);changed();updateView();});
$('#save').addEventListener('click',save);
$('#compare').addEventListener('click',()=>{const visible=$('#compare').getAttribute('aria-pressed')!=='true';$('#compare').setAttribute('aria-pressed',String(visible));$('#compare').textContent=visible?'Référence visible':'Afficher la référence';$('#reference').hidden=!visible;$('#stages').classList.toggle('solo',!visible);resize();});
document.querySelectorAll('[data-angle]').forEach(el=>el.addEventListener('click',()=>{states[current].view.azimuth=Number(el.dataset.angle);updateView();}));
$('#angle').addEventListener('input',e=>{states[current].view.azimuth=Number(e.target.value);updateView();});
$('#zoom').addEventListener('input',e=>{states[current].view.zoom=Number(e.target.value);updateView();});
$('#rotate').addEventListener('click',()=>{rotating=!rotating;controls.autoRotate=rotating;$('#rotate').setAttribute('aria-pressed',String(rotating));});
$('#exportJson').addEventListener('click',()=>download(new Blob([JSON.stringify(states[current],null,2)+'\n'],{type:'application/json'}),'ryuu-'+current+'-3d.json'));
$('#importJson').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>16384)throw Error('Fichier trop volumineux.');const s=validate(JSON.parse(await file.text()));states[s.body_variant_id]=s;await setBase(s.body_variant_id);}catch(err){status('Import refusé : '+err.message);}finally{e.target.value='';}});
$('#exportPng').addEventListener('click',()=>{if(busy||!renderer)return;rotating=false;controls.autoRotate=false;$('#rotate').setAttribute('aria-pressed','false');render();renderer.domElement.toBlob(blob=>{if(blob){download(blob,'ryuu-'+current+'-3d.png');status('PNG exporté depuis les pixels de l’aperçu 3D.');}else status('Impossible de produire le PNG.');},'image/png');});

async function init(){try{
  restore();const response=await fetch('models/manifest.json');if(!response.ok)throw Error('Manifeste inaccessible.');manifest=await response.json();
  scene=new THREE.Scene();scene.background=new THREE.Color('#f4eee0');
  camera=new THREE.OrthographicCamera(-2,2,2.5,-2.5,.1,50);
  renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label','Modèle 3D de Ryuu. Les boutons et curseurs sous la vue permettent aussi de tourner et zoomer.');renderer.domElement.setAttribute('role','img');$('#viewport').append(renderer.domElement);
  controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.minPolarAngle=THREE.MathUtils.degToRad(25);controls.maxPolarAngle=THREE.MathUtils.degToRad(100);controls.minZoom=.7;controls.maxZoom=1.8;controls.autoRotateSpeed=1.5;
  controls.addEventListener('change',()=>{if(!camera)return;const s=states[current];s.view.azimuth=THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(controls.getAzimuthalAngle()),-180,180);s.view.elevation=THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(Math.PI/2-controls.getPolarAngle()),-10,65);s.view.zoom=THREE.MathUtils.clamp(camera.zoom,.7,1.8);$('#angle').value=s.view.azimuth;$('#zoom').value=s.view.zoom;render();});
  scene.add(new THREE.HemisphereLight(0xfff4dd,0x696477,2.4));
  const key=new THREE.DirectionalLight(0xfff6e7,1.6);key.position.set(-3,6,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-3,right:3,top:5,bottom:-1,near:.1,far:20});key.shadow.bias=-.0008;key.shadow.normalBias=.018;scene.add(key);
  const fill=new THREE.DirectionalLight(0xc7d8ef,.8);fill.position.set(4,3,-3);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.15}));ground.rotation.x=-Math.PI/2;ground.position.y=.035;ground.receiveShadow=true;scene.add(ground);
  new ResizeObserver(resize).observe($('#viewport'));resize();
  const bytes=await verifyAsset(manifest.source,manifest.source_sha256);referenceImage=await createImageBitmap(new Blob([bytes],{type:'image/png'}));
  await setBase(current);
  renderer.setAnimationLoop(()=>{if(rotating&&!busy){controls.update();render();}});
}catch(e){$('#loading').textContent='L’atelier 3D ne peut pas démarrer : '+e.message;status('Erreur : '+e.message);document.body.dataset.ready='error';}}
setBusy(true);
init();
