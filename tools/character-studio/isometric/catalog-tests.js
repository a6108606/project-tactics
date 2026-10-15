import {loadView} from './directions.js';
import {paint} from './sprite.js';
import {inspect,chooseEntity,chooseDirection,setMode} from './studio.js';
const rows=[],check=(name,pass,detail)=>rows.push({name,pass:!!pass,...detail===undefined?{}:{detail}}),$=s=>document.querySelector(s),sleep=ms=>new Promise(r=>setTimeout(r,ms));
const savedCreate=URL.createObjectURL,savedClick=HTMLAnchorElement.prototype.click;let blob,filename;
async function capture(id){blob=null;$(id).click();for(let i=0;i<1000&&!blob;i++)await sleep(20);if(!blob)throw Error('Export absent '+id);return blob;}
try{
 const entries=inspect().catalogue.entries.filter(e=>e.status==='ready');
 URL.createObjectURL=b=>{blob=b;return savedCreate.call(URL,b);};HTMLAnchorElement.prototype.click=function(){filename=this.download;};
 for(const e of entries){
  parent.document.querySelector('#report').textContent='Vérification : '+e.name;
  await chooseEntity(e.id);let a=inspect();check(e.id+' selected source',a.entity.id===e.id&&a.view.id==='se'&&$('#entityName').textContent===e.name);
  const first=a.recipe.channels[0];$('#hex-'+first.id).value='#E044A0';$('#hex-'+first.id).dispatchEvent(new Event('input',{bubbles:true}));const colors=JSON.stringify(inspect().colors);
  await chooseDirection('nw');a=inspect();check(e.id+' palette follows orientation',a.current==='nw'&&JSON.stringify(a.colors)===colors);
  const data=await capture('#export'),bm=await createImageBitmap(data),c=document.createElement('canvas'),expected=document.createElement('canvas');c.width=expected.width=a.width;c.height=expected.height=a.height;c.getContext('2d').drawImage(bm,0,0);expected.getContext('2d').putImageData(new ImageData(a.pixels,a.width,a.height),0,0);const actual=c.getContext('2d').getImageData(0,0,a.width,a.height).data,ex=expected.getContext('2d').getImageData(0,0,a.width,a.height).data;
  check(e.id+' exported PNG matches customized pixels',bm.width===a.width&&bm.height===a.height&&actual[3]===0&&actual.every((v,i)=>v===ex[i]));bm.close();
  await setMode('all');check(e.id+' eight view mode available',inspect().mode==='all'&&document.body.dataset.busy==='false');
 }
 await chooseEntity('plumet-des-mousses');
 const initial=inspect(),first=initial.recipe.channels[0];$('#hex-'+first.id).value='#D060E0';$('#hex-'+first.id).dispatchEvent(new Event('input',{bubbles:true}));const snapshot=inspect();
 const exporting=capture('#exportAll');await chooseEntity('boss-gardien');const sheet=await exporting,bm=await createImageBitmap(sheet),out=document.createElement('canvas');out.width=3072;out.height=2560;const context=out.getContext('2d');
 const assets=await Promise.all(snapshot.views.map(loadView));assets.forEach((a,i)=>{const c=document.createElement('canvas');c.width=a.width;c.height=a.height;c.getContext('2d').putImageData(new ImageData(paint(a,snapshot.colors),a.width,a.height),0,0);const scale=1100/a.view.displayHeight;context.drawImage(c,384+(i%4)*768-a.recipe.anchor[0]*scale,1160+Math.floor(i/4)*1280-a.recipe.anchor[1]*scale,a.width*scale,a.height*scale);});
 const expected=context.getImageData(0,0,3072,2560).data;context.clearRect(0,0,3072,2560);context.drawImage(bm,0,0);const actual=context.getImageData(0,0,3072,2560).data;
 check('Atlas export retains original entity and palette during selection',filename==='plumet-des-mousses-isometrique-8-directions.png'&&bm.width===3072&&bm.height===2560&&actual.every((v,i)=>v===expected[i]));bm.close();
 const ready=entries.map(e=>e.id);await Promise.all(ready.slice(-3).map(chooseEntity));check('Rapid entity selection keeps last request',inspect().entity.id===ready.at(-1));
 for(const category of ['heroes','bestiary','summons','legacy']){$('#category').value=category;$('#category').dispatchEvent(new Event('change'));check('Filter '+category,$('#gallery').children.length===inspect().catalogue.entries.filter(e=>e.category===category).length);}
 $('#category').value='all';$('#category').dispatchEvent(new Event('change'));$('#search').value='Plumet';$('#search').dispatchEvent(new Event('input'));check('Search name and family',Array.from($('#gallery').children).every(b=>b.textContent.includes('Plumet'))&&$('#gallery').children.length===5);
 for(const w of [400,640,900]){parent.document.querySelector('iframe').width=w;await sleep(50);check('No horizontal overflow '+w,document.documentElement.scrollWidth<=innerWidth+1);}
}catch(e){check('Exception '+e.message,false);}
finally{URL.createObjectURL=savedCreate;HTMLAnchorElement.prototype.click=savedClick;parent.postMessage({catalogChecks:{pass:rows.filter(r=>r.pass).length,fail:rows.filter(r=>!r.pass).length,rows}},location.origin);}
