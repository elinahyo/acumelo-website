// Deterministic screen UI illustrations. All interfaces/data are illustrative.
export const W=1280,H=720,FPS=30,DURATION=15;
export const themes={workflow:["#77e7b0","#122c29"],strategy:["#bdadff","#29213f"],design:["#ffadbd","#3c2236"],analytics:["#7dcaff","#142b43"],marketing:["#ffc080","#3c2a1d"],development:["#9faeff","#20253f"]};
export const names={workflow:"AI Workflow & Automation",strategy:"AI Strategy & Project Management",design:"AI Design & Content",analytics:"AI Data Analytics",marketing:"AI Marketing & Sales",development:"AI Service Development"};
let c,accent,lightAccent,ink="#172132",muted="#758297",paper="#ffffff",t=0,idx=0,entry,cat,kind;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
const n=(v,max=1)=>clamp(v)*max;
function rr(x,y,w,h,r=12,fill=paper,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
function tx(s,x,y,size=16,color=ink,weight=400,font="Arial",align="left"){c.font=weight+" "+size+"px "+font;c.fillStyle=color;c.textAlign=align;c.textBaseline="alphabetic";c.fillText(String(s),x,y);c.textAlign="left"}
function line(x1,y1,x2,y2,color="#dce2eb",width=1){c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke()}
function dot(x,y,r=4,color=accent){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
function foreground(color){const hex=color.replace('#','');const rgb=(hex.length===3?hex.split('').map(v=>v+v).join(''):hex).match(/.{2}/g).slice(0,3).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>.21?ink:'#fff'}
function brighten(color){const hex=color.replace('#','');return '#'+hex.match(/.{2}/g).slice(0,3).map(v=>Math.round(parseInt(v,16)*.5+127.5).toString(16).padStart(2,'0')).join('')}
function tag(label,x,y,w=100,color=accent){rr(x,y,w,23,7,color);tx(label,x+9,y+16,11,foreground(color),700)}
function card(x,y,w,h,title,sub){rr(x,y,w,h,11,paper,"#e2e7ef");if(title)tx(title,x+18,y+28,17,ink,700);if(sub)tx(sub,x+18,y+49,11,muted)}
function bars(x,y,w,h,count=8,p=.8){for(let i=0;i<count;i++){const val=.2+(((i*17+idx*7)%23)/30);rr(x+i*w/count,y+h-h*val*smooth(p+i*.02),w/count-11,h*val*smooth(p+i*.02),4,i===idx%count?accent:"#b7c5df")}}
function chart(x,y,w,h,series=0){for(let j=0;j<4;j++)line(x,y+j*h/3,x+w,y+j*h/3);c.beginPath();for(let i=0;i<30;i++){const xx=x+i*w/29,yy=y+h*.8-(i/29)*h*.55-Math.sin(i*.55+series)*h*.12; if(i===0)c.moveTo(xx,yy);else c.lineTo(xx,yy)}c.strokeStyle=accent;c.lineWidth=3;c.stroke();const k=clamp(t)*29;const px=x+k*w/29,py=y+h*.8-(k/29)*h*.55-Math.sin(k*.55+series)*h*.12;dot(px,py,6,accent)}
function ghostLines(x,y,w,count=4,gap=18){for(let i=0;i<count;i++)rr(x,y+i*gap,w*(.65+((i*7+idx)%7)/20),5,2,"#dfe5ed")}
function fit(s,x,y,w,size=16,color=ink,weight=400,font="Arial"){s=String(s);c.font=weight+" "+size+"px "+font;while(c.measureText(s).width>w&&s.length>1)s=s.slice(0,-2)+"…";tx(s,x,y,size,color,weight,font)}
function wrap(s,x,y,w,size=15,color=ink,leading=22,max=3,weight=400){let words=String(s).split(/\s+/),str="",row=0;c.font=weight+" "+size+"px Arial";for(const word of words){if(c.measureText(str+" "+word).width>w&&str){tx(str,x,y+row*leading,size,color,weight);str=word;if(++row>=max)return}else str+=(str?" ":"")+word}if(row<max)tx(str,x,y+row*leading,size,color,weight)}
const content=()=>entry.content||{};
const bullets=()=>content().bullets||[entry.action||entry.subtitle||"Review the input and context","Make the next action explicit","Check the outcome with the team"];
const labels=()=>content().labels||["Input","Review","Decision","Output","Follow-up"];
const stages=()=>content().stages||["Discover","Prepare","Build","Review","Deliver"];
function bulletText(x,y,w,size=15,gap=48,color=ink){bullets().slice(0,3).forEach((s,j)=>{dot(x+4,y-5+j*gap,3,accent);wrap(s,x+20,y+j*gap,w-24,size,color,21,2)})}
function cursor(x,y,click=true){c.save();c.translate(x,y);c.beginPath();c.moveTo(0,0);c.lineTo(0,25);c.lineTo(7,18);c.lineTo(13,29);c.lineTo(19,26);c.lineTo(12,16);c.lineTo(22,15);c.closePath();c.fillStyle="#172132";c.fill();c.strokeStyle="#fff";c.lineWidth=2;c.stroke();if(click){c.beginPath();c.arc(3,3,12+10*t,0,Math.PI*2);c.strokeStyle=accent;c.globalAlpha=.7*(1-t);c.lineWidth=3;c.stroke()}c.restore()}
function miniIcon(type,x,y,size=32){rr(x,y,size,size,8,accent);tx(type.slice(0,1).toUpperCase(),x+size/2,y+size*.7,size*.55,foreground(accent),700,"Arial","center")}
function header(title,sub){fit(title,248,242,919,24,ink,700);fit(sub||entry.subtitle||entry.detail||"Explore, build, iterate.",248,267,919,13,muted)}
function spreadsheet(){
  const cols=content().tableHeaders||["Record","Owner","Status","Next action"],rows=content().tableRows||[["Example 01","Alex","Review","Check input"],["Example 02","Sam","Ready","Confirm"]];
  tx("fx",247,234,16,muted,700);rr(280,215,907,30,4,"#f3f6fa");fit(content().formula||"A1:"+String.fromCharCode(64+cols.length)+(rows.length+1),294,235,879,14,"#47546c",400,"Consolas");
  const x=247,y=277,rh=37,cw=925/cols.length;
  cols.forEach((h,i)=>{rr(x+i*cw,254,cw-1,22,0,"#f2f5fa");tx(String.fromCharCode(65+i),x+i*cw+cw/2,269,11,muted,700,"Arial","center");rr(x+i*cw,y,cw-1,rh,0,"#e5ecf5");fit(h,x+i*cw+12,y+24,cw-24,13,ink,700)});
  for(let j=0;j<6;j++)cols.forEach((h,i)=>{const active=j===Math.min(rows.length-1,Math.floor(t*rows.length));rr(x+i*cw,y+(j+1)*rh,cw-1,rh-1,0,active?"#e7f8f1":"#fff");fit(rows[j]?.[i]??"",x+i*cw+12,y+(j+1)*rh+24,cw-24,13,ink)});
  c.strokeStyle="#26aa77";c.lineWidth=2;c.strokeRect(x+cw*(cols.length-1),y+rh,cw,rh*Math.min(6,rows.length));
  stages().slice(0,3).forEach((s,i)=>{tag(String(i+1),250+i*309,570,29);fit(s,287+i*309,587,254,12,muted,700)});cursor(x+cw*(cols.length-1)+30,y+rh*(1.5+t*Math.min(5,rows.length-1)),true);
}
function slides(){
  const x=248,y=220;rr(x,y,138,373,8,"#eff2f7");for(let i=0;i<4;i++){rr(x+13,y+13+i*88,112,72,5,i===Math.floor(t*3.7)?"#e4e4fc":"#fff","#d9dfeb");tx("0"+(i+1),x+22,y+33+i*88,10,muted);ghostLines(x+24,y+48+i*88,78,2,10)}
  const sx=407,sy=220;rr(sx,sy,764,373,7,idx%2?"#16253a":"#283146");fit(entry.title,sx+42,sy+67,680,31,"#fff",700);fit(content().kicker||entry.action||"INSIGHT → DECISION → ACTION",sx+42,sy+101,670,13,lightAccent,700);
  if(idx%3===0){bulletText(sx+46,sy+159,390,18,68,"#fff");bars(sx+480,sy+155,231,157,4,t+.2);tx("ILLUSTRATIVE COMPARISON",sx+480,sy+339,10,"#bdc9da",700)}else for(let i=0;i<3;i++){const dx=sx+42+i*230;rr(dx,sy+145,207,175,10,["#26415b","#2c4d5d","#365063"][i]);tx(["01","02","03"][i],dx+19,sy+181,26,lightAccent,700);fit(stages()[i%stages().length],dx+19,sy+216,173,18,"#fff",700);wrap(bullets()[i%bullets().length],dx+19,sy+245,169,13,"#e0e8f1",19,3);rr(dx+20,sy+308,158*smooth(t+i*.18),4,2,accent)}
  cursor(sx+160+t*435,sy+280);
}
function email(){
  rr(247,216,247,390,8,"#f2f5fa");tx("Inbox",266,246,23,ink,700);tag("24 new",405,226,70);
  ["Project request","Workshop schedule","Approval needed","Team digest","New submission","Review complete"].forEach((s,i)=>{rr(258,264+i*52,225,47,6,i===Math.floor(t*5)?"#fff":"#f2f5fa");dot(272,280+i*52,4,i<3?accent:"#b5bfce");tx(s,285,284+i*52,12,ink,700);tx("Today · Workspace",285,301+i*52,10,muted)});
  card(513,216,659,390,idx%2?"Sequence / draft 02":"Draft ready for review","To: team@example.test");fit(entry.title,535,290,600,24,ink,700);tx("Hello team,",536,328,15,ink);bulletText(538,365,579,15,47);const closing="Please review the next action before this message is sent.";fit(closing.slice(0,Math.floor(20+t*70)),536,516,570,14,muted);tag("Human approval",536,546,136);tag("Send when ready",1003,548,145);
  cursor(1090,558, true);
}
function workflow(){
  header(entry.title,"Connect inputs, reason over context and route the next action.");
  const ss=stages();const nodes=[[ss[0]||"Trigger","New input",272,335],[ss[1]||"Validate","Schema & scope",475,335],[ss[2]||"AI step","Structured output",678,335],[ss[3]||"Review","Human decision",881,335],[ss[4]||"Deliver","Write back",1082,335],["Retry","Safe fallback",678,493],["Audit","Execution log",881,493]];
  const lines=[[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[3,6]];
  lines.forEach(([a,b],i)=>{let A=nodes[a],B=nodes[b];line(A[2]+43,A[3]+35,B[2]+43,B[3]+35,"#c9d2df",3);const p=(t*1.5+i*.13)%1;dot(A[2]+43+(B[2]-A[2])*p,A[3]+35+(B[3]-A[3])*p,5,accent)});
  nodes.forEach((d,i)=>{rr(d[2]-25,d[3],138,77,10, i<=Math.floor(t*9)? "#e9f6f0":"#fff","#cbd5e3");miniIcon(["T","V","AI","R","D","F","L"][i],d[2]-10,d[3]+13,26);fit(d[0],d[2]+24,d[3]+27,83,12,ink,700);tx(d[1],d[2]-10,d[3]+59,10,muted)});
  cursor(905,360, true);tag("APPROVAL GATE",888,457,140);
}
function dashboard(){
  header(entry.title,"Sample data · interactive decision workspace");
  const metrics=content().metrics||[{label:"Requests",value:"248"},{label:"Completed",value:"186"},{label:"Exceptions",value:"12"},{label:"Review queue",value:"50"}];metrics.slice(0,4).forEach((m,i)=>{card(248+i*237,286,222,83,m.label);fit(m.value,266+i*237,348,187,26,ink,700)});
  if(idx%3===0){card(248,385,571,215,labels()[0]||"Trend over time");chart(270,435,520,130,idx);card(837,385,340,215,labels()[1]||"Comparison");bars(858,438,302,133,7,t+.2)}
  else if(idx%3===1){card(248,385,360,215,"Distribution / sample");const px=363,py=498;c.beginPath();c.arc(px,py,64,0,Math.PI*2);c.strokeStyle="#e4eaf3";c.lineWidth=24;c.stroke();c.beginPath();c.arc(px,py,64,-Math.PI/2,-Math.PI/2+Math.PI*2*(.45+.3*t));c.strokeStyle=accent;c.stroke();tx("04",px,py+9,26,ink,700,"Arial","center");labels().slice(0,3).forEach((s,i)=>fit(s,450,470+i*31,144,12,muted));card(626,385,548,215,"Comparison / sample");labels().slice(0,4).forEach((s,i)=>{fit(s,645,444+i*37,166,12,ink);rr(813,430+i*37,331,15,5,"#edf1f7");rr(813,430+i*37,(160+i*44)*smooth(t+.3),15,5,accent)})}
  else{card(248,385,571,215,"Relationship / sample data");for(let j=0;j<5;j++)line(272,434+j*32,793,434+j*32);for(let j=0;j<24;j++){const dx=(j*37%503),dy=132-(dx/503)*94+Math.sin(j*2)*26;dot(279+dx,438+dy,4+(j%3),j%4?"#8ca6c4":accent)}card(837,385,340,215,"Evidence notes");bulletText(858,451,291,14,48)}cursor(580+t*140,510);
}
function code(){
  const lang=content().language||"typescript",ext=({python:"py",sql:"sql",json:"json",ruby:"rb",typescript:"ts",javascript:"js",tsx:"tsx",css:"css"})[lang.toLowerCase()]||"txt";
  rr(247,215,585,393,9,"#172333");rr(247,215,585,34,9,"#26354b");tx("example."+ext+"  /  illustrative source",265,238,13,"#c4d0e3",400,"Consolas");
  const lines=content().code||["type Evidence = { text: string; source: string };","","export function withCitations(items: Evidence[]) {","  return items.map((item, index) => ({","    text: item.text,","    citation: `[${index + 1}] ${item.source}`,","  }));","}"];
  lines.slice(0,15).forEach((s,i)=>{tx(String(i+1),260,278+i*21,11,"#5f7593",400,"Consolas");fit(s.slice(0,Math.floor(t*280)+i*10),292,278+i*21,519,12.5,i%4===0?lightAccent:"#d4deee",400,"Consolas")});
  card(849,215,324,178,"Source walkthrough","Illustrative code / no execution claim");wrap(content().kicker||entry.action,868,290,281,18,ink,25,3,700);tag(lang.toUpperCase(),868,357,Math.min(250,lang.length*9+23));
  card(849,410,324,198,"Review points");bullets().slice(0,3).forEach((s,i)=>{dot(871,465+i*48,5,t>.2*i?accent:"#d9e0ea");wrap(s,885,470+i*48,262,13,ink,18,2)});
  cursor(1115,367); 
}
function chat(){
  header(entry.title,"Grounded answers with visible context and review.");
  card(247,287,622,317);rr(267,306,532,55,12,"#eaf0fa");fit(content().kicker||"What should we review next?",285,339,498,18,ink,700);
  rr(313,381,534,145,12,"#f1f7f4");tx("Draft answer · review before use",333,410,16,ink,700);bullets().slice(0,3).forEach((s,i)=>fit("• "+s.slice(0,Math.floor(14+t*90)),333,441+i*27,485,13,ink));
  tag("Source 01",335,542,101);tag("Source 02",445,542,101);card(888,287,285,317,"Context sources");
  labels().slice(0,4).forEach((s,i)=>{miniIcon("D",906,343+i*55,28);fit(s,946,363+i*55,207,13,ink);line(906,385+i*55,1150,385+i*55)});
  cursor(390+t*300,553); 
}
function designboard(){
  if(/ComfyUI/.test(entry.tool||"")){workflow();return}
  if(cat==="strategy"||cat==="marketing"){
    header(entry.title,content().kicker||entry.action);rr(248,290,558,312,9,"#f3f5fa");line(527,308,527,583,"#c1cbd8");line(267,446,786,446,"#c1cbd8");tx("IMPACT",265,319,11,muted,700);tx("FEASIBILITY →",668,582,11,muted,700);
    const notes=labels();for(let j=0;j<Math.min(6,notes.length);j++){const xx=277+(j%3)*169,yy=345+Math.floor(j/3)*130;rr(xx,yy+Math.sin(t*4+j)*4,145,78,5,[accent,"#f4e5b8","#d6d1ec"][j%3]);wrap(notes[j],xx+11,yy+28,123,14,ink,20,2,700)}
    card(825,290,347,312,"From insight to action");bulletText(845,355,307,16,76);cursor(420+t*340,411);return;
  }
  header(entry.title,"Tokens, components and responsive compositions.");
  const palettes=[accent,"#24263c","#f6e8cf","#e0edf0","#f5d4d7"];
  palettes.forEach((v,i)=>{rr(249+i*76,291,62,60,10,v);tx("0"+(i+1),271+i*76,374,11,muted)});
  card(668,291,503,85,"Aa  Make ideas tangible.");fit(content().kicker||"Type scale / spacing / accessible contrast",687,345,465,12,muted);
  card(249,392,358,210,"Components");tag("Primary action",272,450,159);rr(272,492,288,48,9,"#f3f5fa","#dce2ec");tx("Input component",288,522,14,muted);rr(272,556,92,22,11,accent);dot(351,567,8,"#fff");
  card(625,392,546,210,"Layout preview");for(let j=0;j<3;j++){rr(646+j*170,440,153,143,8,"#edf1f8");rr(657+j*170,452,131,53,6,palettes[(j+idx)%5]);if(idx%3===0){for(let q=0;q<5;q++)dot(677+j*170+q*20,477,6+q%3,"#ffffffbb")}else if(idx%3===1){line(671+j*170,486,697+j*170,464,"#172132",3);line(697+j*170,464,725+j*170,490,"#172132",3);dot(755+j*170,468,9,"#ffffffbb")}else{tx(["Aa","Bb","Cc"][j],687+j*170,490,31,ink,700)}wrap(labels()[j%labels().length],657+j*170,530,125,12,ink,17,2);rr(657+j*170,566,90+20*smooth(t),4,2,accent)}cursor(400+400*t,463);
}
function poster(){
  const x=248,y=215,w=548,h=393;rr(x,y,w,h,8,["#b4efcf","#d4bbef","#f7beaa","#bfdcfa"][idx%4]);
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.translate(x+420,y+120);c.rotate(t*.4);for(let i=0;i<9;i++){c.rotate(.7);rr(0,0,190,34,17,"#ffffff55")}c.restore();
  tx(["MAKE","BUILD","CREATE","EXPLORE"][idx%4],x+30,y+79,57,ink,700);tx("NEW",x+30,y+140,57,ink,700);tx("POSSIBILITIES.",x+30,y+200,47,ink,700);
  tx(entry.title.slice(0,35),x+30,y+279,24,ink,700);tx("A student concept / Acumelo",x+30,y+316,15,ink);tag("VIEW PROJECT",x+30,y+340,141,"#fff");
  card(817,y,355,393,"Creative variations","Multiple formats / one idea");
  for(let i=0;i<3;i++){rr(838,y+83+i*96,126,78,8,["#cfe3fc","#f6d4df","#d6ead7"][i]);tx(["A","B","C"][i],880,y+132+i*96,34,ink,700);wrap(bullets()[i%bullets().length],982,y+107+i*96,161,13,ink,19,3)}
  cursor(1010,270+t*220);
}
function kanban(){
  header(entry.title,"Define scope, assign ownership and move through delivery.");
  ["Backlog","In progress","Review","Done"].forEach((s,j)=>{const x=248+j*237;rr(x,292,220,309,9,"#f0f3f8");tx(s,x+15,320,16,ink,700);tag(String(3-j%2),x+167,303,35);
    for(let k=0;k<3;k++){let yy=337+k*79;if(j===1&&k===0)yy+=Math.sin(t*Math.PI)*25;rr(x+12,yy,196,67,7,"#fff","#e0e6ef");fit(labels()[(k+j)%labels().length],x+23,yy+24,169,12,ink,700);fit(stages()[(k+j)%stages().length],x+23,yy+45,142,10,muted);dot(x+181,yy+44,9,accent)}});
  cursor(510+200*t,380);
}
function landing(){
  rr(247,215,925,392,8,"#fff","#dce3ec");tx(["NORTH / STUDIO","FIELD / NOTES","ORBIT / LAB","COMMON / SPACE"][idx%4],272,247,15,ink,700);tx("Work     About     Contact",959,247,12,muted);
  rr(265,266,889,225,8,["#e8f2e9","#ede8f6","#fae9df","#e3edf7"][idx%4]);
  fit(entry.title,292,329,588,32,ink,700);wrap(content().kicker||entry.subtitle||"Build a useful experience.",294,372,540,21,ink,27,2);tag("Explore the project →",294,437,182);
  c.save();c.translate(940,370);c.rotate(t*.2-.1);for(let i=0;i<5;i++){rr(-115+i*20,-70+i*17,203,115,16,["#25394d","#c2e5cd","#e8ccba","#bdd7ef","#fff"][i]);}c.restore();
  for(let j=0;j<3;j++){rr(268+j*300,511,283,77,7,"#f4f6fa");miniIcon(String(j+1),283+j*300,528,38);wrap(labels()[j%labels().length],335+j*300,543,195,14,ink,19,2,700)}
  cursor(390,452);
}
function timeline(){
  if(cat!=="design"){
    header(entry.title,content().kicker||"Milestones, ownership and dependencies");const x=249,y=296;rr(x,y,922,304,8,"#fff","#dce3ec");const ss=stages();for(let j=0;j<6;j++){tx("W"+(j+1),470+j*112,323,12,muted,700);line(449+j*112,338,449+j*112,587,"#e6ebf2")}
    ss.slice(0,5).forEach((s,j)=>{const yy=354+j*48;fit(s,265,yy+19,170,14,ink,700);const xx=452+j*87,w=170+(j%2)*97;rr(xx,yy,w,27,6,j%2?accent:"#c7d5ea");rr(xx,yy,w*smooth(t+.3),27,6,j%2?accent:"#99b6d6");dot(xx+w,yy+13,6,"#fff");if(j<4)line(xx+w,yy+29,xx+w,yy+43,"#b9c6d8",2)});line(470+t*615,333,470+t*615,590,"#ef8678",2);cursor(470+t*615,342);return;
  }
  const x=247,y=215;rr(x,y,925,218,9,"#172333");tx(entry.title,x+28,y+42,26,"#fff",700);rr(x+349,y+36,211,137,12,["#d8c8ed","#f6c5b5","#b6dacb"][idx%3]);tx("PLAY",x+454,y+112,31,"#243246",700,"Arial","center");tx("00:"+String(Math.floor(t*15)).padStart(2,"0")+" / 00:15",x+28,y+191,13,"#c4cfe0",400,"Consolas");
  const ys=453;for(let row=0;row<4;row++){tx(["Video","Titles","Audio","Effects"][row],251,ys+row*36+20,12,muted);line(323,ys+row*36,1168,ys+row*36);for(let i=0;i<6;i++){rr(335+i*134,ys+row*36+4,120-((i+row)%3)*12,26,5,[accent,"#d6c8f0","#b3d9da","#f0c0c3"][row]);if(row===2){for(let k=0;k<20;k++)line(341+i*134+k*5,ys+row*36+15-Math.sin(k)*7,341+i*134+k*5,ys+row*36+15+Math.sin(k)*7,"#486571")}}}
  line(335+t*810,443,335+t*810,603,"#ed6f6f",3);cursor(335+t*810,437);
}
function calendar(){
  header(entry.title,content().kicker||"A connected view of deadlines and ownership.");
  const x=248,y=291,cw=184,rh=72;
  ["MON","TUE","WED","THU","FRI"].forEach((s,j)=>{tx(s,x+j*cw+8,y-7,11,muted,700);for(let i=0;i<4;i++){rr(x+j*cw,y+i*rh,177,66,5,"#f4f6fa");tx(String(i*5+j+1),x+j*cw+8,y+i*rh+17,11,muted);if((i+j+idx)%3!==0){rr(x+j*cw+6,y+i*rh+26,165,29,4,(i+j)%2?accent:"#d5e0f3");fit(labels()[(i+j+idx)%labels().length],x+j*cw+14,y+i*rh+45,147,11,(i+j)%2?foreground(accent):ink,700)}}});
  cursor(290+t*700,420+Math.sin(t*4)*60);
}
function crm(){
  header(entry.title,cat==="strategy"?"Stakeholders, decisions and engagement.":cat==="development"?"Requests, ownership and resolution.":"Segments, conversations and the next best action.");
  const cols=cat==="strategy"?["Stakeholders","Consulted","Decision needed","Aligned"]:cat==="development"?["New requests","Triaged","In progress","Resolved"]:["New leads","Qualified","Opportunity","Customers"];
  cols.forEach((s,j)=>{const x=248+j*237;rr(x,292,220,308,9,"#f0f3f8");tx(s,x+14,321,15,ink,700);for(let k=0;k<3;k++){rr(x+11,338+k*80,198,68,7,"#fff");dot(x+31,362+k*80,11,["#c3d7ec","#d5c7e7","#eed4bd"][k]);fit(labels()[(j+k)%labels().length],x+50,359+k*80,145,11,ink,700);fit(stages()[(j+k)%stages().length],x+50,379+k*80,145,10,muted);rr(x+20,390+k*80,176*smooth(t+j*.18),3,2,accent)}});
  cursor(554+t*230,374);
}
function notebook(){
  header(entry.title,"Reproducible analysis with assumptions made visible.");
  const codeLines=content().code||["import pandas as pd","issues = df[df.isna().any(axis=1)]","clean = df.drop_duplicates()"];
  rr(247,289,925,87,7,"#182637");tx(content().language==="ruby"?"Ruby":"In [07]",261,313,11,lightAccent,400,"Consolas");codeLines.slice(0,3).forEach((s,i)=>fit(s,335,312+i*23,808,15,"#d8e2f0",400,"Consolas"));
  if(cat==="design"){
    card(247,390,446,212,"Audio motif / sequencer");for(let r=0;r<5;r++){tx(["C5","A4","G4","E4","C4"][r],264,455+r*27,11,muted);for(let j=0;j<12;j++){rr(301+j*29,441+r*27,24,20,3,(j+r+idx)%4===0?accent:"#edf1f7")}}line(304+t*342,438,304+t*342,582,"#ee8e80",2);card(711,390,461,212,"Waveform / illustrative motif");for(let j=0;j<76;j++){const a=12+Math.abs(Math.sin(j*.31))*47;line(734+j*5.3,511-a,734+j*5.3,511+a,j/76<t?accent:"#ced8e7",3)}
  }else if(cat==="workflow"&&/survey/i.test(entry.title)){
    card(247,390,446,212,"Theme counts / sample responses");["Theme                  Count","Schedule                   2","Support                    1","Content                    1"].forEach((s,i)=>tx(s,270,451+i*34,14,i===0?muted:ink,i===0?700:400,"Consolas"));card(711,390,461,212,"Topic comparison");["Schedule","Support","Content"].forEach((s,j)=>{tx(s,733,458+j*47,13,ink);rr(823,445+j*47,(j?144:288)*smooth(t+.3),19,5,accent)});
  }else{
    card(247,390,446,212,"Analysis notes / sample output");labels().slice(0,3).forEach((s,i)=>{dot(272,455+i*45,4,accent);wrap(s,286,460+i*45,379,14,ink,19,2)});card(711,390,461,212,"Illustrative evidence view");chart(733,441,414,132,idx);
  }cursor(580,350);
}
function architecture(){
  if(cat==="design"){
    header(entry.title,content().kicker||"Form, lighting and spatial composition");rr(248,287,650,317,10,"#1c293b");
    const cx=566,cy=493;for(let q=-4;q<=4;q++){line(cx-280,cy+q*18,cx+280,cy+q*18,"#324257");line(cx+q*55-160,cy-137,cx+q*55+160,cy+101,"#324257")}
    const poly=(points,fill)=>{c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle="#ffffff33";c.stroke()};
    c.save();c.translate(cx+Math.sin(t*2)*16,cy-5);const lift=Math.sin(t*Math.PI)*6;
    if(/lamp/i.test(entry.title)){rr(-22,-134,44,143,13,"#e0d9cb");c.beginPath();c.ellipse(0,11,88,27,0,0,Math.PI*2);c.fillStyle="#abbace";c.fill();poly([[-112,-130],[112,-130],[70,-221+lift],[-70,-221+lift]],accent);c.beginPath();c.ellipse(0,-130,112,25,0,0,Math.PI*2);c.fillStyle="#f3eedc";c.fill();dot(0,-127,18,"#fff6ca")}
    else{const boxes=/Exhibition/i.test(entry.title)?[[-143,24,63,100],[0,20,74,168],[146,25,53,125]]:[[-115,19,92,135],[92,21,100,84]];boxes.forEach(([x,y,w,h],j)=>{y+=lift*(j+1);poly([[x-w/2,y-h],[x,y-h-28],[x+w/2,y-h],[x,y-h+28]],j%2?"#f3d4bc":accent);poly([[x-w/2,y-h],[x,y-h+28],[x,y+28],[x-w/2,y]],j%2?"#c1a38c":"#6f98a8");poly([[x,y-h+28],[x+w/2,y-h],[x+w/2,y],[x,y+28]],j%2?"#dfb899":"#a5c8d1")})}
    c.restore();tx("PERSPECTIVE / MATERIAL STUDY",269,580,11,"#b7c9e0",700);card(916,287,255,317,"Scene properties");labels().slice(0,4).forEach((s,j)=>{fit(s,933,355+j*52,218,13,ink,700);rr(933,366+j*52,218,6,3,"#e4e9f2");rr(933,366+j*52,90+110*smooth(t+j*.15),6,3,accent)});cursor(715,436);return;
  }
  header(entry.title,"A system view: interfaces, services and trusted boundaries.");
  const bs=labels();const boxes=[[bs[0]||"Interface",260,315,182,80],[bs[1]||"Application",518,315,182,80],[bs[2]||"Data service",776,315,182,80],[bs[3]||"Review",518,481,182,80],[bs[4]||"Observability",776,481,182,80],[bs[5]||"Knowledge",1012,397,148,80]];
  [[0,1],[1,2],[1,3],[2,4],[2,5],[3,4]].forEach(([a,b],j)=>{let A=boxes[a],B=boxes[b];line(A[1]+A[3]/2,A[2]+40,B[1]+B[3]/2,B[2]+40,"#bfcbdc",3);const q=(t+j*.1)%1;dot(A[1]+A[3]/2+(B[1]+B[3]/2-A[1]-A[3]/2)*q,A[2]+40+(B[2]-A[2])*q,5,accent)});
  boxes.forEach((d,j)=>{rr(d[1],d[2],d[3],d[4],10,"#fff","#cdd8e6");miniIcon(["UI","API","DB","H","L","K"][j],d[1]+14,d[2]+22,33);wrap(d[0],d[1]+58,d[2]+36,d[3]-65,12,ink,17,2,700)});
  tag("REVIEW BOUNDARY",260,480,181);wrap(bullets()[0],262,528,178,12,muted,18,3);cursor(591,345);
}
function mobile(){
  header(entry.title,"One concept, designed for different moments.");
  for(let j=0;j<3;j++){const x=300+j*267,y=288;rr(x,y,198,310,27,"#172333");rr(x+7,y+9,184,292,22,["#f5f0e9","#edf4f0","#f0edf7"][j]);rr(x+58,y+15,82,12,6,"#172333");fit(labels()[j%labels().length],x+22,y+58,156,19,ink,700);rr(x+20,y+76,158,102,11,[accent,"#c0ccdf","#e1c8d4"][j]);tx(["01","02","03"][j],x+37,y+116,30,ink,700);wrap(bullets()[j%bullets().length],x+37,y+144,128,11,ink,16,2);for(let k=0;k<3;k++){rr(x+20,y+192+k*29,158,21,5,"#fff");rr(x+29,y+199+k*29,(100-k*12)*smooth(t+.4),5,2,"#b4c2d6")}dot(x+99,y+281,9,accent)}
  cursor(953,490);
}
function report(){
  rr(248,215,534,392,6,"#fff","#d9e1ec");tx("PROJECT / BRIEF",274,245,11,muted,700);fit(entry.title,274,283,480,25,ink,700);line(274,306,754,306);wrap(content().kicker||entry.subtitle||entry.action,274,339,460,17,ink,24,2,700);bulletText(275,411,463,16,57);
  card(802,215,370,183,"Decision snapshot");["Impact","Feasibility","Confidence"].forEach((s,j)=>{tx(s,823,278+j*39,12,muted);rr(915,266+j*39,229,13,6,"#edf1f7");rr(915,266+j*39,(140+j*22)*smooth(t+.2),13,6,accent)});
  card(802,415,370,192,"Next actions");stages().slice(0,3).forEach((s,j)=>{rr(822,459+j*44,20,20,4,j<=t*3?accent:"#edf1f7");fit(s,854,475+j*44,291,13,ink)});cursor(836,478+Math.floor(t*2)*44);
}
const draw={spreadsheet,slides,email,workflow,dashboard,code,chat,designboard,poster,kanban,landing,timeline,calendar,crm,notebook,architecture,mobile,report};
export function renderScreen(ctx,category,videoKind,e,index,localProgress,globalProgress,total){
  c=ctx;cat=category;kind=videoKind;accent=(kind==="showcase"&&e.palette?.accent)||themes[category][0];lightAccent=brighten(accent);t=localProgress;idx=index;entry=e;
  c.clearRect(0,0,W,H);
  const bg=c.createLinearGradient(0,0,W,H);bg.addColorStop(0,"#0b1423");bg.addColorStop(1,themes[category][1]);c.fillStyle=bg;c.fillRect(0,0,W,H);
  for(let i=0;i<5;i++){c.globalAlpha=.08;dot(930+i*68,30+Math.sin(globalProgress*8+i)*30,93,accent)}c.globalAlpha=1;
  tx("acumelo",38,43,27,"#fff",700);tag(kind==="demo"?"INSTRUCTOR DEMO":"PROJECT SHOWCASE",185,20,kind==="demo"?160:174);
  tx(kind==="demo"?"Tools in motion":"24 possibilities. One learning journey.",1240,39,15,"#becadd",400,"Arial","right");
  tx(names[category],38,98,32,"#fff",700);
  const shortTitle=String(e.title||e.name||"Project concept");fit(String(index+1).padStart(2,"0")+" / "+total+"    "+shortTitle+(kind==="demo"?"  /  "+e.tool:""),40,130,1197,18,lightAccent,700);
  const progress=globalProgress;
  c.save();const reveal=smooth(clamp(localProgress*7));c.translate((1-reveal)*20,0);c.globalAlpha=.5+.5*reveal;
  c.shadowColor="#00000050";c.shadowBlur=30;c.shadowOffsetY=14;rr(37,157,1205,478,16,"#f8faff");c.shadowColor="transparent";
  rr(37,157,1205,42,16,"#e9eef6");rr(37,182,1205,17,0,"#e9eef6");[0,1,2].forEach((j)=>dot(57+j*17,178,4,["#fa8d8d","#f6c879","#84c9aa"][j]));tx("Acumelo / "+(kind==="demo"?"Instructor workspace":"Project studio"),118,183,12,"#62728a",700);
  tx((e.tool||e.tools?.join(" + ")||e.archetype||"Prototype").slice(0,48),1220,184,17,"#53637a",700,"Arial","right");
  rr(37,199,183,436,0,"#eff3f9");tx("WORKSPACE",54,230,10,"#8a98ac",700);
  const menu=["Overview","Inputs","Workspace","Review","Deliverables","Activity"];
  menu.forEach((s,j)=>{if(j===2)rr(48,247+j*47,160,35,8,"#fff");dot(63,264+j*47,4,j===2?accent:"#bdc8d9");tx(s,77,269+j*47,12,j===2?ink:muted,j===2?700:400)});
  rr(49,552,159,67,9,"#e0e7f1");tx("EXAMPLE DATA",60,575,10,"#75839a",700);tx(kind==="demo"?"Process preview":"Student concept",60,598,12,ink,700);
  c.save();c.beginPath();c.rect(231,207,987,414);c.clip();const key=String(e.archetype||e.layout||"dashboard").toLowerCase().replaceAll("-","");(draw[key]||draw[({document:"report",presentation:"slides",slide:"slides",board:"kanban",editor:"code",figma:"designboard",website:"landing",app:"mobile",chart:"dashboard",pipeline:"workflow"})[key]]||dashboard)();c.restore();c.restore();
  fit(kind==="demo"?"Illustrative UI simulation · example tools and workflows":"Illustrative project examples · not actual student submissions",39,665,630,13,"#b9c5d9");
  c.save();c.beginPath();c.rect(711,645,527,30);c.clip();tx((e.action||e.subtitle||e.detail||"Explore → build → refine").slice(0,69),1238,665,13,"#d6deed",400,"Arial","right");c.restore();
  rr(38,686,1204,4,2,"#334159");rr(38,686,1204*progress,4,2,accent);
}
