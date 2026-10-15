/** Separate bounded histories for each appearance; callers keep persistence separate. */
export class History {
  constructor(limit=40){this.limit=limit;this.entries=new Map();}
  entry(key){if(!this.entries.has(key))this.entries.set(key,{past:[],future:[]});return this.entries.get(key);}
  remember(key,before,after){if(JSON.stringify(before)===JSON.stringify(after))return;const e=this.entry(key);e.past.push(structuredClone(before));if(e.past.length>this.limit)e.past.shift();e.future=[];}
  undo(key,current){const e=this.entry(key);if(!e.past.length)return null;e.future.push(structuredClone(current));return e.past.pop();}
  redo(key,current){const e=this.entry(key);if(!e.future.length)return null;e.past.push(structuredClone(current));return e.future.pop();}
  clear(key){this.entries.delete(key);}
  status(key){const e=this.entry(key);return {undo:e.past.length>0,redo:e.future.length>0};}
}
