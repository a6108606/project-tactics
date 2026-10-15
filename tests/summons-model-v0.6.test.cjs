const assert=require('node:assert/strict');
const model=require('../content/summons/model-v0.6.cjs');
const catalog=require('../content/summons/catalog-v0.6.json');
const {summonHP,summonActionValue,availableSummonActions,summonGrowth,summonActionTargetable,summonActionZone}=model;
assert.equal(catalog.summons.length,10);
assert.equal(new Set(catalog.summons.flatMap(s=>s.actions.map(a=>a.id))).size,60);
for(const s of catalog.summons){
 assert.equal(s.control,'player');assert.equal(s.actions.length,6);
 for(let rank=1;rank<=5;rank++){
  assert.equal(availableSummonActions(s,rank).length,rank+1);
  for(const a of s.actions){
   assert.equal(a.pa,3);assert.equal(a.values.length,5);
   const val=summonActionValue(s,a,rank,{level:1000,force:1000,intelligence:1000,chance:1000,agilite:1000});
   if(a.unlock>rank)assert.equal(val,null);else assert(Number.isFinite(val.result)&&val.result>=0);
  }
 }
}
const e=catalog.summons.find(s=>s.id==='leo-ecuyer'),hit=e.actions[0];
const owner={level:1000,force:1000,vitalite:200,power:0,resFlat:0,resPercent:0};
assert.equal(summonHP(e,5,owner),1470);
assert.equal(summonActionValue(e,hit,5,{...owner,flat:100,elementFlat:20}).result,455);
assert.equal(summonActionValue(e,hit,5,owner).result,395);
assert.equal(summonActionValue(e,hit,5,{...owner,resFlat:20,resPercent:25}).result,281);
assert.equal(summonActionValue(e,hit,5,{...owner,resFlat:20,resPercent:-25}).result,468);
assert.equal(summonActionValue(e,hit,5,{...owner,resPercent:100}).result,0);
assert.equal(summonActionValue(e,hit,5,{...owner,resFlat:1000}).result,0);
assert.equal(summonActionValue(e,hit,5,{...owner,force:0,power:0}).result,65);
assert.equal(summonActionValue(e,hit,5,{...owner,force:0,power:1000}).result,395);
assert.equal(summonActionValue(e,hit,5,{...owner,intelligence:10000}).result,395);
assert(summonActionValue(e,hit,5,{...owner,level:500}).result<395);
assert(summonHP(e,5,{...owner,vitalite:400})>1470);
assert.equal(summonGrowth({level:0}),1);assert.equal(summonGrowth({level:2000}),2.998);
const guardian=catalog.summons.find(s=>s.id==='ryuu-sentinelle');
assert.equal(summonHP(guardian,5,owner),2430);
const healer=catalog.summons.find(s=>s.id==='lina-luminou'),heal=healer.actions[0],shield=healer.actions[1];
const patient={level:500,intelligence:500,power:0};
assert.equal(summonActionValue(healer,heal,5,patient).result,summonActionValue(healer,heal,5,{...patient,power:9999,resFlat:9999,resPercent:100}).result);
assert.equal(summonActionValue(healer,shield,5,patient).result,summonActionValue(healer,shield,5,{...patient,intelligence:9999}).result);
const double=catalog.summons.find(s=>s.id==='kael-5');assert(!double.actions.some(a=>['damage','poison'].includes(a.kind)));
const shove=e.actions[2];assert(summonActionTargetable(shove,0,1));assert(!summonActionTargetable(shove,1,1));
const aura=catalog.summons.find(s=>s.id==='leo-etendard').actions[0];assert(summonActionZone(aura,0,0,1,1));assert(!summonActionZone(aura,0,0,2,1));
console.log('PASS — summon kit progression, locked actions, scaling, health inheritance, resistances, healing, shields and grid geometry.');

const calibration=require('../content/combat/calibration-v0.6.json');
assert.deepEqual(calibration.results.find(r=>r.name==='Leo · Frappe rocheuse V').results,[[330,374],[667,740],[466,517]]);
assert.deepEqual(calibration.results.find(r=>r.name.startsWith('Écuyer')).results,[[395,395],[610,610],[427,427]]);
assert.deepEqual(calibration.heroes.find(c=>c.id==='leo').spells.find(s=>s.id==='leo-0').profile.damage,[[16,18],[20,22],[24,27],[27,30],[30,34]]);
console.log('PASS — v0.6 calibrated bases, inherited flat damage and comparable benchmark scenarios.');
