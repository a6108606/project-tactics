#!/usr/bin/env node
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {root,digest,sourceFile,loadRecipes,outputsFor,writeOutputs} from './batch.mjs';
import {decode} from './png.mjs';
import {validateRecipe} from './recipe.js';
const [command,...args]=process.argv.slice(2);
try{
  if(command==='new'){
    const [entity,kind,base,path]=args;if(args.length!==4||![entity,base].every(x=>/^[a-z][a-z0-9-]{0,40}$/.test(x))||!['character','monster'].includes(kind))throw Error('Usage : new <identifiant> <character|monster> <base> <content/...png>');
    const bytes=await readFile(await sourceFile(path)),image=decode(bytes),[w,h]=[image.width,image.height];
    const r={schema:'project-tactics/asset-recipe',version:1,id:entity+'-'+base,entity_id:entity,kind,name:entity,base_id:base,view_id:'main',revision:'visible-1',status:'draft',review:{note:'Contours et couleurs à préparer ; aucune validation esthétique.',approved_by:null,approved_at:null},source:{path,sha256:digest(bytes),size:[w,h]},crop:[0,0,w,h],anchor:[Math.floor(w/2),h-1],channels:[{id:'body',label:'Corps',region_label:'Surface principale à délimiter',color:'#808080',selection:{mode:'polygon',include:[],exclude:[]},material:{}}],priority:['body'],protected:[],equipment_samples:[],reconstruction:{applied:false,notes:'Aucune reconstruction ; surfaces visibles uniquement.'}};
    validateRecipe(r);const output=resolve(root,'tools/character-studio/recipes/'+r.id+'.json');await writeFile(output,JSON.stringify(r,null,2)+'\n',{flag:'wx'});console.log('Brouillon créé : '+output);console.log('Ouvrir /tools/character-studio/prepare/ et charger cette fiche.');
  }else if(['check','build'].includes(command)){
    const checkOnly=command==='build'&&args.includes('--check');
    if(command==='build'&&args.some(a=>a!=='--check'))throw Error('build traite tout le catalogue ; utiliser check <fiches...> pour un lot partiel.');
    const {checked,errors}=await loadRecipes(command==='check'?args:[]);
    for(const c of checked)console.log('PASS '+c.recipe.id+' ('+c.recipe.channels.length+' zones, '+c.recipe.status+')'+(c.warnings.length?' — '+c.warnings.join(' / '):''));
    if(errors.length)throw Error(errors.join('\n'));
    if(command==='build'){const stale=await writeOutputs(outputsFor(checked),checkOnly);if(stale.length)throw Error('Dérivés périmés :\n'+stale.join('\n'));console.log(checkOnly?'Catalogue reproductible : PASS':'Catalogue, masques et comparaisons générés.');}
    console.log(checked.length+' fiches vérifiées.');
  }else console.log('Commandes :\n  check [fiches.json...]\n  build [--check]\n  new <identifiant> <character|monster> <base> <content/...png>');
}catch(e){console.error(e.message);process.exitCode=1;}
