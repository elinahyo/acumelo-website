import fs from 'node:fs';
const p=new URL('./visuals.mjs',import.meta.url);let s=fs.readFileSync(p,'utf8');
s=s.replace("const metricValues=v===8?", "const metricValues=v===10?['$248.6k','62.4%','+12.8%','78.2%']:v===6?['224 /s','83.2%','164 ms','1.2 GB']:v===9?['83%','4','8.2 days','+3.1%']:v===2?['1,240','43.1%','68.4%','41']:v===5?['24','91.7%','6','4.2%']:v===8?");
s=s.replace("const metrics=v===7?", "const metrics=v===10?['Revenue','Gross margin','YoY growth','Retention']:v===6?['Query rate','Cache hit rate','Latency p95','Data scanned']:v===9?['On track','Blocked tasks','Lead time','Budget variance']:v===2?['New accounts','Activation','Week 1 retention','NPS']:v===5?['Creative assets','Approved','Variants','Engagement']:v===7?");
fs.writeFileSync(p,s);
const h=new URL('./output/index.html',import.meta.url);let html=fs.readFileSync(h,'utf8');html=html.replace("const manifest=await", "const initialHash=location.hash;const manifest=await");html=html.replace("if(location.hash&&items.some(m=>m.id===location.hash.slice(1)))select(location.hash.slice(1))", "if(initialHash&&items.some(m=>m.id===initialHash.slice(1)))select(initialHash.slice(1))");fs.writeFileSync(h,html);
