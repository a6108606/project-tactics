/** Exact integer crop used by V2 on its normalized 1100 × 1400 grid. */
export function rectPixels(h,box) {
  if(!box)return [0,0,h.width,h.height];
  const x=Math.round(box[0]*h.width/1100),y=Math.round(box[1]*h.height/1400);
  return [x,y,Math.round(box[2]*h.width/1100)-x,Math.round(box[3]*h.height/1400)-y];
}
