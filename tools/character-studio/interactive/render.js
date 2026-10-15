export const rgb = hex => [1,3,5].map(n=>parseInt(hex.slice(n,n+2),16));
const luminance = c => c[0]*.2126+c[1]*.7152+c[2]*.0722;
const clamp = x => Math.max(0,Math.min(255,Math.round(x)));

/** Identity at the canonical palette; bounded relighting at other colours.
 * Same function for the on-screen bitmap, comparison, and PNG export.
 */
export function recolor(source,masks,defaults,colors) {
  const result=new Uint8ClampedArray(source);
  for(const k of Object.keys(masks)) {
    if(colors[k].toUpperCase()===defaults[k].toUpperCase())continue;
    const target=rgb(colors[k]), reference=rgb(defaults[k]), refY=luminance(reference);
    // A tiny floor preserves modelling even at pure black.
    const paint=target.map(v=>Math.max(4,v));
    for(let i=0;i<masks[k].length;i++) {
      const a=masks[k][i]/255;if(!a)continue;
      const p=i*4, original=[source[p],source[p+1],source[p+2]], y=luminance(original);
      const shade=Math.min(1,y/Math.max(1,refY));
      const highlight=Math.max(0,(y-refY)/Math.max(1,255-refY));
      for(let c=0;c<3;c++) {
        const value=paint[c]*shade+(255-paint[c])*highlight;
        result[p+c]=clamp(original[c]*(1-a)+value*a);
      }
    }
  }
  return result;
}
export function maskPreview(source,masks) {
  const result=new Uint8ClampedArray(source),channels=Object.keys(masks),swatches=['#E88D69','#79B689','#9581C4','#4F9ABF','#D8A242','#D66F9E','#88A5A7','#D5A876'];
  for(let k=0;k<channels.length;k++)for(let i=0;i<masks[channels[k]].length;i++) {
    if(!masks[channels[k]][i])continue;
    const color=rgb(swatches[k%swatches.length]);for(let c=0;c<3;c++)result[i*4+c]=Math.round(source[i*4+c]*.3+color[c]*.7);
  }
  return result;
}
