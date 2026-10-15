import {inspect} from './studio.js';
import {paint} from './sprite.js';
const rows=[],check=(name,ok,detail)=>rows.push({name,pass:!!ok,...(detail===undefined?{}:{detail})}),$=s=>document.querySelector(s);
const pause=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
const key='project-tactics.ryuu-isometric.se.1',saved=localStorage.getItem(key),originalURL=URL.createObjectURL,originalClick=HTMLAnchorElement.prototype.click;
try{
 check('Chargement, dimensions et SHA-256 du sprite',document.body.dataset.ready==='true');
 $('#reset').click();const a=inspect();
 check('Palette initiale : pixels du sprite conservés',a.source.every((v,i)=>v===a.pixels[i]));
 check('Fond transparent et silhouette entière dans le cadre',a.source[3]===0&&a.bounds[0]>0&&a.bounds[1]>0&&a.bounds[2]<1254&&a.bounds[3]<1254,a.bounds);
 for(const ch of a.recipe.channels){
  const field=$('#color-'+ch.id);field.value='#00ccff';field.dispatchEvent(new Event('input'));await pause();const changed=inspect();let count=0;for(let p=0;p<a.source.length;p+=4)if(changed.pixels[p]!==a.source[p]||changed.pixels[p+1]!==a.source[p+1]||changed.pixels[p+2]!==a.source[p+2])count++;
  check(ch.id+' : changement effectif via le contrôle',count>100,{changedPixels:count});
  $('#reset').click();
 }
 for(const color of ['#000000','#FFFFFF','#00FFFF']){
  const colors=Object.fromEntries(a.recipe.channels.map(c=>[c.id,color])),out=paint(a,colors);
  check(color+' : équipements inchangés',a.recipe.equipment_samples.every(([x,y])=>{const p=(y*1254+x)*4;return a.source[p+3]>0&&[0,1,2,3].every(i=>out[p+i]===a.source[p+i]);}));
  check(color+' : alpha et zones hors masque inchangés',a.source.every((v,i)=>i%4===3?out[i]===v:(Object.values(a.masks).every(m=>m[Math.floor(i/4)]===0)?out[i]===v:true)));
 }
 const facePoints=[[640,370],[747,390],[680,425]],out=paint(a,Object.fromEntries(a.recipe.channels.map(c=>[c.id,'#00FFFF'])));
 check('Iris et dents protégés',facePoints.every(([x,y])=>[0,1,2,3].every(c=>out[(y*1254+x)*4+c]===a.source[(y*1254+x)*4+c])));
 // Exercise the real export with recolouring and mask preview active.
 $('[aria-label="Nuit et jade"]').click();$('#masks').checked=true;$('#masks').dispatchEvent(new Event('change'));
 let blob;URL.createObjectURL=b=>{blob=b;return originalURL.call(URL,b);};HTMLAnchorElement.prototype.click=function(){};
 $('#export').click();for(let i=0;i<100&&!blob;i++)await new Promise(r=>setTimeout(r,20));
 check('Bouton Exporter : fichier PNG',blob?.type==='image/png');
 if(blob){const bitmap=await createImageBitmap(blob),expected=document.createElement('canvas'),actual=document.createElement('canvas');expected.width=actual.width=bitmap.width;expected.height=actual.height=bitmap.height;expected.getContext('2d').putImageData(new ImageData(inspect().pixels,1254,1254),0,0);actual.getContext('2d').drawImage(bitmap,0,0);const e=expected.getContext('2d').getImageData(0,0,1254,1254).data,o=actual.getContext('2d').getImageData(0,0,1254,1254).data;check('PNG 1254² transparent, personnalisé, sans grille ni surimpression',bitmap.width===1254&&bitmap.height===1254&&o[3]===0&&e.every((v,i)=>v===o[i]));bitmap.close();}
 URL.createObjectURL=originalURL;HTMLAnchorElement.prototype.click=originalClick;
 $('#save').click();const stored=JSON.parse(localStorage.getItem(key));check('Enregistrement des cinq couleurs',stored?.recipe===a.recipe.id&&JSON.stringify(stored.colors)===JSON.stringify(inspect().colors));
 $('#masks').checked=false;$('#masks').dispatchEvent(new Event('change'));$('#reset').click();
 const canvas=$('#scene'),before=canvas.toDataURL();$('[data-mode="compare"]').click();check('Comparaison : référence originale visible',canvas.toDataURL()!==before);
 $('#gameSize').click();check('Taille de jeu activée',Number($('#scale').value)===160&&$('#gameSize').getAttribute('aria-pressed')==='true');
 for(const w of [400,640,900]){parent.document.querySelector('iframe').width=w;await pause();check('Sans débordement horizontal à '+w+' px',document.documentElement.scrollWidth<=innerWidth+1);}
}catch(e){check('Exception : '+e.message,false);}
finally{URL.createObjectURL=originalURL;HTMLAnchorElement.prototype.click=originalClick;if(saved===null)localStorage.removeItem(key);else localStorage.setItem(key,saved);parent.document.querySelector('iframe').width=1100;parent.postMessage({isoChecks:{pass:rows.filter(r=>r.pass).length,fail:rows.filter(r=>!r.pass).length,rows}},location.origin);}
