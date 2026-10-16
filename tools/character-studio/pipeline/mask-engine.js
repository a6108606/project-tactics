/** Deterministic semantic masking. Coordinates always refer to the source PNG.
 * The engine knows neither human anatomy nor a particular character's palette.
 */
export function inside(x,y,points) {
  let hit=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++){
    const [ax,ay]=points[i],[bx,by]=points[j];
    if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)hit=!hit;
  }return hit;
}
const inRange=(v,[min,max])=>v>=min&&v<=max;
export function accepts(filter={},r,g,b){
  const color={r,g,b};
  for(const [key,range]of Object.entries(filter.ranges||{}))if(!inRange(color[key],range))return false;
  for(const [key,range]of Object.entries(filter.differences||{}))if(!inRange(color[key[0]]-color[key[2]],range))return false;
  const max=Math.max(r,g,b),sat=max?(max-Math.min(r,g,b))/max:0;
  if(filter.saturation&&!inRange(sat,filter.saturation))return false;
  for(const ratio of filter.ratios||[])if(!color[ratio.denominator]||color[ratio.numerator]/color[ratio.denominator]<=ratio.min_exclusive)return false;
  return true;
}
function weight(material,r,g,b){
  if(!accepts(material,r,g,b))return 0;
  if(!material?.fade)return 255;
  const [a,bound]=material.fade,y=(r*.2126+g*.7152+b*.0722)/255,t=Math.max(0,Math.min(1,(y-a)/(bound-a)));
  return Math.round(255*t*t*(3-2*t));
}
export function createRecipeMasks(source,recipe){
  const [ox,oy,width,height]=recipe.crop,size=width*height;
  if(source.length!==size*4)throw Error('Dimensions du recadrage incompatibles.');
  const masks=Object.fromEntries(recipe.channels.map(c=>[c.id,new Uint8Array(size)])),occupied=new Uint8Array(size),protectedPixels=new Uint8Array(size);
  for(let i=0;i<size;i++)if(recipe.protected.some(p=>inside(i%width+ox+.5,Math.floor(i/width)+oy+.5,p)))protectedPixels[i]=1;
  for(const id of recipe.priority){
    const c=recipe.channels.find(c=>c.id===id),selection=c.selection,mask=masks[id];
    const eligible=(i,seeded=false)=>{
      if(i<0||i>=size||protectedPixels[i]||occupied[i])return false;
      const x=i%width+ox,y=Math.floor(i/width)+oy,px=x+.5,py=y+.5;
      if(selection.exclude.some(p=>inside(px,py,p)))return false;
      if(selection.include.length&&!selection.include.some(p=>inside(px,py,p)))return false;
      if(selection.mode==='polygon'&&!selection.include.length)return false;
      if(seeded){const [l,t,r,b]=selection.bounds;if(x<l||x>r||y<t||y>b)return false;}
      const at=i*4;return source[at+3]>0&&accepts(selection.filter,source[at],source[at+1],source[at+2]);
    };
    const paint=i=>{const p=i*4;mask[i]=weight(c.material,source[p],source[p+1],source[p+2]);if(mask[i])occupied[i]=1;};
    if(selection.mode==='seeded'){
      const queue=[],seen=new Uint8Array(size);
      for(const [gx,gy]of selection.seeds){const x=gx-ox,y=gy-oy,i=y*width+x;if(x>=0&&x<width&&y>=0&&y<height&&!seen[i]&&eligible(i,true)){seen[i]=1;queue.push(i);}}
      // Determine the component before painting: occupation belongs to earlier channels.
      for(let j=0;j<queue.length;j++){const i=queue[j],x=i%width,y=Math.floor(i/width),neighbors=[];
        if(x)neighbors.push(i-1);if(x<width-1)neighbors.push(i+1);if(y)neighbors.push(i-width);if(y<height-1)neighbors.push(i+width);
        for(const n of neighbors)if(!seen[n]&&eligible(n,true)){seen[n]=1;queue.push(n);}
      }for(const i of queue)paint(i);
    }else for(let i=0;i<size;i++)if(eligible(i))paint(i);
  }return masks;
}
export const recipeColors=recipe=>Object.fromEntries(recipe.channels.map(c=>[c.id,c.color]));
