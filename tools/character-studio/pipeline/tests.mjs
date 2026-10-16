import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateRecipe} from './recipe.js';
import {createRecipeMasks,recipeColors} from './mask-engine.js';
import {recolor} from '../interactive/render.js';
import {History} from '../interactive/history.js';
import {isHeroCompatible} from '../interactive/catalog.js';
import {inspectRecipe,loadRecipes,outputsFor,writeOutputs,digest} from './batch.mjs';
import {encode,decode} from './png.mjs';
const reference=JSON.parse(await readFile(new URL('../recipes/ryuu-masculine.json',import.meta.url)));
const flat=()=>{const r=structuredClone(reference);Object.assign(r,{id:'fixture-default',entity_id:'fixture',kind:'monster',base_id:'default',name:'Technical fixture, not artwork',status:'draft',source:{...r.source,size:[8,8]},crop:[0,0,8,8],anchor:[4,7],channels:[{id:'shell',label:'Carapace',region_label:'Surface de test',color:'#808080',selection:{mode:'polygon',include:[[[0,0],[7,0],[7,7],[0,7]]],exclude:[]},material:{}}],priority:['shell'],protected:[],equipment_samples:[]});return r;};
const pixels=()=>new Uint8ClampedArray(Array.from({length:64},()=>[128,128,128,255]).flat());
test('Monster with one arbitrary base and channel uses the same assembler',()=>{const r=validateRecipe(flat()),source=pixels(),m=createRecipeMasks(source,r);assert.deepEqual(Object.keys(m),['shell']);assert.ok(m.shell.some(Boolean));assert.deepEqual(recolor(source,m,recipeColors(r),recipeColors(r)),source);assert.notDeepEqual(recolor(source,m,recipeColors(r),{shell:'#00FFFF'}),source);});
test('Generic creature recipes cannot accidentally activate incompatible hero controls',()=>{const r=flat();r.status='pilot';assert.equal(isHeroCompatible(r),false);assert.equal(isHeroCompatible(reference),true);assert.equal(isHeroCompatible({...reference,status:'draft'}),false);});
test('Protection dominates every channel, including seeded components',()=>{const r=flat();r.protected=[[[2,2],[5,2],[5,5],[2,5]]];r.channels[0].selection={mode:'seeded',bounds:[0,0,7,7],seeds:[[0,0]],include:[],exclude:[],filter:{}};const m=createRecipeMasks(pixels(),r);assert.equal(m.shell[3*8+3],0);assert.ok(m.shell[0]);});
test('Priority resolves overlaps; exclusions cannot repaint into another protected region',()=>{const r=flat();r.channels.push({...structuredClone(r.channels[0]),id:'fur'});r.priority=['fur','shell'];const m=createRecipeMasks(pixels(),r);assert.ok(m.fur[0]);assert.equal(m.shell[0],0);});
test('Transparent pixels stay outside every mask',()=>{const r=flat(),data=pixels();data[3]=0;const m=createRecipeMasks(data,r),out=recolor(data,m,recipeColors(r),{shell:'#FF00FF'});assert.equal(m.shell[0],0);assert.deepEqual(out.slice(0,4),data.slice(0,4));});
test('Polygons can include the final row and column at the image boundary',()=>{const r=flat();r.channels[0].selection.include=[[[0,0],[8,0],[8,8],[0,8]]];const m=createRecipeMasks(pixels(),validateRecipe(r));assert.equal(m.shell.filter(Boolean).length,64);});
test('Malformed definitions fail before rendering',()=>{
  const mutations=[r=>delete r.entity_id,r=>r.id='../escape',r=>r.source.path='content/../private.png',r=>r.source.sha256='wrong',r=>r.crop=[0,0,0,8],r=>r.anchor=[100,100],r=>r.channels.push(structuredClone(r.channels[0])),r=>r.priority=[],r=>r.channels[0].material={fade:[1,1]},r=>r.channels[0].selection.include=[[[0,0],[1,1]]],r=>r.channels[0].color='red',r=>r.channels[0].selection.filter={arbitrary:true},r=>r.status='approved',r=>r.reconstruction.applied=true,r=>r.equipment_samples=[[200,200]],r=>r.channels[0].id='constructor'];
  for(const mutate of mutations){const r=flat();mutate(r);assert.throws(()=>validateRecipe(r));}
});
test('Source hash mismatch is a hard failure',async()=>{const r=structuredClone(reference);r.source.sha256='0'.repeat(64);await assert.rejects(inspectRecipe(r),/empreinte/);});
test('Equipment leakage is detected independently of channel masks',async()=>{const r=structuredClone(reference);r.equipment_samples.push([151,296]);await assert.rejects(inspectRecipe(r),/équipement recolorable/);});
test('Empty pilot cannot be published; empty draft remains a visible warning',async()=>{const r=structuredClone(reference);r.channels[0].selection.seeds=[];await assert.rejects(inspectRecipe(r),/Zone vide/);r.status='draft';const out=await inspectRecipe(r);assert.ok(out.warnings.some(w=>w.includes('Zone vide')));});
test('PNG codec round-trip preserves RGBA and rejects corruption',()=>{const data=pixels();data[3]=0;const png=encode(8,8,data);assert.deepEqual(decode(png).data,data);const corrupt=Buffer.from(png);corrupt[20]^=1;assert.throws(()=>decode(corrupt),/CRC/);assert.throws(()=>decode(png.subarray(0,40)));});
test('Undo/redo are bounded, isolated, and discard a diverging future',()=>{const h=new History(2);h.remember('a',{n:0},{n:1});h.remember('a',{n:1},{n:2});h.remember('b',{n:6},{n:7});assert.deepEqual(h.undo('a',{n:2}),{n:1});assert.deepEqual(h.redo('a',{n:1}),{n:2});h.undo('a',{n:2});h.remember('a',{n:1},{n:3});assert.equal(h.redo('a',{n:3}),null);assert.deepEqual(h.undo('b',{n:7}),{n:6});h.remember('a',{n:3},{n:4});h.remember('a',{n:4},{n:5});assert.deepEqual(h.undo('a',{n:5}),{n:4});assert.deepEqual(h.undo('a',{n:4}),{n:3});assert.equal(h.undo('a',{n:3}),null);});
test('Versioned catalogue and proofs reproduce exactly from recipes',async()=>{const {checked,errors}=await loadRecipes();assert.deepEqual(errors,[]);assert.deepEqual(await writeOutputs(outputsFor(checked),true),[]);});
test('Both personalized Ryuu images retain the pixels of the user-tested pilot e524227',async()=>{
  const expected={masculine:'c85c4415ab37928f244e181e1fa40db16ccbd734ccdcdc3481817e8c2c261178',feminine:'7e059d5a651eea4dcd1c9d4a9dc9e44124d1c0761559d87fa879942b09676611'};
  for(const [base,hash]of Object.entries(expected)){const r=JSON.parse(await readFile(new URL('../recipes/ryuu-'+base+'.json',import.meta.url)));assert.equal(digest((await inspectRecipe(r)).custom),hash);}
});
