import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {defaults,validate,CHANNELS,EQUIPMENT,applyAppearance} from '../appearance.js';
const root=new URL('../',import.meta.url),results=[];
function check(name,fn){fn();results.push({name,status:'PASS'});}
const manifest=JSON.parse(await readFile(new URL('models/manifest.json',root)));
for(const [file,hash] of Object.entries(manifest.files)){
  const bytes=await readFile(new URL('models/'+file,root));
  check('SHA-256 '+file,()=>assert.equal(createHash('sha256').update(bytes).digest('hex'),hash));
}
for(const base of manifest.bases){
  const b=await readFile(new URL('models/ryuu-'+base+'.glb',root));
  assert.equal(b.toString('ascii',0,4),'glTF');assert.equal(b.readUInt32LE(4),2);assert.equal(b.readUInt32LE(8),b.length);
  const g=JSON.parse(b.subarray(20,20+b.readUInt32LE(12)).toString());
  const binStart=20+b.readUInt32LE(12)+8,bin=b.subarray(binStart);
  const nodes=new Map(g.nodes.map(n=>[n.name,n]));
  for(const family of ['face','hair'])for(const id of family==='face'?manifest.faces:manifest.hair)check(base+' / '+family+'_'+id,()=>assert(nodes.get(family+'_'+id)?.children?.length>0));
  for(const k of Object.keys(EQUIPMENT)){
    const equipment=nodes.get('equip_'+k);check(base+' / equipment '+k,()=>assert(equipment?.children?.length));
    const visit=index=>{const n=g.nodes[index];if(n.mesh!==undefined)for(const p of g.meshes[n.mesh].primitives)assert(g.materials[p.material].name.startsWith('fixed_'));for(const ch of n.children||[])visit(ch);};
    check(base+' / fixed materials '+k,()=>equipment.children.forEach(visit));
  }
  check(base+' / five semantic materials',()=>assert.deepEqual(g.materials.filter(m=>m.name.startsWith('base_')).map(m=>m.name).sort(),Object.keys(CHANNELS).map(k=>'base_'+k).sort()));
  const positions=[];for(const m of g.meshes)for(const p of m.primitives){const a=g.accessors[p.attributes.POSITION],v=g.bufferViews[a.bufferView];assert.equal(a.componentType,5126);assert.equal(a.type,'VEC3');for(let i=0;i<a.count;i++){const offset=(v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||12);positions.push([0,4,8].map(d=>bin.readFloatLE(offset+d)));}}
  check(base+' / finite 3D geometry',()=>assert(positions.length>1000 && positions.every(p=>p.every(Number.isFinite))));
  check(base+' / actual depth, not an image plane',()=>{const zs=positions.map(p=>p[2]);assert(Math.max(...zs)-Math.min(...zs)>.4);assert.equal(g.images,undefined);});
  check(base+' / different face geometry',()=>assert.notDeepEqual(nodes.get('face_soft').children,nodes.get('face_angular').children));
  check(base+' / round trip',()=>assert.deepEqual(validate(JSON.parse(JSON.stringify(defaults(base)))),defaults(base)));
}
for(const mutation of [s=>s.colors.skin='red',s=>s.colors.hair='#FFF',s=>s.view.zoom=Infinity,s=>s.view.azimuth=181,s=>s.equipment.dagger='false',s=>s.character_id='sela',s=>s.hair_variant_id='unknown',s=>s.asset_version='other',s=>delete s.colors]){
  const s=defaults();mutation(s);check('reject invalid state '+results.length,()=>assert.throws(()=>validate(s)));
}
check('malicious extra fields discarded',()=>{const s={...defaults(),url:'https://invalid.example/model.glb',script:'no'};assert.deepEqual(validate(s),defaults());});
check('independent base defaults',()=>{const a=defaults(),b=defaults('feminine');a.colors.hair='#123456';a.equipment.dagger=false;assert.notEqual(a.colors.hair,b.colors.hair);assert(b.equipment.dagger);});
const report={scope:'Asset integrity, genuine volume, material partition and appearance validation',passed:results.length,failed:0,results};
await writeFile(new URL('asset-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(`${results.length} PASS, 0 FAIL`);
