// Lossless, dependency-free codec for non-interlaced 8-bit RGB/RGBA PNG sources.
import {inflateSync,deflateSync} from 'node:zlib';
const signature=Buffer.from([137,80,78,71,13,10,26,10]);
export function decode(buffer){
  if(!buffer.subarray(0,8).equals(signature))throw Error('Not PNG');
  let width,height,channels,transparent;const parts=[];
  for(let at=8;at<buffer.length;){const n=buffer.readUInt32BE(at),type=buffer.toString('ascii',at+4,at+8),chunk=buffer.subarray(at+8,at+8+n);at+=n+12;
    if(at>buffer.length)throw Error('PNG tronqué.');if(buffer.readUInt32BE(at-4)!==crc(buffer.subarray(at-n-8,at-4)))throw Error('PNG : CRC invalide.');
    if(type==='IHDR'){width=chunk.readUInt32BE(0);height=chunk.readUInt32BE(4);channels=chunk[9]===6?4:chunk[9]===2?3:0;if(chunk[8]!==8||chunk[12]!==0||!channels)throw Error('PNG requis : RGB/RGBA 8 bits, sans entrelacement. Conserver l’original si une copie technique est nécessaire.');if(!width||!height||width*height>32_000_000)throw Error('PNG trop grand.');}
    if(type==='tRNS'){if(channels!==3||n!==6)throw Error('Transparence PNG non prise en charge.');transparent=[0,2,4].map(p=>chunk.readUInt16BE(p));}
    if(type==='IDAT')parts.push(chunk);
  }
  if(!width||!parts.length)throw Error('PNG incomplet.');
  const expected=(width*channels+1)*height,raw=inflateSync(Buffer.concat(parts),{maxOutputLength:expected});if(raw.length!==expected)throw Error('Longueur PNG incorrecte.');
  const stride=width*channels,pixels=new Uint8Array(stride*height);let p=0;
  const paeth=(a,b,c)=>{const v=a+b-c,da=Math.abs(v-a),db=Math.abs(v-b),dc=Math.abs(v-c);return da<=db&&da<=dc?a:db<=dc?b:c;};
  for(let y=0;y<height;y++){const filter=raw[p++];if(filter>4)throw Error('Invalid PNG filter');for(let x=0;x<stride;x++){const i=y*stride+x,a=x>=channels?pixels[i-channels]:0,b=y?pixels[i-stride]:0,c=y&&x>=channels?pixels[i-stride-channels]:0;pixels[i]=(raw[p++]+[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;}}
  const data=new Uint8ClampedArray(width*height*4);for(let i=0;i<width*height;i++){data.set(pixels.subarray(i*channels,i*channels+channels),i*4);if(channels===3)data[i*4+3]=transparent&&transparent.every((v,c)=>v===pixels[i*3+c])?0:255;}
  return {width,height,data};
}
function crc(bytes){let n=0xffffffff;for(const b of bytes){n^=b;for(let i=0;i<8;i++)n=(n>>>1)^((n&1)?0xedb88320:0);}return (n^0xffffffff)>>>0;}
function chunk(type,data){const name=Buffer.from(type),n=Buffer.alloc(4),sum=Buffer.alloc(4);n.writeUInt32BE(data.length);sum.writeUInt32BE(crc(Buffer.concat([name,data])));return Buffer.concat([n,name,data,sum]);}
export function encode(width,height,data){const header=Buffer.alloc(13);header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;const raw=Buffer.alloc((width*4+1)*height);for(let y=0;y<height;y++)Buffer.from(data.slice(y*width*4,(y+1)*width*4)).copy(raw,y*(width*4+1)+1);return Buffer.concat([signature,chunk('IHDR',header),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
export function crop(image,box){const [x,y,width,height]=box,data=new Uint8ClampedArray(width*height*4);for(let row=0;row<height;row++)data.set(image.data.subarray(((y+row)*image.width+x)*4,((y+row)*image.width+x+width)*4),row*width*4);return {width,height,data};}
