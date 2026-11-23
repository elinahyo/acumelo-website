import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const hasWorkspace=await fs.access(path.join(root,'preview/content.js')).then(()=>true,()=>false);
const file=path.join(root,hasWorkspace?'publish/github-pages':'','assets/media/20261123c/index.html');
let html=await fs.readFile(file,'utf8');
const marker='<!-- ACUMELO GALLERY LOCALE -->';
if(html.includes(marker))html=html.slice(0,html.indexOf(marker))+'</html>';
const script=String.raw`
(() => {
const fields={workflow:'AI 업무혁신·자동화',strategy:'AI 기획·프로젝트 관리',design:'AI 디자인·콘텐츠',analytics:'AI 데이터 분석',marketing:'AI 마케팅·세일즈',development:'AI 서비스 개발'};
const header=document.querySelector('header'),heading=header.querySelector('h1'),intro=header.querySelector('p'),notice=header.querySelector('.small');
const originals=new Map([...document.querySelectorAll('h1,h2,header p,option,article p,article .label')].map(n=>[n,n.innerHTML]));
const nav=document.createElement('nav');nav.className='language-controls';nav.setAttribute('aria-label','Language');
for(const [code,label] of [['en','English'],['ko','한국어']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.language=code;b.addEventListener('click',()=>setLanguage(code,true));nav.append(b)}header.prepend(nav);
const originalUpdate=update;
let language='en';
update=()=>{originalUpdate();if(language==='ko')document.getElementById('count').textContent=cards.filter(c=>!c.hidden).length+'개 영상'};
function setLanguage(code,save){
 document.querySelectorAll('video').forEach(v=>v.pause());language=code;document.documentElement.lang=code;
 if(save)try{localStorage.setItem('acumelo.language',code)}catch{}
 for(const [node,value] of originals)node.innerHTML=value;
 nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===code)));
 for(const [id,en,ko] of [['field','Field','교육 분야'],['person','Instructor','강사'],['kind','Film type','영상 유형']])document.getElementById(id).setAttribute('aria-label',code==='ko'?ko:en);
 if(code==='ko'){
  heading.innerHTML='구현 과정을 배우고,<br>가능성을 확인하세요.';
  intro.textContent='강사·분야별 시연 26편, 분야별 개요 6편, 분야마다 프로젝트 콘셉트 24개를 담은 결과물 예시 6편입니다. 모든 영상에 영어 합성 해설과 자체 제작 배경음이 포함됩니다.';
  notice.textContent='공식 자료를 참고해 화면을 재구성한 교육용 예시입니다. 실제 프로그램 녹화·강사 목소리·수강생 제출물이나 고객 실적이 아닙니다. Higgsfield 장면은 Cinema Studio 2.0을 참고했으며, 교육 도구 범위와 영상에 등장하는 도구 범위는 다릅니다. 직접 재생해야 소리가 나옵니다.';
  document.querySelector('#field option[value=""]').textContent='전체 교육 분야';
  for(const option of document.querySelectorAll('#field option'))if(fields[option.value])option.textContent=fields[option.value];
  document.querySelector('#person option[value=""]').textContent='전체 강사 및 공통 영상';
  for(const [value,label] of [['','전체 영상 유형'],['demo','시연'],['showcase','프로젝트 예시']])document.querySelector('#kind option[value="'+value+'"]').textContent=label;
  for(const card of cards){
   const project=card.dataset.kind==='showcase',field=fields[card.dataset.field],person=card.dataset.person;
   card.querySelector('h2').textContent=(card.dataset.scope==='instructor'?person+' · ':'')+field+(project?' · 결과물 예시':' · 시연');
   card.querySelector('.label').textContent=project?'공통 프로젝트 콘셉트':(person+' / 교육용 시연');
   const info=card.querySelector('p'),seconds=originals.get(info).match(/(\d+) sec/);
   info.textContent=field+(seconds?' · '+seconds[1]+'초':'')+(project?' · 콘셉트 24개':'');
   card.querySelector('.small').textContent=project?'공통 프로젝트 예시 · 영어 합성 해설과 자체 배경음':'화면 재구성 예시 · 임시 영어 합성 해설과 자체 배경음';
  }
 }
 update();
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)document.querySelectorAll('video').forEach(v=>v.pause())});
window.addEventListener('pagehide',()=>document.querySelectorAll('video').forEach(v=>v.pause()));
let saved='en';try{if(localStorage.getItem('acumelo.language')==='ko')saved='ko'}catch{}setLanguage(saved,false);
})();`;
const css='<style>article,header,main{min-width:0;overflow-wrap:anywhere}.filters select{min-width:0;flex:1 1 200px;width:100%}.language-controls{display:flex;gap:8px;margin-bottom:24px}.language-controls button{min-height:44px;padding:8px 16px;color:inherit;background:transparent;border:1px solid #506985;border-radius:6px;font:inherit}.language-controls button[aria-pressed="true"]{background:#29415e}.language-controls button:focus-visible{outline:2px solid #efb99a;outline-offset:3px}</style>';
html=html.replace('</html>',marker+css+'<script>'+script+'</script></html>');
await fs.writeFile(file,html);console.log('Prepared bilingual 38-film gallery; manual audio and captions preserved.');
