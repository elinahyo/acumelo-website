import {fields,colors,projects as previousProjects,members as previousMembers} from './base-blueprint.mjs';
import {refineFilm} from './case-direction.mjs';
export {fields,colors};
export const revision='20261123c';
export const members=previousMembers.map(({id,name,fields},i)=>({id,name,fields,index:i,voice:['am_michael','af_heart','af_nicole','bm_daniel','bf_emma','am_eric','af_sarah','bm_george','bf_lily','am_liam','af_bella'][i]}));
// All cases are original illustrative teaching samples, not instructor credentials.
const cases={
 'Chris:workflow':['Weekly reporting, connected','weekly operations','board-ready report','excel','chatgpt','n8n','powerpoint','word','outlook'],
 'Chris:strategy':['An AI operating model','AI adoption roadmap','decision brief','notion','claude','miro','jira','excel','powerpoint'],
 'Chris:design':['From direction to motion','kinetic identity','motion campaign','figma','aftereffects','cinema4d','higgsfield','comfyui','resolve'],
 'Chris:analytics':['From raw data to a decision','revenue quality','executive dashboard','excel','jupyter','vscode','powerbi','tableau','grafana'],
 'Chris:marketing':['A campaign with a feedback loop','multi-channel launch','campaign dashboard','chatgpt','hubspot','ga4','figma','n8n','looker'],
 'Chris:development':['One service, many surfaces','knowledge workspace','web and mobile service','vscode','flutter','firebase','langflow','unity','unreal'],
 'Sage:strategy':['Find the right product to build','booking experience','validated product brief','miro','gemini','notion','jira','figma','powerpoint'],
 'Sage:design':['Design the complete journey','booking interface','responsive design system','figma','claude','aftereffects','canva','blender','resolve'],
 'Sage:development':['A booking flow that feels effortless','appointment booking','booking application','vscode','flutter','supabase','figma','firebase','github'],
 'Pillow:design':['Make a visual system move','interactive exhibition','generative installation','aftereffects','cinema4d','comfyui','higgsfield','blender','resolve'],
 'Pillow:development':['Turn a scene into an experience','interactive gallery','interactive browser gallery','vscode','unity','unreal','blender','firebase','github'],
 'John:workflow':['Invoice exceptions, under control','invoice validation','approval-ready invoice queue','excel','claude','n8n','word','outlook','powerpoint'],
 'John:development':['Build a dependable integration','invoice processing API','operations service','vscode','supabase','postman','n8n','grafana','github'],
 'Sarah:strategy':['A creative project that stays on track','campaign production','production plan','notion','miro','jira','claude','excel','powerpoint'],
 'Sarah:design':['One campaign, every format','product launch assets','multi-format campaign','figma','higgsfield','cinema4d','aftereffects','canva','resolve'],
 'Joseph:analytics':['Forecast demand, explain the uncertainty','inventory planning','forecast dashboard','jupyter','excel','vscode','powerbi','tableau','grafana'],
 'Joseph:development':['Make a forecast usable','demand forecast API','planning application','vscode','jupyter','postman','supabase','docker','github'],
 'Rachel:marketing':['A customer journey worth measuring','lead nurturing','customer lifecycle campaign','hubspot','chatgpt','ga4','looker','n8n','canva'],
 'Rachel:development':['Build the feedback loop','campaign experiment','experiment dashboard','vscode','supabase','postman','ga4','n8n','github'],
 'Joshua:analytics':['Understand retention by cohort','product retention','cohort explorer','vscode','jupyter','tableau','powerbi','grafana','excel'],
 'Joshua:development':['Ship a useful analytics product','cohort explorer','analytics portal','vscode','flutter','supabase','jupyter','docker','github'],
 'Elizabeth:workflow':['From meeting notes to accountable action','meeting follow-up','team action dashboard','gemini','word','excel','n8n','outlook','powerpoint'],
 'Elizabeth:strategy':['Keep an AI delivery portfolio visible','delivery portfolio','portfolio review','jira','notion','miro','gemini','excel','powerpoint'],
 'Michael:analytics':['Make the numbers tell a clear story','sales performance','management scorecard','excel','powerbi','tableau','jupyter','looker','powerpoint'],
 'Rebecca:workflow':['Turn a request into a controlled process','employee onboarding','onboarding workspace','chatgpt','word','excel','n8n','outlook','notion'],
 'Rebecca:development':['A knowledge assistant with boundaries','internal knowledge assistant','cited knowledge service','vscode','langflow','supabase','firebase','postman','github']
};
export const toolGroups={
 workflow:['Excel','Power Query','Office Scripts','Word','PowerPoint','Outlook','n8n','Power Automate','ChatGPT','Claude','Gemini','Google Sheets','Google Docs','Gmail'],
 strategy:['Notion','Miro','Jira','Confluence','Linear','Trello','Asana','ChatGPT','Claude','Gemini','Figma','PowerPoint'],
 design:['Figma','After Effects','Cinema 4D','Higgsfield','ComfyUI','Blender','DaVinci Resolve','Canva','Photoshop','Illustrator','Premiere Pro','Unity Shader Graph','Unreal Niagara'],
 analytics:['Excel','Power Query','Python','pandas','NumPy','JupyterLab','SQL','PostgreSQL','dbt','DuckDB','scikit-learn','Power BI','Tableau','Looker Studio','Grafana'],
 marketing:['ChatGPT','Claude','Gemini','HubSpot','Salesforce','GA4','Looker Studio','Google Ads','Meta Ads Manager','Mailchimp','Brevo','Zapier','n8n','Canva'],
 development:['React','TypeScript','Next.js','Flutter','Dart','Firebase','Supabase','FastAPI','Node.js','Python','PostgreSQL','LangChain','LangGraph','LlamaIndex','Langflow','Qdrant','Pinecone','Unity','C#','Unreal Engine','Blueprints','Three.js','GLSL','Docker','GitHub Actions','Playwright','Vitest','Postman','Cloudflare','Vercel']
};
const apps={excel:'Microsoft Excel',word:'Microsoft Word',powerpoint:'Microsoft PowerPoint',outlook:'Microsoft Outlook',n8n:'n8n',chatgpt:'ChatGPT',claude:'Claude',gemini:'Gemini',notion:'Notion',miro:'Miro',jira:'Jira',figma:'Figma',aftereffects:'Adobe After Effects',cinema4d:'Cinema 4D',higgsfield:'Higgsfield',comfyui:'ComfyUI',blender:'Blender',resolve:'DaVinci Resolve',vscode:'Visual Studio Code',jupyter:'JupyterLab',powerbi:'Power BI',tableau:'Tableau',grafana:'Grafana',hubspot:'HubSpot',ga4:'Google Analytics 4',looker:'Looker Studio',flutter:'Flutter / Dart',firebase:'Firebase',langflow:'Langflow',supabase:'Supabase',github:'GitHub Actions',canva:'Canva',unreal:'Unreal Engine',unity:'Unity',postman:'Postman',docker:'Docker Desktop'};
export const appNames=apps;
const s=(app,title,weight=1,extra={})=>({app,title,tool:apps[app]||app,weight,...extra});
function fieldScript(f,topic,result){
 const scripts={
 workflow:[`Start with a real business process: ${topic}. We turn scattered inputs into a controlled workflow, then make every result easy to review.`,`Use the assistant to structure the request. Clean the source table, check formulas, and separate missing information from valid records. The original evidence stays connected.`,`Now connect the steps in n eight n. Inspect the input and output of each node. Add a human approval branch, a retry path, and a record of what happened.`,`The same checked data becomes a Word brief, a PowerPoint summary, and an email draft. A shared dashboard makes ${result} visible, with an owner and a clear next action.`],
 strategy:[`Before building ${topic}, define the problem and the decision it will support. Make the expected outcome measurable, and record what is still an assumption.`,`Compare the evidence with an AI assistant. Organize the research, map the journey, and turn the opportunity into a small experiment that a team can actually run.`,`Connect the roadmap to delivery. Write acceptance criteria, show dependencies, and track risk alongside progress. A plan is useful only when someone can act on it.`,`Bring the evidence, cost, and next decision into ${result}. The output is a shared direction, with clear ownership and a review point.`],
 design:[`Let us build ${topic} as a coherent visual system. Start with composition and reusable components, then move into motion, materials, and controlled variation.`,`Shape the timing in After Effects. Work with keyframes, expressions, and the graph editor. Match the three dimensional scene to the same camera and visual direction.`,`Use generative tools with a clear shot plan. Control the reference, frame, and movement. Then inspect the composite, lighting, and transitions instead of accepting every first result.`,`Adapt the work into ${result}. Compare formats side by side, preview the movement, and review the final experience at the size people will actually see.`],
 analytics:[`The question comes first: ${topic}. Check the grain of the data and its definitions before you draw a chart or build a model.`,`Clean and join the source tables. Use SQL and a notebook to explore distributions, missing values, and the assumptions behind the calculation. Keep the analysis reproducible.`,`Move from exploration to a clear analytical model. Compare segments, validate the calculation, and make uncertainty visible. A useful dashboard supports a decision, not just a collection of charts.`,`Publish the story as ${result}. Let people filter the view, inspect the evidence, and understand the next action. The presentation should remain clear when the underlying data changes.`],
 marketing:[`Connect the message to a measurable customer journey: ${topic}. Use an AI assistant to explore ideas, then choose a specific audience, offer, and experiment.`,`Build the content variants and connect them to customer records. A campaign needs consistent naming, clean segments, and a next step that makes sense for each person.`,`Track the journey in analytics. Compare the creative, the landing page, and the conversion event. Feed the result back into the workflow, with a review before external communication.`,`Bring those signals into ${result}. Show what changed, what it means, and what to test next. Creative production and measurement work as one continuous loop.`],
 development:[`Turn ${topic} into a working product. Start with the interface, the data contract, and the boundaries between the client, the API, and the storage layer.`,`Build the web experience in React and TypeScript, or a mobile flow in Flutter and Dart. Watch the interface update beside the source, and test loading, success, and error states.`,`Connect the backend deliberately. Inspect database rules and API responses. Where an AI assistant is involved, trace retrieval, evaluate the answer, and preserve its sources.`,`Test the critical journey and prepare a repeatable release. The result is ${result}: a usable experience with a clear architecture, visible state, and a path to improve it.`]
 };return scripts[f];
}
function beatShots(f,a){
 const [a0,a1,a2,a3,a4,a5]=a;
 return [
 [s(a0,'Start with a useful question',1.1),s(a1,'Structure the evidence',1.35),s(a0,'Inspect the input',.7,{camera:'detail'})],
 [s(a0,'Work through the details',1.25,{stage:1}),s(a1,'Compare the alternatives',.8,{stage:1}),s(a2,'Connect the next step',1.55,{stage:1}),s(a0,'Input and output',1.0,{split:a3,stage:2})],
 [s(a2,'Build the logic',1.8,{stage:2,camera:'detail'}),s(a4,'Inspect the next layer',1.2,{stage:1}),s(a5,'Review the evidence',.7,{stage:1}),s(a2,'Follow the path',1.4,{split:a4,stage:3})],
 [s(a3,'Bring the result into focus',1.5,{stage:2}),s(a4,'Review the complete journey',1,{stage:2}),s(a5,'Ready for the next decision',1.6,{split:'result',stage:3}),s('result','The finished experience',1.15,{stage:3})]
 ];
}
export const films=[];
for(const m of members)for(const f of m.fields){
 const [title,topic,result,...a]=cases[m.name+':'+f];
 let scripts=fieldScript(f,topic,result),shots=beatShots(f,a);
 if(m.name==='Chris'&&f==='workflow'){
 scripts=[
  'A weekly report should be a connected process. Start in Excel, check the data, and turn a plain language request into a precise reporting brief.',
  'Use ChatGPT to structure the task. In Excel, clean the table and inspect the formula. Word carries the explanation, while PowerPoint turns the same evidence into a clear story.',
  'Now connect the steps in n eight n. Follow the data through the nodes. Inspect the structured output, require approval, and route a failed step into a visible recovery path.',
  'Preview the report beside the source. Prepare the email draft, schedule the next run, and surface the result in a team dashboard. Every decision stays connected to its evidence.'
 ];shots=[
 [s('excel','Validate the source table',1.6),s('chatgpt','Turn intent into a reporting brief',1.4),s('excel','Inspect the calculation',.9,{stage:1,camera:'detail'})],
 [s('chatgpt','A structured request',1,{stage:1}),s('excel','From table to evidence',1.5,{stage:2}),s('word','A reviewable explanation',1.1,{stage:1}),s('powerpoint','The same evidence, clearly presented',1.3,{stage:1})],
 [s('n8n','Connect the reporting workflow',1.4),s('n8n','Inspect the JSON contract',1.8,{stage:1,camera:'detail'}),s('n8n','Approval and recovery paths',1.3,{stage:2}),s('n8n','Execution trace',1,{stage:3,split:'excel'})],
 [s('excel','Source and report, side by side',1.4,{split:'powerpoint',stage:2}),s('outlook','A draft ready for human review',1.1,{stage:1}),s('n8n','Schedule the next run',.9,{stage:3}),s('result','The team sees the next action',1.5)]
 ];
 }
 if(m.name==='John'&&f==='workflow'){
 scripts=[
 'An invoice workflow starts with the exceptions. Compare the source rows, find duplicates, and separate a missing purchase order from a simple formatting problem.',
 'Ask Claude to propose the validation rules. Check those rules in Excel, then put the review requirements in a Word brief. A confident answer is never a substitute for a checked record.',
 'Build separate paths in n eight n for matched invoices and records that need attention. Inspect the payload, keep an idempotency key, and make retries safe.',
 'Give the reviewer the original record, the reason it was flagged, and the next action. The final queue, email draft, and summary all point to the same approved state.'
 ];shots=[
 [s('excel','Find the exceptions first',1.5,{stage:1}),s('excel','Duplicates and missing fields',1,{camera:'detail',stage:2}),s('claude','Turn the policy into explicit rules',1.5)],
 [s('claude','Structured validation rules',1.4,{stage:2}),s('excel','Check the rule against the data',1.4,{stage:3}),s('word','A reviewable exception policy',1.2,{stage:1,split:'excel'})],
 [s('n8n','Matched and exception branches',1.8,{stage:2}),s('n8n','Inspect the item and its key',1.5,{stage:1,camera:'detail'}),s('n8n','A visible retry path',1.1,{stage:3})],
 [s('result','One queue, clear ownership',1.4),s('outlook','Review the message before sending',1.2,{stage:2}),s('powerpoint','A summary grounded in the records',1,{stage:2}),s('result','Close the loop',1.4,{split:'excel'})]
 ];
 }
 const id=`${m.name.toLowerCase()}-${f}-demo`;
 films.push(refineFilm({id,mediaId:`acumelo-${id}-${revision}`,stem:`${id}-${revision}`,kind:'demo',scope:'instructor',name:m.name,instructorId:m.id,fieldId:f,title,topic,result,apps:a,variant:m.index,color:colors[f],voice:m.voice,bpm:104+m.index%4*6,beats:scripts.map((text,i)=>({text,shots:shots[i]})),contentOwnerId:'instructor-chris',temporaryAssignment:m.id!=='instructor-chris'}));
}
for(const [f,title] of Object.entries(fields)){
 const basis=films.find(x=>x.name==='Chris'&&x.fieldId===f);
 films.push({...basis,id:`${f}-overview`,mediaId:`acumelo-${f}-overview-${revision}`,stem:`${f}-overview-${revision}`,scope:'category',instructorId:null,name:'Acumelo',title,variant:15,bpm:112,voice:'am_michael',temporaryAssignment:false,beats:basis.beats.map((b,i)=>({...b,shots:b.shots.map((s,j)=>({...s,stage:(i+j)%4}))}))});
 const chunks=[
 `Explore what learning can become. These original ${title.replace('AI ','').toLowerCase()} project concepts show different ways to turn an idea into something people can use.`,
 `Some outputs make a decision clearer. Others create a useful interaction, a visual story, or a more connected way of working. Each starts with a different problem.`,
 `Compare the formats, explore the details, and imagine a version for your own team. The next step is to make the result useful in its real context.`
 ];
 const scenes=previousProjects[f].map((p,i)=>({...p,variant:i+f.length,weight:[1.2,.55,1.7,.8,1,.65,1.4,.7][i%8]}));
 films.push({id:`${f}-showcase`,mediaId:`acumelo-${f}-showcase-${revision}`,stem:`${f}-showcase-${revision}`,kind:'showcase',scope:'category',name:'Acumelo',fieldId:f,title:`${title} / Project possibilities`,topic:title,result:'24 original project concepts',variant:18,color:colors[f],voice:'af_heart',bpm:120,contentOwnerId:'instructor-chris',temporaryAssignment:false,beats:chunks.map((text,i)=>({text,shots:scenes.slice(i*8,i*8+8).map((p,j)=>({app:'project',title:p.title,weight:p.weight,project:p,projectIndex:i*8+j,split:j===3||j===6?'project':undefined,secondProject:scenes[(i*8+j+1)%24]}))}))});
}
export const disclosure='Original illustrative training sequences and project concepts. Application layouts are reference-informed reconstructions, not recordings of live software use or verified student submissions. Temporary synthetic English voice and original music.';
export const productionRules={noNativeAppLaunch:true,noPaidGeneration:true,keepOfficeSamples:false,referenceCourse:'https://www.inflearn.com/course/chatgpt-work-for-beg?cid=343748',originalsOwner:'instructor-chris',voiceStemsSeparate:true,musicStemsSeparate:true,appNames,toolGroups,disclosure};
