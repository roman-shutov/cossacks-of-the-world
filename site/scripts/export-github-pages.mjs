import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EXPORT_URL||'http://localhost:3142';
const root=path.resolve('..');
const source=await fs.readFile('app/page.tsx','utf8');
const slugs=[...source.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(x=>x[1]);
const routes=['/','/ru/news','/ru/history','/ru/label','/ru/heritage','/ru/about','/ru/join',...slugs.map(s=>'/ru/news/'+s)];
for(const route of routes){
 const response=await fetch(base+route);if(!response.ok)throw Error(`${route}: ${response.status}`);
 const html=await response.text();if(!html.includes('Казаки'))throw Error('Missing site markup');
 const out=path.join(root,route,'index.html');await fs.mkdir(path.dirname(out),{recursive:true});await fs.writeFile(out,html);
}
for(const name of ['_next','audio','images','favicon.png','favicon.svg','version.json']){
 await fs.cp(path.join('dist/client',name),path.join(root,name),{recursive:true,force:true});
}
await fs.copyFile(path.join(root,'index.html'),path.join(root,'404.html'));
console.log(`Exported ${routes.length} routes and static assets`);
