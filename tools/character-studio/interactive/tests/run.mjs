import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {runChecks,PROOF_COLORS,same} from './checks.js';
import {decode,encode,crop} from './png.mjs';
import {rectPixels} from '../geometry.js';
import {createMasks,RYUU,CHANNELS,MASK_VERSION} from '../masks.js';
import {recolor,maskPreview} from '../render.js';
const root=new URL('../../../../',import.meta.url),references=JSON.parse(await readFile(new URL('../assets/references.json',import.meta.url))).sources;
const sourceRoot=new URL('content/art/characters/reference-v2/',root),ryuu=references.find(x=>x.id==='ryuu');
const source=decode(await readFile(new URL(ryuu.original_png_file,sourceRoot))),samples=['masculine','feminine'].map(base=>{const box=rectPixels(ryuu,ryuu[base]);return {base,box,...crop(source,box)};});
const results=runChecks(references,samples),hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const h of references)results.push({label:h.name+' : SHA-256 original',pass:hash(await readFile(new URL(h.original_png_file,sourceRoot)))===h.sha256});
const out=new URL('docs/art/evidence/ryuu-pilot/',root);await mkdir(out,{recursive:true});
const manifest={schema:'project-tactics/visible-mask-assets',version:MASK_VERSION,status:'technical-pilot-awaiting-art-review',source_sha256:ryuu.sha256,assets:[],derivation_files:{}};
for(const name of ['masks.js','render.js','geometry.js','catalog.js','assets/recipes.js','../pipeline/mask-engine.js'])manifest.derivation_files[name]=hash(await readFile(new URL('../'+name,import.meta.url)));
for(const sample of samples){const {base,box,width,height,data}=sample,masks=createMasks(data,box,base),custom=recolor(data,masks,RYUU[base].colors,PROOF_COLORS);
  const anchor=RYUU[base].anchor.map((v,i)=>v-box[i]);
  for(const [layer,bytes] of [['canonical',data],['custom',custom],['zones',maskPreview(data,masks)]]){
    const name=`ryuu-${base}-${layer}.png`,png=encode(width,height,bytes);await writeFile(new URL(name,out),png);
    results.push({label:base+' : PNG '+layer+' RGBA round-trip',pass:same(decode(png).data,bytes)});
    manifest.assets.push({id:`ryuu-${base}-${layer}`,character_id:'ryuu',body_variant_id:base,view_id:'main',dimensions:[width,height],source_crop_xywh:box,anchor_px:anchor,layer,origin:'approved-source-visible-pixels',path:'docs/art/evidence/ryuu-pilot/'+name,sha256:hash(png),status:layer==='canonical'?'pixel-identical-crop':'technical-pilot-awaiting-art-review'});
  }
  for(const channel of CHANNELS){const name=`ryuu-${base}-mask-${channel}.png`,rgba=new Uint8ClampedArray(width*height*4);masks[channel].forEach((v,i)=>rgba.set([255,255,255,v],i*4));const png=encode(width,height,rgba);await writeFile(new URL(name,out),png);
    manifest.assets.push({id:`ryuu-${base}-${channel}`,character_id:'ryuu',body_variant_id:base,view_id:'main',dimensions:[width,height],source_crop_xywh:box,anchor_px:anchor,layer:channel,origin:'manual-semantic-regions-with-local-material-gates',path:'docs/art/evidence/ryuu-pilot/'+name,sha256:hash(png),status:'technical-pilot-awaiting-art-review'});
  }
}
await writeFile(new URL('../assets/manifest.json',import.meta.url),JSON.stringify(manifest,null,2)+'\n');
const report={schema:'project-tactics/ryuu-pilot-test-report',passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,limitations:['No modular face/hair/equipment layers','Equipment samples and unmasked pixels checked; no complete semantic equipment matte','No aesthetic approval implied'],results};
await writeFile(new URL('test-report.json',out),JSON.stringify(report,null,2)+'\n');
for(const r of results)if(!r.pass)console.error('FAIL '+r.label+': '+r.error);
console.log(`${report.passed} PASS / ${report.failed} FAIL — ${fileURLToPath(out)}`);if(report.failed)process.exitCode=1;
