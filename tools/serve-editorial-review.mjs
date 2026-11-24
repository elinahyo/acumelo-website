// Explicit headless-review server: streams versioned public Git media, stores no videos.
import http from 'node:http';import fs from 'node:fs/promises';import path from 'node:path';import {Readable} from 'node:stream';
const root=path.resolve(import.meta.dirname,'..'),ref=process.env.QA_MEDIA_REF;
if(!ref||!/^(?:codex\/media-v4-render-\d+|[a-f0-9]{40})$/.test(ref))throw Error('Set QA_MEDIA_REF to the verified render branch or commit');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.vtt':'text/vtt; charset=utf-8'};
http.createServer(async(req,res)=>{try{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
 const relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '')||'index.html';
 if(relative.split('/').some(p=>p.startsWith('.'))||relative.includes('\\')){res.writeHead(403).end();return;}
 let file=path.resolve(root,relative);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(relative==='index.html'&&process.env.QA_INDEX_OVERRIDE)file=path.resolve(process.env.QA_INDEX_OVERRIDE);
 const local=await fs.stat(file).catch(()=>null);
 if(!local&&relative.startsWith('assets/media/20261124d/')){
  const upstream=await fetch('https://raw.githubusercontent.com/elinahyo/acumelo-website/'+ref+'/'+relative,{method:req.method,headers:req.headers.range?{Range:req.headers.range}:{}});
  const headers={'Content-Type':types[path.extname(relative)]||'application/octet-stream','Cache-Control':'no-store'};
  for(const h of ['content-length','content-range','accept-ranges'])if(upstream.headers.has(h))headers[h]=upstream.headers.get(h);
  res.writeHead(upstream.status,headers);if(upstream.body){const stream=Readable.fromWeb(upstream.body);res.on('close',()=>stream.destroy());stream.on('error',()=>res.destroy());stream.pipe(res);}else res.end();return;
 }
 if(!local?.isFile()){res.writeHead(404).end();return;}
 let start=0,end=local.size-1,status=200;const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
 if(req.headers.range){const m=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range);if(!m){res.writeHead(416).end();return;}start=Number(m[1]);end=m[2]?Math.min(end,Number(m[2])):end;if(start>end){res.writeHead(416).end();return;}status=206;headers['Content-Range']=`bytes ${start}-${end}/${local.size}`;}
 headers['Content-Length']=end-start+1;res.writeHead(status,headers);if(req.method==='HEAD'){res.end();return;}
 const handle=await fs.open(file),stream=handle.createReadStream({start,end,autoClose:true});res.on('close',()=>stream.destroy());stream.on('error',()=>res.destroy());stream.pipe(res);
}catch(error){if(!res.headersSent)res.writeHead(502);res.end();console.error(error.message);}}).listen(Number(process.env.PORT||8792),'127.0.0.1',()=>console.log('Headless editorial review server ready; no browser opened.'));
