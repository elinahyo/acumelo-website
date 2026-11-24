import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
const arg=(key,fallback)=>{const i=process.argv.indexOf('--'+key);return i<0?fallback:process.argv[i+1]};
const out=path.resolve(arg('output','editorial-output')),source=path.resolve(arg('media','assets/media/20261123c')),ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
const expectedIds={Chris:['workflow','strategy','design','analytics','marketing','development'].map(f=>'chris-'+f+'-demo'),Sage:['strategy','design','development'].map(f=>'sage-'+f+'-demo'),Pillow:['design','development'].map(f=>'pillow-'+f+'-demo'),showcase:['workflow','strategy','design','analytics','marketing','development'].map(f=>f+'-showcase')};
const expected=arg('only','all')==='all'?Object.values(expectedIds).flat():arg('only','all').split(',');
const voices={Chris:'am_michael',Sage:'af_heart',Pillow:'af_nicole'},speakers={Chris:'instructor-chris',Sage:'instructor-sage',Pillow:'instructor-03'};
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function run(binary,args){const p=spawnSync(binary,args,{encoding:'utf8',windowsHide:true,maxBuffer:20*1024*1024});assert.equal(p.status,0,p.stderr||p.error?.message);return p.stdout;}
const records=fs.readdirSync(path.join(out,'metadata')).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(out,'metadata',f),'utf8')));
assert.deepEqual(records.map(f=>f.id).sort(),[...expected].sort());
for(const f of records){
 assert.equal(f.revision,'20261124d');assert.equal(f.illustrative,true);assert.equal(f.contentOwnerId,'instructor-chris');
 const file=path.join(out,f.path);assert.equal(hash(file),f.sha256);assert.equal(fs.statSync(file).size,f.bytes);assert(f.bytes<95*1024*1024);
 if(process.argv.includes('--manifest-only')){assert(f.technicalQa?.passed&&f.technicalQa?.fullDecode);}else{
  const probe=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file]));
  const video=probe.streams.find(s=>s.codec_type==='video'),audio=probe.streams.find(s=>s.codec_type==='audio');
  assert.equal(video.codec_name,'h264');assert.equal(video.width,1280);assert.equal(video.height,720);assert.equal(video.pix_fmt,'yuv420p');assert.equal(video.r_frame_rate,'30/1');assert.equal(audio.codec_name,'aac');
  assert(Math.abs(Number(probe.format.duration)-f.durationSeconds)<0.2);
  run(ffmpeg,['-v','error','-i',file,'-f','null','-']);
  const vol=spawnSync(ffmpeg,['-hide_banner','-i',file,'-vn','-af','volumedetect','-f','null','-'],{encoding:'utf8',maxBuffer:2*1024*1024});assert.equal(vol.status,0);
  const peak=Number(vol.stderr.match(/max_volume:\s*(-?[\d.]+) dB/)?.[1]);assert(Number.isFinite(peak)&&peak>-45&&peak<=0);
  f.technicalQa={passed:true,fullDecode:true,peakDb:peak};
 }
 assert(fs.existsSync(path.join(out,f.poster)));assert(fs.existsSync(path.join(out,'proofs',f.id+'.jpg')));
 if(f.scope==='instructor'){
  assert.equal(f.voiceId,voices[f.name]);assert.equal(f.speakerId,speakers[f.name]);assert.equal(f.assignedInstructorId,speakers[f.name]);assert(f.hasNarration&&f.hasMusic);assert(f.audioCopiedVerified);
  const original=path.join(source,f.id+'-20261123c.mp4');assert.equal(hash(original),f.sourceVideoSha256);
  if(!process.argv.includes('--manifest-only')){
   const audioHash=p=>run(ffmpeg,['-v','error','-i',p,'-map','0:a:0','-c','copy','-f','hash','-hash','sha256','-']).trim();
   assert.equal(audioHash(file),audioHash(original));assert.equal(audioHash(file),f.audioStreamSha256);
  }
  assert(fs.readFileSync(path.join(out,f.subtitlePath),'utf8').startsWith('WEBVTT'));
 }else{
  assert.equal(f.kind,'showcase');assert.equal(f.hasNarration,false);assert.equal(f.voiceId,null);assert.equal(f.speakerId,null);assert.equal(f.audioRole,'music-only');assert.equal(f.subtitlePath,null);
  f.voice=null;f.assignedInstructorId=null;f.narration=null;
 }
 f.status='technical-qa-passed-editorial-review-required';
 fs.writeFileSync(path.join(out,'metadata',f.stem+'.json'),JSON.stringify(f,null,2));
}
const manifest={revision:'20261124d',status:'technical-qa-passed-editorial-review-required',sourceRevision:'20261123c',media:records};
fs.writeFileSync(path.join(out,'editorial-manifest.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(out,'validation-report.json'),JSON.stringify({passed:true,films:records.length,editorialApproval:false,checks:'Full decode, H264/AAC, dimensions/fps/duration, volume, exact instructor AAC packet hash, speaker assignment, music-only provenance, captions and posters',results:records.map(f=>({id:f.id,sha256:f.sha256,voiceId:f.voiceId,speakerId:f.speakerId,hasNarration:f.hasNarration,audioRole:f.audioRole,passed:true}))},null,2));
console.log(JSON.stringify({passed:true,films:records.length,editorialApproval:false}));
