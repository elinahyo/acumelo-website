import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:8792/';
const browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--mute-audio']});
const page=await browser.newPage(),cases=[],errors=[],contrasts=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
const routes={home:'home',fields:'lectures',people:'people',profile:'instructor-chris&field=workflow&tab=curriculum',demo:'instructor-chris&field=design&tab=demo',about:'about',contact:'contact'};
async function contrast(selector){return page.locator(selector).evaluateAll(nodes=>{
 const parse=s=>{const v=s.match(/[\d.]+/g)?.map(Number);return v?.length>=3?v:null};
 const mix=(a,b)=>a.slice(0,3).map((v,i)=>v*(a[3]??1)+b[i]*(1-(a[3]??1)));
 const lum=a=>a.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
 const backgrounds=node=>{if(!node)return [[23,32,71]];const st=getComputedStyle(node),parent=backgrounds(node.parentElement),solid=parse(st.backgroundColor);const stops=[...st.backgroundImage.matchAll(/rgba?\([^)]+\)/g)].map(m=>parse(m[0])).filter(Boolean);const colors=stops.length?stops:solid&&solid[3]!==0?[solid]:[];return colors.length?colors.flatMap(a=>parent.map(b=>mix(a,b))):parent;};
 return nodes.filter(n=>n.getClientRects().length).map(n=>{const st=getComputedStyle(n),fg=parse(st.color),bg=backgrounds(n);const ratios=bg.map(b=>{const a=lum(mix(fg,b)),l=lum(b);return (Math.max(a,l)+.05)/(Math.min(a,l)+.05)});return {text:n.textContent.trim().slice(0,55),selector:n.className,minRatio:Math.min(...ratios),color:st.color,fontSize:st.fontSize};});
});}
try{
 for(const lang of ['en','ko']){
  await page.goto(base);await page.evaluate(l=>localStorage.setItem('acumelo.language',l),lang);
  for(const width of process.env.QA_SMOKE_ONLY ? [320,390] : [320,360,390,768,1440]){
   await page.setViewportSize({width,height:900});
   for(const [name,route] of Object.entries(routes)){
    if(process.env.QA_SMOKE_ONLY&&!['home','people','profile'].includes(name))continue;
    await page.goto(base+'?page='+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
    const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,width:document.documentElement.scrollWidth,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family),body:getComputedStyle(document.body).fontFamily,heading:getComputedStyle(document.querySelector('main>section:not([hidden]) h1')).fontFamily}));
    assert(!metrics.overflow,`${lang}/${width}/${name} overflows: ${metrics.width}`);
    assert(metrics.fonts.includes('Nunito'),'Nunito must load');
    if(lang==='ko')assert(metrics.fonts.includes('Jua')&&metrics.fonts.includes('Noto Sans KR'),'Korean fonts must load');
    if(name==='people'||name==='profile'){
     assert(await page.locator('.member-name,.profile-intro .page-title').evaluateAll(ns=>ns.filter(n=>n.getClientRects().length).every(n=>getComputedStyle(n).fontFamily.startsWith('Nunito')&&getComputedStyle(n).fontWeight==='900')),'Names use Nunito 900 in both languages');
    }
    if(name==='home'&&width<=600){
     assert(await page.evaluate(()=>document.querySelector('.hero-art').getBoundingClientRect().top>=document.querySelector('.intro-media').getBoundingClientRect().bottom+16),'Mobile illustration must not overlap CTA or intro notice');
    }
    const textSizes=await page.locator('main>section:not([hidden]) .comparison-cell,main>section:not([hidden]) .learning-pending,main>section:not([hidden]) .learning-note,main>section:not([hidden]) .learning-help,main>section:not([hidden]) .process-item p,main>section:not([hidden]) .contact-copy>p,main>section:not([hidden]) .field input').evaluateAll(ns=>ns.map(n=>parseFloat(getComputedStyle(n).fontSize)));
    assert(textSizes.every(size=>size>=16),'Primary text below 16px');
    cases.push({lang,width,page:name,...metrics});
    if(width===1440&&lang==='en')contrasts.push(...await contrast('.main-nav>a,.sidebar-contact,.languages button,.comparison-cell,.field-filter,.field-tag,.learning-field-button,.learning-tab,.learning-pending,.learning-help,.learning-note,.solid-button,.contact-copy>.preview-notice,.field label,.footer-identity p'));
    if(process.env.QA_SCREENSHOT_DIR&&[390,1440].includes(width)){
     if(name==='people')await page.screenshot({path:`${process.env.QA_SCREENSHOT_DIR}/studio-${lang}-${width}-${name}.png`,fullPage:false});
     else await page.screenshot({path:`${process.env.QA_SCREENSHOT_DIR}/studio-${lang}-${width}-${name}.png`,fullPage:true});
    }
   }
  }
 }
 assert(contrasts.every(c=>c.minRatio>=4.5),'Contrast below AA: '+JSON.stringify(contrasts.filter(c=>c.minRatio<4.5)));
 assert(!requests.some(url=>/fonts\.googleapis|fonts\.gstatic/.test(url)),'No external runtime font requests');
 await page.setViewportSize({width:320,height:800});await page.goto(base+'?page=lectures');
 await page.locator('#menu-toggle').click();assert(await page.locator('#main').evaluate(n=>n.inert));
 await page.keyboard.press('Escape');assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');assert(await page.locator('#menu-toggle').evaluate(n=>n===document.activeElement));
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'?page=home');
 assert.equal(await page.locator('.studio-scene').evaluate(n=>getComputedStyle(n).animationName),'none');
 assert.equal(await page.locator('.line-link').first().evaluate(n=>getComputedStyle(n).transitionDuration),'0s');
 cases.push({name:'keyboard-menu-focus-and-reduced-motion',passed:true});
}catch(e){errors.push(e.stack);}finally{await browser.close();}
const report={passed:!errors.length,cases,contrasts,externalFontRequests:requests.filter(u=>/fonts\.googleapis|fonts\.gstatic/.test(u)),errors};
await fs.writeFile(process.env.QA_REPORT||'studio-design-qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,cases:cases.length,contrastSamples:contrasts.length,errors}));if(errors.length)process.exitCode=1;
