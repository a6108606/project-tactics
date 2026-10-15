import {CHANNELS,RYUU,createMasks} from '../masks.js';
import {recolor} from '../render.js';
import {canonical,validate,initialState,restore,importAppearance,BASES} from '../state.js';
import {saveLocal} from '../storage.js';
export const PROOF_COLORS={skin:'#65412F',hair:'#222E45',clothing1:'#356C72',clothing2:'#526E52',clothing3:'#B48760'};
export function same(a,b){return a.length===b.length&&a.every((v,i)=>v===b[i]);}
export function check(condition,message){if(!condition)throw Error(message);}
export function runChecks(references,samples) {
  const results=[],test=(label,fn)=>{try{fn();results.push({label,pass:true});}catch(e){results.push({label,pass:false,error:e.message});}};
  for(const {base,box,data} of samples){
    const defaults=RYUU[base].colors,masks=createMasks(data,box,base),source=new Uint8ClampedArray(data);
    test(base+' : canon RGBA exactement identique',()=>check(same(data,recolor(data,masks,defaults,defaults)),'Canon modifié'));
    test(base+' : cinq masques non vides et disjoints',()=>{
      for(const k of CHANNELS)check(masks[k].some(x=>x>0),'Masque vide : '+k);
      for(let i=0;i<data.length/4;i++)check(CHANNELS.filter(k=>masks[k][i]>0).length<=1,'Masques superposés');
    });
    for(const k of CHANNELS)for(const color of ['#00FFFF','#FF00FF','#FFFFFF','#000000'])test(base+' : '+k+' '+color+' isolé',()=>{
      const colors={...defaults,[k]:color},out=recolor(data,masks,defaults,colors);let changed=0;
      for(let i=0;i<masks[k].length;i++){
        const p=i*4,different=[0,1,2].some(c=>out[p+c]!==data[p+c]);
        if(different){changed++;check(masks[k][i]>0,'Fuite hors du masque');}
        check(out[p+3]===data[p+3],'Alpha modifié');
      }check(changed>10,'Le canal n’agit pas sur le dessin');
    });
    test(base+' : sentinelles d’équipement RGBA intactes',()=>{
      const out=recolor(data,masks,defaults,PROOF_COLORS);
      for(const [x,y] of RYUU[base].equipmentSamples){const p=((y-box[1])*box[2]+x-box[0])*4;check(same(out.slice(p,p+4),data.slice(p,p+4)),`Équipement modifié en ${x},${y}`);}
    });
    test(base+' : toutes les surfaces non masquées intactes',()=>{
      const out=recolor(data,masks,defaults,PROOF_COLORS);
      for(let i=0;i<data.length/4;i++)if(CHANNELS.every(k=>masks[k][i]===0))check(same(out.slice(i*4,i*4+4),data.slice(i*4,i*4+4)),'Surface non masquée modifiée');
    });
    test(base+' : source en mémoire jamais mutée',()=>check(same(data,source),'Source mutée'));
  }
  test('Dix états canoniques valides et indépendants',()=>{
    const s=initialState(references);for(const h of references)for(const b of BASES)validate(s.configs[h.id][b],references);
    s.configs.ryuu.masculine.colors.skin='#123456';check(s.configs.ryuu.feminine.colors.skin!=='#123456','Bases contaminées');
    check(s.configs.kael.masculine.colors.skin!=='#123456','Héros contaminés');
  });
  test('Apparence JSON et sauvegarde reproduisent les pixels',()=>{
    const s=initialState(references);s.configs.ryuu.feminine.colors={...PROOF_COLORS};s.hero='ryuu';s.base='feminine';
    s.saved.push({id:'test',name:'Preuve',appearance:structuredClone(s.configs.ryuu.feminine)});
    const back=restore(JSON.parse(JSON.stringify(s)),references),c=importAppearance(JSON.parse(JSON.stringify(s.saved[0].appearance)),references).appearance;
    check(JSON.stringify(back.configs)===JSON.stringify(s.configs),'Configurations perdues');
    const {data,box}=samples.find(x=>x.base==='feminine'),masks=createMasks(data,box,'feminine');
    check(same(recolor(data,masks,RYUU.feminine.colors,c.colors),recolor(data,masks,RYUU.feminine.colors,PROOF_COLORS)),'Pixels JSON différents');
  });
  const invalid=[null,[],{},...[
    c=>c.schema_version=2,c=>c.source_sha256='wrong',c=>c.body_variant_id='other',c=>c.character_id='other',
    c=>c.view_id='iso',c=>c.asset_manifest_version='other',c=>c.face_variant_id='study-1',c=>c.hair_variant_id='study-1',
    c=>c.equipment.visible=false,c=>c.colors.skin='red',c=>c.colors.hair='#FFF',c=>c.colors.extra='#FFFFFF',c=>c.extra=true,
  ].map(mut=>{const c=canonical('ryuu','masculine',references);mut(c);return c;})];
  invalid.forEach((raw,i)=>test('Import invalide refusé '+(i+1),()=>{let refused=false;try{importAppearance(raw,references);}catch{refused=true;}check(refused,'Import accepté');}));
  test('Sauvegarde qui mélange les bases refusée',()=>{const s=initialState(references);s.configs.ryuu.masculine=s.configs.ryuu.feminine;let refused=false;try{restore(s,references);}catch{refused=true;}check(refused,'Base incorrecte acceptée');});
  test('Couleur d’un héros non pris en charge refusée',()=>{const c=canonical('kael','masculine',references);c.colors.skin='#123456';let refused=false;try{validate(c,references);}catch{refused=true;}check(refused,'Modification non prise en charge acceptée');});
  test('Migration V2 explicite sans transformer une étude en variante',()=>{
    const c=canonical('ryuu','masculine',references),v2={schema:'project-tactics/appearance-reference',version:2,hero:'ryuu',body:'masculine',source:{original_png_sha256:c.source_sha256},preview:{configuration_applied:false},configuration:{face_study:4,hair_study:2,colors:PROOF_COLORS}};
    const result=importAppearance(v2,references);check(result.warnings.length>0,'Avertissement absent');check(result.appearance.face_variant_id==='canonical'&&result.appearance.hair_variant_id==='canonical','Fausse variante');
    check(result.appearance.colors.skin===PROOF_COLORS.skin&&result.appearance.colors.clothing1===c.colors.clothing1,'Migration couleurs incorrecte');
  });
  test('Échec de stockage signalé : accès interdit et quota',()=>{
    check(saveLocal({},()=>{throw Error('SecurityError');})===false,'Accès interdit ignoré');
    check(saveLocal({},()=>({setItem(){throw Error('QuotaExceededError');}}))===false,'Quota ignoré');
  });
  return results;
}
