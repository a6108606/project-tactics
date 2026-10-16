// Explicit material families for new atlas studies. The original Ryuu recipes remain unchanged.
// Dark outlines, low-saturation neutral details, and unselected materials stay fixed.
export function hsv(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d)h=max===r?60*((g-b)/d%6):max===g?60*((b-r)/d+2):60*((r-g)/d+4);return[(h+360)%360,max?d/max:0,max];}
export const families=[
 {id:'red',label:'Rouges',h:[345,20]}, {id:'ochre',label:'Ocres',h:[20,47]},
 {id:'leaf',label:'Feuillages',h:[47,100]}, {id:'teal',label:'Turquoises',h:[100,190]},
 {id:'blue',label:'Bleus',h:[190,250]}, {id:'purple',label:'Violets',h:[250,345]}
];
const hueIn=(h,[a,b])=>a>b?h>=a||h<b:h>=a&&h<b;
export function catalogMasks(source,recipe){
 const [,,w,h]=recipe.crop,masks=Object.fromEntries(recipe.channels.map(c=>[c.id,new Uint8Array(w*h)]));
 for(let i=0;i<w*h;i++){
  if(source[i*4+3]<16)continue;
  const [r,g,b]=source.subarray(i*4,i*4+3),[hue,s,v]=hsv(r,g,b),x=i%w,y=Math.floor(i/w);
  for(const c of recipe.channels){const z=c.zone;
   if(z&&(x<z[0]||y<z[1]||x>=z[2]||y>=z[3]))continue;
   if(c.exclude?.some(z=>x>=z[0]&&y>=z[1]&&x<z[2]&&y<z[3]))continue;
   if(c.hue&&!hueIn(hue,c.hue))continue;
   if(s<(c.saturation?.[0]??.12)||s>(c.saturation?.[1]??1)||v<(c.value?.[0]??.30)||v>(c.value?.[1]??1))continue;
   if(c.skin&&(r-g<20||g-b<15||b/r<.28))continue;
   masks[c.id][i]=Math.round(255*Math.min(1,(v-.16)/.18));break;
  }
 }
 return masks;
}
