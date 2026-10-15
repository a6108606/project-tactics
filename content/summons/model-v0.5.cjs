// Project Tactics v0.5 — pure proposed formulas, shared with the design repository.
const SUMMON_FORMULA={levelGrowth:0.002,inheritPercent:35,vitalityHP:5};
const SUMMON_STAT={Terre:'force',Feu:'intelligence',Eau:'chance',Air:'agilite'};
function summonNumber(value,fallback=0){const n=Number(value);return Number.isFinite(n)?n:fallback;}
function summonLevel(owner){return Math.max(1,Math.min(1000,Math.floor(summonNumber(owner.level,1))));}
function summonGrowth(owner){return 1+(summonLevel(owner)-1)*SUMMON_FORMULA.levelGrowth;}
function availableSummonActions(spec,rank){return spec.actions.filter(a=>a.unlock<=rank);}
function summonHP(spec,rank,owner){return Math.max(1,Math.floor(spec.hp[rank-1]+summonLevel(owner)*spec.scaling.hpPerLevel+Math.max(0,summonNumber(owner.vitalite))*SUMMON_FORMULA.vitalityHP*spec.scaling.vitalityShare));}
function summonActionValue(spec,action,rank,owner){
 if(rank<action.unlock)return null;
 const base=action.values[rank-1],growth=summonGrowth(owner),share=SUMMON_FORMULA.inheritPercent/100*spec.scaling.statCoefficient;
 if(!['damage','poison','heal','shield'].includes(action.kind))return {base,raw:base,result:base,growth:1,inherited:0};
 const key=action.kind==='heal'?'intelligence':SUMMON_STAT[action.element];
 const inherited=action.kind==='shield'?0:(summonNumber(owner[key])+(['damage','poison'].includes(action.kind)?summonNumber(owner.power):0))*share;
 const raw=Math.max(0,Math.floor(base*growth*Math.max(0,1+inherited/100)));
 const offensive=['damage','poison'].includes(action.kind);
 const afterFixed=offensive?Math.max(0,raw-summonNumber(owner.resFlat)):raw;
 const result=offensive?Math.floor(afterFixed*Math.max(0,1-Math.max(-100,Math.min(100,summonNumber(owner.resPercent)))/100)):raw;
 return {base,growth,inherited,raw,afterFixed,result};
}
function summonActionTargetable(a,x,y){const d=Math.abs(x)+Math.abs(y);return d>=a.rangeMin&&d<=a.rangeMax&&(!a.linear||x===0||y===0);}
function summonActionZone(a,tx,ty,x,y){return Math.abs(x-tx)+Math.abs(y-ty)<=a.radius;}
if(typeof module!=='undefined'&&module.exports)module.exports={SUMMON_FORMULA,SUMMON_STAT,summonLevel,summonGrowth,availableSummonActions,summonHP,summonActionValue,summonActionTargetable,summonActionZone};
