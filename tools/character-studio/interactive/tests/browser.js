import {runChecks,PROOF_COLORS,same} from './checks.js';
import {rectPixels} from '../geometry.js';
import {RYUU,createMasks} from '../masks.js';
import {recolor} from '../render.js';
async function load(url){const i=new Image();i.src=url;await i.decode();return i;}
function canvas(width,height,data){const c=document.createElement('canvas');c.width=width;c.height=height;if(data)c.getContext('2d').putImageData(new ImageData(data,width,height),0,0);return c;}
try{
  const references=(await (await fetch('../assets/references.json')).json()).sources,h=references.find(h=>h.id==='ryuu');
  const im=await load('../../../../content/art/characters/reference-v2/'+h.original_png_file),samples=['masculine','feminine'].map(base=>{const box=rectPixels(h,h[base]),[x,y,width,height]=box,c=canvas(width,height);c.getContext('2d').drawImage(im,x,y,width,height,0,0,width,height);return {base,box,width,height,data:c.getContext('2d').getImageData(0,0,width,height).data};});
  const results=runChecks(references,samples);
  for(const {base,box,width,height,data} of samples){
    const pixels=recolor(data,createMasks(data,box,base),RYUU[base].colors,PROOF_COLORS),c=canvas(width,height,pixels);
    c.setAttribute('aria-label','Preuve '+base);document.querySelector('#proofs').append(c);
    const png=await new Promise(resolve=>c.toBlob(resolve,'image/png')),url=URL.createObjectURL(png),image=await load(url),read=canvas(width,height);read.getContext('2d').drawImage(image,0,0);URL.revokeObjectURL(url);
    results.push({label:base+' : export Canvas PNG décodé identique au rendu RGBA',pass:same(pixels,read.getContext('2d').getImageData(0,0,width,height).data)});
  }
  for(const r of results){const li=document.createElement('li');li.textContent=(r.pass?'PASS — ':'FAIL — ')+r.label+(r.error?' : '+r.error:'');if(!r.pass)li.className='fail';document.querySelector('#results').append(li);}
  const failed=results.filter(r=>!r.pass).length;document.querySelector('#summary').textContent=`${results.length-failed} PASS / ${failed} FAIL`;document.body.dataset.result=failed?'fail':'pass';
}catch(e){document.querySelector('#summary').textContent='ÉCHEC — '+e.message;document.body.dataset.result='fail';}
