import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const source=path.resolve('editorial-output'),dest=path.resolve('assets/media/20261124d');
const manifest=JSON.parse(fs.readFileSync(path.join(source,'editorial-manifest.json'),'utf8')),qa=JSON.parse(fs.readFileSync(path.join(source,'validation-report.json'),'utf8'));
assert.equal(qa.passed,true);assert.equal(qa.films,17);assert.equal(manifest.media.length,17);
const allowed=['editorial-manifest.json','validation-report.json'];
for(const f of manifest.media){assert(/^[a-z0-9-]+$/.test(f.stem));allowed.push(f.path,f.poster,'metadata/'+f.stem+'.json','proofs/'+f.id+'.jpg');if(f.subtitlePath)allowed.push(f.subtitlePath);}
const files=[];
for(const relative of allowed){assert(!relative.includes('..')&&/\.(mp4|jpg|vtt|json)$/.test(relative));const bytes=fs.readFileSync(path.join(source,relative));const target=path.join(dest,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);files.push({path:'assets/media/20261124d/'+relative,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}
fs.writeFileSync(path.join(dest,'delivery-map.json'),JSON.stringify({status:'technical-qa-passed-editorial-review-required',revision:'20261124d',files},null,2));
console.log('Staged only public MP4/JPG/VTT/JSON. No WAV, model, private archive or website mapping changes.');
