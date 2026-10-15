/** Hand-traced semantic regions in the ORIGINAL Ryuu PNG pixel coordinates.
 * These are conservative visible-surface masks, not reconstructed layers.
 * Colour gates refine these bounded regions; they never select the whole sheet.
 */
export const CHANNELS = ['skin', 'hair', 'clothing1', 'clothing2', 'clothing3'];
export const MASK_VERSION = 'ryuu-visible-1';
export const REGION_LABELS = {
  skin: 'Peau visible', hair: 'Cheveux visibles',
  clothing1: 'Pantalon : jambe à gauche de l’image',
  clothing2: 'Pantalon : jambe à droite de l’image',
  clothing3: 'Pantalon : panneau central sous la ceinture',
};

const polygon = (...points) => points;
export const RYUU = {
  masculine: {
    anchor:[132,708],
    colors:{skin:'#F1BC85',hair:'#C7D5B4',clothing1:'#4B3D52',clothing2:'#44394B',clothing3:'#403447'},
    // Each seed sits in one visible skin surface, enclosed by source line art.
    skinSeeds:[[151,296],[154,367],[82,412],[93,376],[194,392],[80,630],[148,621],[101,303],[62,694],[195,684],[140,661],[216,462],[93,486],[84,497],[147,664],[172,675],[67,679]],
    skinBounds:[40,290,240,715],
    regions:{
      hair:[polygon([52,190],[224,190],[224,360],[52,360])],
      clothing1:[polygon([45,490],[138,475],[145,482],[139,513],[129,551],[132,580],[146,587],[120,614],[76,603],[43,566])],
      clothing2:[polygon([169,466],[185,488],[207,518],[221,556],[210,583],[171,609],[138,591],[143,555],[157,514])],
      clothing3:[polygon([143,459],[164,456],[172,469],[172,486],[165,511],[151,540],[134,580],[136,546],[141,506])],
    },
    protected:[polygon([55,592],[85,578],[103,586],[122,610],[118,629],[81,642],[55,620]),polygon([139,595],[181,595],[186,621],[172,631],[148,627])],
    equipmentSamples:[[160,281],[50,401],[99,373],[148,447],[189,502],[176,609]],
  },
  feminine: {
    anchor:[351,707],
    colors:{skin:'#F1BC85',hair:'#C7D5B4',clothing1:'#4E4055',clothing2:'#493A4F',clothing3:'#44364B'},
    skinSeeds:[[375,322],[382,421],[319,400],[307,605],[381,566],[375,610],[356,385],[405,415],[331,325],[433,375],[337,451],[329,474],[286,693],[369,659],[288,663],[420,680],[401,670],[374,660]],
    skinBounds:[266,318,446,711],
    regions:{
      hair:[polygon([259,190],[454,190],[454,405],[259,405])],
      clothing1:[polygon([297,514],[310,503],[337,516],[356,500],[371,485],[365,522],[363,551],[358,580],[333,606],[302,603],[276,584],[268,558],[282,535])],
      clothing2:[polygon([391,480],[409,496],[420,521],[431,552],[422,570],[393,570],[372,559],[369,540],[380,508])],
      clothing3:[polygon([371,482],[387,479],[394,490],[384,515],[369,558],[365,539],[365,523])],
    },
    protected:[polygon([286,592],[317,580],[336,595],[344,612],[326,628],[301,631],[281,614]),polygon([373,545],[423,545],[429,567],[397,581],[375,574])],
    equipmentSamples:[[380,311],[284,399],[339,408],[386,474],[428,508],[394,604]],
  },
};

export function inside(x, y, points) {
  let hit = false;
  for (let i=0,j=points.length-1;i<points.length;j=i++) {
    const [ax,ay]=points[i], [bx,by]=points[j];
    if ((ay>y)!==(by>y) && x<(bx-ax)*(y-ay)/(by-ay)+ax) hit=!hit;
  }
  return hit;
}
function smooth(a,b,v) { const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t); }
export function maskWeight(channel,r,g,b) {
  const max=Math.max(r,g,b),min=Math.min(r,g,b), saturation=max===0?0:(max-min)/max;
  const light=(r*.2126+g*.7152+b*.0722)/255;
  if (channel==='hair') {
    if (g<r || g<b+3 || saturation<.06) return 0;
    return smooth(.10,.34,light);
  }
  if (channel==='skin') {
    if (r<g+14 || g<b+12 || saturation<.18) return 0;
    return smooth(.12,.40,light);
  }
  // Purple/neutral fabric only inside the traced trouser panels.
  if (r>170 || g>155 || b>180 || b<g || r>b+12) return 0;
  return smooth(.07,.19,light);
}
function skinEligible(r,g,b) {
  return r>135 && g>75 && r-g>24 && g-b>12 && b/r>.27;
}
export function createMasks(source, crop, base) {
  const spec=RYUU[base], [ox,oy,width,height]=crop;
  const masks=Object.fromEntries(CHANNELS.map(k=>[k,new Uint8Array(width*height)]));
  const seen=new Uint8Array(width*height),queue=[];
  const eligible=i=>{
    if(i<0||i>=width*height)return false;
    const gx=i%width+ox,gy=Math.floor(i/width)+oy,[l,t,r,b]=spec.skinBounds;
    return gx>=l&&gx<=r&&gy>=t&&gy<=b&&skinEligible(source[i*4],source[i*4+1],source[i*4+2]);
  };
  for(const [gx,gy] of spec.skinSeeds){
    const x=gx-ox,y=gy-oy;
    if(x<0||x>=width||y<0||y>=height)continue;
    const i=y*width+x;if(!seen[i]&&eligible(i)){seen[i]=1;queue.push(i);}
  }
  for(let j=0;j<queue.length;j++){
    const i=queue[j],x=i%width,y=Math.floor(i/width),p=i*4;
    masks.skin[i]=Math.round(255*maskWeight('skin',source[p],source[p+1],source[p+2]));
    const neighbors=[];
    if(x>0)neighbors.push(i-1);if(x<width-1)neighbors.push(i+1);
    if(y>0)neighbors.push(i-width);if(y<height-1)neighbors.push(i+width);
    for(const n of neighbors)if(!seen[n]&&eligible(n)){seen[n]=1;queue.push(n);}
  }
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const gx=x+ox+.5,gy=y+oy+.5,i=y*width+x,p=i*4;
    if(masks.skin[i])continue;
    if(spec.protected.some(s=>inside(gx,gy,s)))continue;
    for(const k of ['hair','clothing3','clothing1','clothing2']) {
      if(!spec.regions[k].some(s=>inside(gx,gy,s)))continue;
      masks[k][i]=Math.round(255*maskWeight(k,source[p],source[p+1],source[p+2]));
      if(masks[k][i])break;
    }
  }
  return masks;
}
