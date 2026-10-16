import {inspect,chooseDirection,setMode} from './studio.js';
import {loadView} from './directions.js';
import {paint} from './sprite.js';
const rows=[],check=(name,ok,detail)=>rows.push({name,pass:!!ok,...(detail===undefined?{}:{detail})}),$=s=>document.querySelector(s),pause=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
const key='project-tactics.ryuu-isometric.8.1',saved=localStorage.getItem(key),originalURL=URL.createObjectURL,originalClick=HTMLAnchorElement.prototype.click;
let blob;
async function capture(selector){blob=null;$(selector).click();for(let i=0;i<1000&&!blob;i++)await new Promise(r=>setTimeout(r,20));return blob;}
try{
 check('Atelier chargé',document.body.dataset.ready==='true');
 const views=inspect().views;check('Huit sources uniques, aucune vue miroir',views.length===8&&new Set(views.map(v=>v.sha256)).size===8);
 parent.document.querySelector('#report').textContent='Préparation des masques des huit directions…';
 const assets=await Promise.all(views.map(loadView));
 for(const a of assets){
  check(a.view.id+' : dimensions, empreinte et alpha',a.source.length===1254*1254*4&&a.source[3]===0&&a.bounds[0]>0&&a.bounds[1]>0&&a.bounds[2]<1254&&a.bounds[3]<1254);
  check(a.view.id+' : palette initiale fidèle',paint(a,a.defaults).every((v,i)=>v===a.source[i]));
  for(const ch of a.recipe.channels){const colors={...a.defaults,[ch.id]:'#00CCFF'},out=paint(a,colors);let count=0;for(let i=0;i<out.length;i+=4)if(out[i]!==a.source[i]||out[i+1]!==a.source[i+1]||out[i+2]!==a.source[i+2])count++;check(a.view.id+' / '+ch.id+' : zone active',count>100,count);}
  for(const color of ['#000000','#FFFFFF','#00FFFF']){const out=paint(a,Object.fromEntries(a.recipe.channels.map(c=>[c.id,color])));const failed=a.recipe.equipment_samples.filter(([x,y])=>{const p=(y*1254+x)*4;return !a.source[p+3]||[0,1,2,3].some(i=>out[p+i]!==a.source[p+i]);});check(a.view.id+' / '+color+' : équipements fixes',failed.length===0,failed);check(a.view.id+' / '+color+' : alpha conservé',a.source.every((v,i)=>i%4!==3||out[i]===v));}
 }
 $('[aria-label="Nuit et jade"]').click();const colors=JSON.stringify(inspect().colors);
 URL.createObjectURL=b=>{blob=b;return originalURL.call(URL,b);};HTMLAnchorElement.prototype.click=function(){};
 let previous;
 for(const v of views){
  $('[data-direction="'+v.id+'"]').click();for(let i=0;i<200&&document.body.dataset.busy==='true';i++)await new Promise(r=>setTimeout(r,20));await pause();const a=inspect();
  check(v.id+' : commande sélectionne la bonne vue et conserve la palette',a.current===v.id&&JSON.stringify(a.colors)===colors&&$('[data-direction="'+v.id+'"]').getAttribute('aria-pressed')==='true');
  const b=await capture('#export');if(!b){check(v.id+' : export disponible',false);continue;}
  const bm=await createImageBitmap(b),c=document.createElement('canvas'),expected=document.createElement('canvas');c.width=expected.width=1254;c.height=expected.height=1254;c.getContext('2d').drawImage(bm,0,0);expected.getContext('2d').putImageData(new ImageData(a.pixels,1254,1254),0,0);const actual=c.getContext('2d').getImageData(0,0,1254,1254).data,e=expected.getContext('2d').getImageData(0,0,1254,1254).data;
  check(v.id+' : PNG transparent identique à la vue personnalisée',bm.width===1254&&bm.height===1254&&actual[3]===0&&e.every((x,i)=>x===actual[i]));const signature=c.toDataURL();check(v.id+' : direction distincte dans le PNG',signature!==previous);previous=signature;bm.close();
 }
 $('#masks').checked=true;$('#masks').dispatchEvent(new Event('change'));const preview=await capture('#export');check('PNG normal exportable avec masque de contrôle affiché',preview?.type==='image/png');$('#masks').checked=false;$('#masks').dispatchEvent(new Event('change'));
 await Promise.all([chooseDirection('n'),chooseDirection('s')]);check('Sélections rapides : la dernière gagne',inspect().current==='s'&&document.body.dataset.busy==='false');
 $('#directions').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await pause();check('Flèche clavier : direction suivante',inspect().current==='sw');
 await setMode('all');check('Planche : les huit vues visibles',inspect().mode==='all');
 const atlas=await capture('#exportAll');if(atlas){const bm=await createImageBitmap(atlas),c=document.createElement('canvas');c.width=bm.width;c.height=bm.height;c.getContext('2d').drawImage(bm,0,0);check('Planche PNG transparente 3072 × 2560',bm.width===3072&&bm.height===2560&&c.getContext('2d').getImageData(0,0,1,1).data[3]===0);let occupied=0;for(let i=0;i<8;i++){const px=c.getContext('2d').getImageData((i%4)*768,Math.floor(i/4)*1280,768,1280).data;if(px.some((v,j)=>j%4===3&&v>0))occupied++;}check('Les huit cellules de la planche contiennent un sprite',occupied===8);bm.close();}else check('Export de la planche disponible',false);
 $('#save').click();const stored=JSON.parse(localStorage.getItem(key));check('Sauvegarde palette et orientation',stored.version===2&&stored.direction===inspect().current&&JSON.stringify(stored.colors)===JSON.stringify(inspect().colors));
 for(const w of [400,640,900]){parent.document.querySelector('iframe').width=w;await pause();check('Aucun débordement à '+w+' px',document.documentElement.scrollWidth<=innerWidth+1);}
}catch(e){check('Exception : '+e.message,false);}
finally{URL.createObjectURL=originalURL;HTMLAnchorElement.prototype.click=originalClick;if(saved===null)localStorage.removeItem(key);else localStorage.setItem(key,saved);parent.document.querySelector('iframe').width=1100;parent.postMessage({isoChecks:{pass:rows.filter(r=>r.pass).length,fail:rows.filter(r=>!r.pass).length,rows}},location.origin);}
