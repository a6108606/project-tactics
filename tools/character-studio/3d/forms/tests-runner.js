import {inspect} from './viewer.js';
const rows=[],check=(name,ok)=>rows.push({name,pass:!!ok}),$=s=>document.querySelector(s);
const pause=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
const canvas=$('#viewport canvas'),snap=()=>canvas.toDataURL();
const key='project-tactics.ryuu-forms.1',saved=localStorage.getItem(key);
const equipment=['leather','bandana','sash'];
const fixed=()=>JSON.stringify(inspect().materials.filter(m=>m.name.startsWith('fixed_')));
const originalURL=URL.createObjectURL,originalClick=HTMLAnchorElement.prototype.click;
try{
 check('GLB chargé et empreinte vérifiée',document.body.dataset.ready==='true');
 $('#reset').click();for(const k of equipment){const el=$('#equip-'+k);el.checked=true;el.dispatchEvent(new Event('change'));}
 await pause();const fixedStart=fixed();
 for(const k of ['skin','hair','clothing1','clothing2','clothing3']){
   const before=snap(),el=$('#color-'+k);el.value='#00ccbb';el.dispatchEvent(new Event('input'));await pause();
   check(k+' change les pixels',before!==snap());
   check(k+' ne recolore aucun matériau fixe',fixedStart===fixed());
   $('#reset').click();await pause();
 }
 for(const k of equipment){const before=snap(),el=$('#equip-'+k);el.checked=false;el.dispatchEvent(new Event('change'));await pause();check(k+' retrait visible',before!==snap());el.checked=true;el.dispatchEvent(new Event('change'));await pause();}
 let previous=snap();for(const a of [0,90,180,-25]){$('[data-angle="'+a+'"]').click();await pause();const now=snap();check('Vue '+a+' change le rendu',now!==previous);previous=now;}
 // Exact decode of the PNG produced by the real export button.
 let blob;URL.createObjectURL=b=>{blob=b;return originalURL.call(URL,b);};HTMLAnchorElement.prototype.click=function(){};
 const reference=document.createElement('canvas');reference.width=canvas.width;reference.height=canvas.height;reference.getContext('2d').drawImage(canvas,0,0);
 $('#png').click();for(let i=0;i<50&&!blob;i++)await new Promise(r=>setTimeout(r,20));
 check('Le bouton Exporter PNG produit un PNG',blob?.type==='image/png');
 if(blob){const bitmap=await createImageBitmap(blob);const c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;c.getContext('2d').drawImage(bitmap,0,0);const a=reference.getContext('2d').getImageData(0,0,c.width,c.height).data,b=c.getContext('2d').getImageData(0,0,c.width,c.height).data;check('PNG décodé identique aux pixels affichés',a.length===b.length&&a.every((v,i)=>v===b[i]));bitmap.close();}
 URL.createObjectURL=originalURL;HTMLAnchorElement.prototype.click=originalClick;
 $('#save').click();const stored=JSON.parse(localStorage.getItem(key));check('Enregistrement des couleurs et équipements',JSON.stringify(stored)===JSON.stringify(inspect().state));
 $('#referenceChoice').value='target';$('#referenceChoice').dispatchEvent(new Event('change'));await $('#reference').decode();check('Cible Imagegen distincte de la géométrie',/target\.png$/.test($('#reference').src)&&$('#reference').naturalWidth>0);
 for(const w of [400,640]){parent.document.querySelector('iframe').width=w;await pause();check('Sans débordement à '+w+' px',document.documentElement.scrollWidth<=innerWidth+1);}
}catch(e){check('Exception : '+e.message,false);}
finally{URL.createObjectURL=originalURL;HTMLAnchorElement.prototype.click=originalClick;if(saved===null)localStorage.removeItem(key);else localStorage.setItem(key,saved);parent.document.querySelector('iframe').width=1100;parent.postMessage({ryuuChecks:{pass:rows.filter(r=>r.pass).length,fail:rows.filter(r=>!r.pass).length,rows}},location.origin);}
