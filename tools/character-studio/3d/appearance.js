export const VERSION = 'ryuu-volume-study-1';
export const CHANNELS = { skin: 'Peau', hair: 'Cheveux', clothing1: 'Pantalon', clothing2: 'Tissu de taille', clothing3: 'Gilet et liens' };
export const COLORS = { skin:'#F1BC85', hair:'#C7D5B4', clothing1:'#51315D', clothing2:'#B0434E', clothing3:'#46394B' };
export const EQUIPMENT = { leather:'Cuirs et ornements', bandana:'Bandeau et rubans', sash:'Pans de ceinture', dagger:'Dague' };
export function defaults(base='masculine') {
  return { schema_version:1, asset_version:VERSION, character_id:'ryuu', body_variant_id:base, face_variant_id:'soft', hair_variant_id:'spikes', colors:{...COLORS}, equipment:Object.fromEntries(Object.keys(EQUIPMENT).map(k=>[k,true])), view:{azimuth:25,elevation:12,zoom:1} };
}
export function validate(raw) {
  if (!raw || raw.schema_version!==1 || raw.asset_version!==VERSION || raw.character_id!=='ryuu') throw Error('Ce fichier ne correspond pas au pilote 3D Ryuu.');
  if (!['masculine','feminine'].includes(raw.body_variant_id) || !['soft','angular'].includes(raw.face_variant_id) || !['spikes','swept'].includes(raw.hair_variant_id)) throw Error('Base ou variante inconnue.');
  const s=defaults(raw.body_variant_id);s.face_variant_id=raw.face_variant_id;s.hair_variant_id=raw.hair_variant_id;
  for (const k of Object.keys(CHANNELS)) {
    if (typeof raw.colors?.[k]!=='string' || !/^#[\da-f]{6}$/i.test(raw.colors[k])) throw Error('Couleur invalide : '+k);
    s.colors[k]=raw.colors[k].toUpperCase();
  }
  for (const k of Object.keys(EQUIPMENT)) {
    if(typeof raw.equipment?.[k]!=='boolean') throw Error('Équipement invalide : '+k);
    s.equipment[k]=raw.equipment[k];
  }
  for (const [k,min,max] of [['azimuth',-180,180],['elevation',-10,65],['zoom',.7,1.8]]) {
    if (!Number.isFinite(raw.view?.[k]) || raw.view[k]<min || raw.view[k]>max) throw Error('Vue invalide : '+k);
    s.view[k]=raw.view[k];
  }
  return s;
}
export function applyAppearance(root,s) {
  root.traverse(o=>{
    if(o.name.startsWith('face_'))o.visible=o.name==='face_'+s.face_variant_id;
    if(o.name.startsWith('hair_') && ['hair_spikes','hair_swept'].includes(o.name))o.visible=o.name==='hair_'+s.hair_variant_id;
    if(o.name.startsWith('equip_'))o.visible=!!s.equipment[o.name.slice(6)];
    if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material]) {
      const k=m.name.replace(/^base_/,''); if(m.name.startsWith('base_') && s.colors[k])m.color.set(s.colors[k]);
    }
  });
}
