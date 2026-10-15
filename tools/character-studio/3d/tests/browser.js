import * as THREE from 'three';
import {GLTFLoader} from '../vendor/GLTFLoader.js';
import {defaults,applyAppearance,CHANNELS,EQUIPMENT} from '../appearance.js';
const out=document.querySelector('#results');let passed=0,failed=0;
function check(name,ok){const li=document.createElement('li');li.textContent=(ok?'PASS':'FAIL')+' · '+name;out.append(li);ok?passed++:failed++;if(!ok)console.error(name);}
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(320,480);document.body.append(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#f4eee0');scene.add(new THREE.HemisphereLight(0xffffff,0x797684,3));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(-3,5,5);scene.add(light);
const camera=new THREE.OrthographicCamera(-1.66,1.66,2.5,-2.5,.1,30);camera.position.set(4,4,10);camera.lookAt(0,2.1,0);
const hash=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
function pixels(canvas){const c=document.createElement('canvas');c.width=canvas.width;c.height=canvas.height;const ctx=c.getContext('2d');ctx.drawImage(canvas,0,0);return ctx.getImageData(0,0,c.width,c.height).data;}
async function renderHash(root,s){applyAppearance(root,s);renderer.render(scene,camera);return hash(pixels(renderer.domElement));}
function fixedColors(root){const colors={};root.traverse(o=>{if(o.isMesh){for(const m of Array.isArray(o.material)?o.material:[o.material])if(m.name.startsWith('fixed_'))colors[m.name]=m.color.getHexString();}});return JSON.stringify(colors);}
try{
for(const base of ['masculine','feminine']){
 const {scene:root}=await new GLTFLoader().loadAsync('../models/ryuu-'+base+'.glb');scene.add(root);const state=defaults(base),before=await renderHash(root,state),equipment=fixedColors(root);
 for(const key of Object.keys(CHANNELS))for(const color of ['#00FFFF','#20101B','#FFFFFF']){
  const s=defaults(base);s.colors[key]=color;
  check(base+' / visible '+key+' '+color,await renderHash(root,s)!==before);
  check(base+' / equipment color isolation '+key+' '+color,fixedColors(root)===equipment);
 }
 for(const [key,id] of [['face_variant_id','angular'],['hair_variant_id','swept']]){const s=defaults(base);s[key]=id;check(base+' / different visible geometry '+key,await renderHash(root,s)!==before);}
 for(const key of Object.keys(EQUIPMENT)){const s=defaults(base);s.equipment[key]=false;await renderHash(root,s);check(base+' / equipment visibility '+key,root.getObjectByName('equip_'+key).visible===false);}
 const s=defaults(base);s.colors.hair='#542E77';s.colors.skin='#80431D';s.hair_variant_id='swept';const shown=await renderHash(root,s);
 const blob=await new Promise(resolve=>renderer.domElement.toBlob(resolve,'image/png'));const bitmap=await createImageBitmap(blob);const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;c.getContext('2d').drawImage(bitmap,0,0);
 check(base+' / decoded PNG equals displayed pixels',await hash(c.getContext('2d').getImageData(0,0,c.width,c.height).data)===shown);
 check(base+' / reset returns identical pixels',await renderHash(root,defaults(base))===before);
 camera.position.set(0,4,-10);camera.lookAt(0,2.1,0);check(base+' / back is a different rendered volume',await renderHash(root,state)!==before);camera.position.set(4,4,10);camera.lookAt(0,2.1,0);scene.remove(root);
}
// Exercise the real application's controls and renderer as well as the GLB contract.
const storageKey='project-tactics.ryuu-3d-study.1', prior=localStorage.getItem(storageKey);
const frame=document.createElement('iframe');frame.width='1100';frame.height='850';frame.title='Application réelle sous test';document.body.append(frame);
const waitReady=()=>new Promise((resolve,reject)=>{const start=performance.now();function poll(){if(frame.contentDocument?.body?.dataset.ready==='true')resolve();else if(performance.now()-start>20000)reject(Error('Application not ready'));else setTimeout(poll,100);}poll();});
try{
 localStorage.removeItem(storageKey);frame.src='../';await waitReady();let d=frame.contentDocument;
 const canvas=()=>frame.contentDocument.querySelector('#viewport canvas');
 const first=await hash(pixels(canvas()));
 for(const [k,color] of [['skin','#80431D'],['hair','#542E77'],['clothing1','#247E7A']]){const input=d.querySelector('#hex-'+k);input.value=color;input.dispatchEvent(new Event('input',{bubbles:true}));}
 const face=d.querySelector('#face');face.value='angular';face.dispatchEvent(new Event('change',{bubbles:true}));
 const cut=d.querySelector('#hair');cut.value='swept';cut.dispatchEvent(new Event('change',{bubbles:true}));
 const painted=await hash(pixels(canvas()));check('Real UI / hex input changes actual framebuffer',painted!==first);
 d.querySelector('#save').click();
 const saved=JSON.parse(localStorage.getItem(storageKey));check('Real UI / saves edited colors and variants',saved.states.masculine.colors.skin==='#80431D'&&saved.states.masculine.colors.hair==='#542E77'&&saved.states.masculine.face_variant_id==='angular');
 frame.src='../?reload-test=1';await new Promise(resolve=>frame.addEventListener('load',resolve,{once:true}));await waitReady();d=frame.contentDocument;
 check('Real UI / restores color fields',d.querySelector('#hex-skin').value==='#80431D'&&d.querySelector('#hex-hair').value==='#542E77');
 check('Real UI / restores identical framebuffer',await hash(pixels(canvas()))===painted);
 const blob=await new Promise(resolve=>canvas().toBlob(resolve,'image/png')),bitmap=await createImageBitmap(blob),copy=document.createElement('canvas');copy.width=bitmap.width;copy.height=bitmap.height;copy.getContext('2d').drawImage(bitmap,0,0);
 check('Real UI / PNG preserves toon framebuffer RGBA',await hash(copy.getContext('2d').getImageData(0,0,copy.width,copy.height).data)===painted);
 d.querySelector('#reset').click();check('Real UI / reset restores canonical framebuffer',await hash(pixels(canvas()))===first);
 const invalid=d.querySelector('#hex-skin');invalid.value='invalid';invalid.dispatchEvent(new Event('change',{bubbles:true}));check('Real UI / rejects malformed hex',!invalid.validity.valid);
 for(const width of [640,400]){frame.width=String(width);await new Promise(resolve=>setTimeout(resolve,250));check('Real UI / no horizontal overflow at '+width,d.documentElement.scrollWidth<=frame.contentWindow.innerWidth);check('Real UI / keyboard zoom visible at '+width,frame.contentWindow.getComputedStyle(d.querySelector('.zoom-label')).display!=='none');}
}finally{if(prior===null)localStorage.removeItem(storageKey);else localStorage.setItem(storageKey,prior);frame.remove();}
}catch(e){check('Exception: '+e.message,false);}
document.querySelector('#summary').textContent=`${passed} PASS · ${failed} FAIL`;document.body.dataset.complete='true';document.body.dataset.failed=String(failed);
