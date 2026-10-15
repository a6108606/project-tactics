import {CHANNELS, MASK_VERSION} from './appearance-contract.js';
import {getRecipe} from './catalog.js';
import {recipeColors} from '../pipeline/mask-engine.js';
export const SCHEMA = 'project-tactics/appearance';
export const VERSION = 3;
export const STORAGE = 'project-tactics.atelier.v3.ryuu-pilot.1';
export const BASES = ['masculine','feminine'];
export function canonical(character,base,references) {
  const h=references.find(x=>x.id===character);
  if(!h||!BASES.includes(base))throw Error('Personnage ou base inconnu.');
  return {
    schema:SCHEMA,schema_version:VERSION,asset_manifest_version:MASK_VERSION,
    character_id:character,body_variant_id:base,view_id:'main',
    source_sha256:h.sha256,face_variant_id:'canonical',hair_variant_id:'canonical',
    colors:getRecipe(character,base)?recipeColors(getRecipe(character,base)):Object.fromEntries(CHANNELS.map((k,i)=>[k,h.palette[i]])),
    equipment:{mode:'source-locked',visible:true},
  };
}
const object = x => !!x && typeof x==='object'&&!Array.isArray(x);
function keys(raw, expected, label) {
  if(!object(raw)||Object.keys(raw).sort().join('|')!==expected.slice().sort().join('|'))throw Error(label+' : structure invalide.');
}
export function validate(raw,references) {
  if(!object(raw))throw Error('Apparence absente.');
  const c=canonical(raw.character_id,raw.body_variant_id,references);
  keys(raw,Object.keys(c),'Apparence');keys(raw.colors,CHANNELS,'Couleurs');keys(raw.equipment,['mode','visible'],'Équipements');
  for(const k of ['schema','schema_version','asset_manifest_version','view_id','source_sha256','face_variant_id','hair_variant_id']) {
    if(raw[k]!==c[k])throw Error('Valeur non prise en charge : '+k+'.');
  }
  if(raw.equipment.mode!=='source-locked'||raw.equipment.visible!==true)throw Error('Le retrait des équipements requiert des calques indépendants.');
  for(const k of CHANNELS) {
    if(typeof raw.colors[k]!=='string'||!/^#[0-9a-f]{6}$/i.test(raw.colors[k]))throw Error('Couleur invalide : '+k+'.');
    c.colors[k]=raw.colors[k].toUpperCase();
  }
  if(!getRecipe(c.character_id,c.body_variant_id)&&CHANNELS.some(k=>c.colors[k]!==canonical(c.character_id,c.body_variant_id,references).colors[k]))throw Error('La personnalisation de ce héros attend la validation du pilote Ryuu.');
  return c;
}
export function importAppearance(raw,references) {
  if(raw?.schema===SCHEMA)return {appearance:validate(raw,references),warnings:[]};
  if(raw?.schema!=='project-tactics/appearance-reference'||raw.version!==2)throw Error('Format d’apparence inconnu.');
  const c=canonical(raw.hero,raw.body,references);
  if(raw.source?.original_png_sha256!==c.source_sha256)throw Error('La source V2 ne correspond pas à la fiche approuvée.');
  if(raw.preview?.configuration_applied!==false)throw Error('Statut du projet V2 invalide.');
  const config=raw.configuration;
  keys(config,['face_study','hair_study','colors'],'Configuration V2');keys(config.colors,CHANNELS,'Couleurs V2');
  for(const k of ['face_study','hair_study'])if(config[k]!==null&&(!Number.isInteger(config[k])||config[k]<0||config[k]>8))throw Error('Indice d’étude V2 invalide.');
  for(const k of CHANNELS)if(typeof config.colors[k]!=='string'||!/^#[0-9a-f]{6}$/i.test(config.colors[k]))throw Error('Couleur V2 invalide.');
  // Study indices never become production variant IDs. V2 had no textile map.
  if(getRecipe(c.character_id,c.body_variant_id))for(const k of ['skin','hair'])c.colors[k]=config.colors[k].toUpperCase();
  const warnings=['Migration V2 : les études restent consultables ; aucun indice n’est converti en variante. Les trois couleurs textiles reviennent au canon, car la V2 ne définissait pas leurs zones.'];
  if(!getRecipe(c.character_id,c.body_variant_id))warnings.push('Ce héros est consultable uniquement : ses cinq couleurs reviennent au canon.');
  return {appearance:validate(c,references),warnings};
}
export function initialState(references) {
  return {hero:'ryuu',base:'masculine',duo:false,mode:'illustration',direction:0,tab:'colors',zoom:100,compare:false,masks:false,saved:[],configs:Object.fromEntries(references.map(h=>[h.id,Object.fromEntries(BASES.map(b=>[b,canonical(h.id,b,references)]))]))};
}
export function restore(raw,references) {
  if(!object(raw)||!Array.isArray(raw.saved)||raw.saved.length>50)throw Error('Sauvegarde locale invalide.');
  const s=initialState(references);
  if(!references.some(h=>h.id===raw.hero)||!BASES.includes(raw.base))throw Error('Sauvegarde locale invalide.');
  for(const h of references)for(const b of BASES) {
    const c=validate(raw.configs?.[h.id]?.[b],references);
    if(c.character_id!==h.id||c.body_variant_id!==b)throw Error('Calques incompatibles dans la sauvegarde.');
    s.configs[h.id][b]=c;
  }
  s.hero=raw.hero;s.base=raw.base;
  s.saved=raw.saved.map((r,i)=>({id:String(i),name:String(r.name||'Apparence').slice(0,80),appearance:validate(r.appearance,references)}));
  return s;
}
