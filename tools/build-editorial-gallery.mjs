import fs from 'node:fs/promises';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),ctx={window:{}};vm.runInNewContext(await fs.readFile(process.env.QA_CONTENT_PATH||path.join(root,'content.js'),'utf8'),ctx);const d=ctx.window.ACUMELO;
const active=[...new Set(d.mediaAssignments.filter(a=>a.status==='active'&&a.placement!=='owner-library').map(a=>a.mediaId))].map(id=>d.mediaCatalog[id]);assert.equal(active.length,38);
let html=await fs.readFile(path.join(root,'assets/media/20261123c/index.html'),'utf8');
let count=0;
html=html.replace(/<article\b[\s\S]*?<\/article>/g,card=>{
 const filename=card.match(/<source src="([^"]+)"/)?.[1];assert(filename);
 const stem=filename.replace(/-20261123c\.mp4$/,'');const asset=active.find(a=>a.src.split('/').pop().replace(/-2026112[34][cd]\.mp4$/,'')===stem);assert(asset,stem);count++;
 card=card.replace('<article ',`<article data-media-id="${asset.mediaId}" `).replace(/poster="[^"]*"/,`poster="../../../${asset.poster}"`).replace(/<source src="[^"]+"/,`<source src="../../../${asset.src}"`);
 card=card.replace(/<track\b[^>]*>/g,'').replace('</video>',(asset.captions||[]).map(c=>`<track kind="captions" label="English" srclang="en" src="../../../${c.src}">`).join('')+'</video>');
 if(asset.kind==='project')card=card.replace('Original project concepts · synthetic narration + original music','Shared project concepts · original music only');
 return card;
});
assert.equal(count,38);
html=html.replace('Media review v3','Media review v4').replace('MEDIA REVIEW 03','MEDIA REVIEW 04')
 .replace('Every film includes English narration and background music.','Demonstrations use temporary synthetic English narration and original music. Shared project concepts use music only.')
 .replace('모든 영상에 영어 합성 해설과 자체 제작 배경음이 포함됩니다.','시연은 임시 영어 합성 해설과 자체 배경음, 공통 프로젝트 예시는 배경음만 사용합니다.')
 .replace('공통 프로젝트 예시 · 영어 합성 해설과 자체 배경음','공통 프로젝트 예시 · 자체 제작 배경음만 사용');
await fs.mkdir(path.join(root,'assets/media/20261124d'),{recursive:true});await fs.writeFile(path.join(root,'assets/media/20261124d/index.html'),html);
console.log('Built bilingual 38-film gallery from active assignments; music-only project clips have no narration captions.');
