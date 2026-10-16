// Recover complete disconnected silhouettes whose bounding boxes cross a grid seam.
// No repainting: each nontransparent source pixel belongs to exactly one output frame.
export function componentFrames(im){
 const {width:w,height:h,data}=im,seen=new Uint8Array(w*h),components=[];
 for(let i=0;i<seen.length;i++){
  if(seen[i]||!data[i*4+3])continue;
  const pixels=[i],bounds=[w,h,0,0];seen[i]=1;
  for(let n=0;n<pixels.length;n++){
   const p=pixels[n],x=p%w,y=Math.floor(p/w);bounds[0]=Math.min(bounds[0],x);bounds[1]=Math.min(bounds[1],y);bounds[2]=Math.max(bounds[2],x+1);bounds[3]=Math.max(bounds[3],y+1);
   for(const j of [x?p-1:-1,x<w-1?p+1:-1,p-w,p+w])if(j>=0&&j<seen.length&&!seen[j]&&data[j*4+3]){seen[j]=1;pixels.push(j);}
  }
  components.push({pixels,bounds});
 }
 components.sort((a,b)=>b.pixels.length-a.pixels.length);
 const main=components.slice(0,8);if(main.length!==8||main.some(c=>c.pixels.length<1000)||components[8]?.pixels.length>100)throw Error('Ambiguous component segmentation');
 for(const extra of components.slice(8)){
  const b=extra.bounds,x=(b[0]+b[2])/2,y=(b[1]+b[3])/2;
  const distance=c=>{const z=c.bounds;return Math.hypot(Math.max(z[0]-x,0,x-z[2]),Math.max(z[1]-y,0,y-z[3]));};
  const nearest=[...main].sort((a,b)=>distance(a)-distance(b))[0];if(distance(nearest)>12)throw Error('Detached component needs visual review');
  nearest.pixels.push(...extra.pixels);nearest.bounds=[Math.min(nearest.bounds[0],b[0]),Math.min(nearest.bounds[1],b[1]),Math.max(nearest.bounds[2],b[2]),Math.max(nearest.bounds[3],b[3])];
 }
 main.sort((a,b)=>(a.bounds[1]+a.bounds[3])-(b.bounds[1]+b.bounds[3]));
 const ordered=[...main.slice(0,4).sort((a,b)=>a.bounds[0]-b.bounds[0]),...main.slice(4).sort((a,b)=>a.bounds[0]-b.bounds[0])];
 return ordered.map(c=>{
  const [l,t,r,b]=c.bounds,x=Math.max(0,l-3),y=Math.max(0,t-3),width=Math.min(w,r+3)-x,height=Math.min(h,b+3)-y,rgba=new Uint8ClampedArray(width*height*4);
  for(const p of c.pixels){const j=((Math.floor(p/w)-y)*width+p%w-x)*4;rgba.set(data.subarray(p*4,p*4+4),j);}
  return {width,height,data:rgba,sourceCrop:[x,y,width,height]};
 });
}
