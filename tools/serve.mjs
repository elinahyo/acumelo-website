// Dependency-free preview server. Run explicitly; it never launches a browser.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon','.mp4':'video/mp4','.vtt':'text/vtt; charset=utf-8','.txt':'text/plain; charset=utf-8'};
http.createServer(async (req,res) => {
  try {
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405).end();return;}
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const relative=pathname.replace(/^\/+/, '') || 'index.html';
    if (relative.split('/').some(p=>p.startsWith('.')) || relative.includes('\\')) {res.writeHead(403).end();return;}
    const file=path.resolve(root,relative);
    if (!file.startsWith(root+path.sep)) {res.writeHead(403).end();return;}
    const stat=await fs.stat(file);
    if (!stat.isFile()) {res.writeHead(404).end();return;}
    let start=0,end=stat.size-1,status=200;
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
    if(req.headers.range) {
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1]&&!match[2])) {res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return;}
      if(match[1]) {start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;}
      else start=Math.max(0,stat.size-Number(match[2]));
      if(start>end || start>=stat.size) {res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return;}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length']=Math.max(0,end-start+1);
    res.writeHead(status,headers);
    if(req.method==='HEAD'||stat.size===0){res.end();return;}
    const handle=await fs.open(file);
    const stream=handle.createReadStream({start,end,autoClose:true});
    stream.on('error',()=>res.destroy());
    res.on('close',()=>stream.destroy());
    stream.pipe(res);
  } catch(error) {if(!res.headersSent)res.writeHead(error.code==='ENOENT'?404:400);res.end();}
}).listen(Number(process.env.PORT||8765),process.env.HOST||'127.0.0.1',()=>console.log(`Preview listening on port ${process.env.PORT||8765}. Press Ctrl+C to stop.`));
