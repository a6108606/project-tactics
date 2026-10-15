const isObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const idPattern=/^[a-z][a-z0-9-]{0,63}$/;
const channelPattern=/^[a-z][a-zA-Z0-9_-]{0,63}$/;
const fail=message=>{throw Error(message);};
function fields(v,allowed,label){if(!isObject(v))fail(label+' doit être un objet.');for(const k of Object.keys(v))if(!allowed.includes(k))fail(label+' : champ inconnu '+k);}
function tuple(v,n,label){if(!Array.isArray(v)||v.length!==n||v.some(x=>!Number.isFinite(x)))fail(label+' invalide.');}
function text(v,label){if(typeof v!=='string'||!v.trim()||v.length>2000)fail(label+' invalide.');}
function filter(v,label){
  if(v===undefined)return;
  fields(v,['ranges','differences','saturation','fade','ratios'],label);
  for(const [field,keys]of [['ranges',['r','g','b']],['differences',['r-g','r-b','g-r','g-b','b-r','b-g']]])if(v[field]){
    fields(v[field],keys,label+'.'+field);for(const range of Object.values(v[field])){tuple(range,2,label);if(range[0]>range[1]||range[0]<-255||range[1]>255)fail(label+' : bornes incohérentes.');}
  }
  for(const k of ['saturation','fade'])if(v[k]){tuple(v[k],2,label);if(v[k][0]<0||v[k][1]>1||v[k][0]>v[k][1]||(k==='fade'&&v[k][0]===v[k][1]))fail(label+' : intervalle invalide.');}
  if(v.ratios){if(!Array.isArray(v.ratios))fail(label+' : ratios invalides.');for(const r of v.ratios){fields(r,['numerator','denominator','min_exclusive'],label);if(!['r','g','b'].includes(r.numerator)||!['r','g','b'].includes(r.denominator)||!Number.isFinite(r.min_exclusive))fail(label+' : ratio invalide.');}}
}
export function validateRecipe(raw){
  fields(raw,['schema','version','id','entity_id','kind','name','base_id','view_id','revision','status','review','source','crop','anchor','channels','priority','protected','equipment_samples','reconstruction'],'Fiche');
  if(raw.schema!=='project-tactics/asset-recipe'||raw.version!==1)fail('Version de fiche inconnue.');
  for(const k of ['id','entity_id','base_id','view_id'])if(typeof raw[k]!=='string'||!idPattern.test(raw[k]))fail(k+' invalide.');
  if(!['character','monster'].includes(raw.kind))fail('Type de créature inconnu.');text(raw.name,'Nom');text(raw.revision,'Révision');
  if(!['draft','pilot','approved'].includes(raw.status))fail('Statut inconnu.');
  fields(raw.review,['note','approved_by','approved_at'],'Revue');text(raw.review.note,'Note de revue');
  if(raw.status==='approved'&&(!raw.review.approved_by||!/^\d{4}-\d{2}-\d{2}$/.test(raw.review.approved_at)))fail('Une validation doit nommer son auteur et sa date.');
  fields(raw.source,['path','sha256','size'],'Source');
  if(typeof raw.source.path!=='string'||!/^content\/[a-zA-Z0-9_./-]+\.png$/.test(raw.source.path)||raw.source.path.split('/').some(x=>x==='..'||x==='.'||!x))fail('Chemin PNG relatif sous content/ requis.');
  if(!/^[a-f0-9]{64}$/.test(raw.source.sha256))fail('Empreinte source invalide.');
  tuple(raw.source.size,2,'Dimensions');if(raw.source.size.some(x=>!Number.isInteger(x)||x<1)||raw.source.size[0]*raw.source.size[1]>32_000_000)fail('Dimensions hors limites.');
  tuple(raw.crop,4,'Cadrage');const [x,y,w,h]=raw.crop,[sw,sh]=raw.source.size;
  if(raw.crop.some(v=>!Number.isInteger(v))||x<0||y<0||w<1||h<1||x+w>sw||y+h>sh)fail('Cadrage hors de la source.');
  const point=(p,label,boundary=false)=>{tuple(p,2,label);if(p[0]<0||p[1]<0||(boundary?p[0]>sw||p[1]>sh:p[0]>=sw||p[1]>=sh))fail(label+' hors de la source.');};
  const polygons=(polys,label)=>{if(!Array.isArray(polys)||polys.length>256)fail(label+' invalide.');for(const poly of polys){if(!Array.isArray(poly)||poly.length<3||poly.length>512)fail(label+' : trois points minimum.');poly.forEach(p=>point(p,label,true));}};
  point(raw.anchor,'Ancrage');if(raw.anchor[0]<x||raw.anchor[0]>=x+w||raw.anchor[1]<y||raw.anchor[1]>=y+h)fail('Ancrage hors du cadrage.');
  if(!Array.isArray(raw.channels)||raw.channels.length<1||raw.channels.length>8)fail('Une à huit zones requises.');
  const ids=[];
  for(const c of raw.channels){fields(c,['id','label','region_label','color','selection','material'],'Zone');
    if(typeof c.id!=='string'||!channelPattern.test(c.id)||['constructor','prototype','__proto__'].includes(c.id)||ids.includes(c.id))fail('Identifiant de zone invalide ou dupliqué.');ids.push(c.id);text(c.label,'Libellé');text(c.region_label,'Description');
    if(!/^#[0-9a-fA-F]{6}$/.test(c.color))fail('Couleur canonique invalide.');
    const s=c.selection;fields(s,['mode','bounds','seeds','include','exclude','filter'],'Sélection');if(!['seeded','polygon'].includes(s.mode))fail('Méthode de sélection inconnue.');
    polygons(s.include,'Contours');polygons(s.exclude,'Exclusions');filter(s.filter,'Sélection de matériau');filter(c.material,'Modelé');
    if(s.mode==='seeded'){tuple(s.bounds,4,'Limites');const [l,t,r,b]=s.bounds;if(l<0||t<0||r<l||b<t||r>=sw||b>=sh)fail('Limites de composante invalides.');if(!Array.isArray(s.seeds)||s.seeds.length>4096)fail('Points de départ invalides.');for(const p of s.seeds){point(p,'Point de départ');if(p.some(v=>!Number.isInteger(v))||p[0]<x||p[0]>=x+w||p[1]<y||p[1]>=y+h)fail('Point de départ hors cadrage ou non entier.');}}
  }
  if(!Array.isArray(raw.priority)||raw.priority.length!==ids.length||new Set(raw.priority).size!==ids.length||raw.priority.some(k=>!ids.includes(k)))fail('Ordre des zones incomplet.');
  polygons(raw.protected,'Protection globale');if(!Array.isArray(raw.equipment_samples))fail('Points témoins invalides.');for(const p of raw.equipment_samples){point(p,'Point témoin');if(p.some(v=>!Number.isInteger(v))||p[0]<x||p[0]>=x+w||p[1]<y||p[1]>=y+h)fail('Point témoin hors cadrage.');}
  fields(raw.reconstruction,['applied','notes'],'Reconstruction');if(raw.reconstruction.applied!==false)fail('Ce moteur accepte seulement les surfaces visibles ; une reconstruction nécessite un lot de calques distinct.');text(raw.reconstruction.notes,'Note de reconstruction');
  return structuredClone(raw);
}
