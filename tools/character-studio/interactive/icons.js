const ICONS={
 person:'<circle cx="12" cy="6" r="3"/><path d="M5 21v-4a7 7 0 0 1 14 0v4M8 21v-5m8 5v-5"/>',
 palette:'<path d="M21 12a9 9 0 1 0-9 9h1a2 2 0 0 0 0-4 2 2 0 0 1 0-4h5a3 3 0 0 0 3-1Z"/><circle cx="7" cy="10" r="1"/><circle cx="10" cy="6" r="1"/><circle cx="15" cy="6" r="1"/>',
 sword:'<path d="m4 20 3-3m-2-4 6 6m-3-5 9-11h4v4L10 16"/>',
 undo:'<path d="M4 10h10a6 6 0 0 1 0 12M4 10l5-5m-5 5 5 5" transform="translate(0 -2)"/>',
 redo:'<path d="M20 10H10a6 6 0 0 0 0 12m10-12-5-5m5 5-5 5" transform="translate(0 -2)"/>',
 compare:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 2v20M5 17l4-5m7 1 3 4"/>',

 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/><path d="M12 14v3"/>',
 gallery:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
 chevron:'<path d="m6 9 6 6 6-6"/>',code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-7 5 7"/>',file:'<path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8M8 17h6"/>',shuffle:'<path d="M3 6h3l12 12h3m-3-3 3 3-3 3M3 18h3l4-4m4-4 4-4h3m-3-3 3 3-3 3"/>',reset:'<path d="M3 11a9 9 0 1 1 3 7M3 4v7h7"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.1"/>',check:'<path d="m5 12 4 4L20 5"/>',expand:'<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>',users:'<circle cx="8" cy="7" r="3"/><path d="M2 21v-3a6 6 0 0 1 12 0v3M15 4a3 3 0 0 1 0 6m2 5a5 5 0 0 1 5 5v1"/>',minus:'<path d="M5 12h14"/>',plus:'<path d="M5 12h14M12 5v14"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>'};
export function icon(name,size=15){return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[name]||ICONS.info)+'</svg>'}
export function injectIcons(root=document){root.querySelectorAll('[data-icon]').forEach(n=>n.innerHTML=icon(n.dataset.icon,Number(n.dataset.size)||15))}
