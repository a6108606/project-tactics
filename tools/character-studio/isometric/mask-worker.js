import {prepare} from './sprite.js';
self.onmessage=({data:{pixels,recipe}})=>{try{const asset=prepare(pixels,recipe);self.postMessage({asset},[asset.source.buffer,...Object.values(asset.masks).map(m=>m.buffer)]);}catch(e){self.postMessage({error:e.message});}};
