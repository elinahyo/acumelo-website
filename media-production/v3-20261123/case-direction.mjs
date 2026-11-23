// Individual teaching cases. Every case is illustrative, not a claim of client work.
const mids={
'Chris:strategy':[
'Use Claude to challenge the proposed operating model. Separate assistive tasks from decisions that need approval. In Miro, map the owner, the evidence, and the handoff before choosing a tool.',
'Turn that map into a delivery backlog. Record acceptance criteria, access requirements, and a stop condition in Jira. Compare cost and expected value in Excel before expanding the pilot.'],
'Chris:design':[
'In After Effects, shape the rhythm with keyframes, expressions, and the graph editor. In Cinema 4D, connect the cloner, materials, lighting, and camera so the visual system stays coherent.',
'Plan controlled camera movement in Higgsfield, then trace the generation graph in ComfyUI. Keep the prompt, seed, sampler, and reference choices visible. Review the composite and color in Resolve.'],
'Chris:analytics':[
'Reconcile the source totals in Excel. In a notebook, inspect missing values and revenue distributions. Use Python and SQL to separate a true business change from a data-quality issue.',
'Model the measures in Power BI, compare segments in Tableau, and inspect the operational signal in Grafana. Trace each metric back to its definition before presenting the result.'],
'Chris:marketing':[
'Use ChatGPT to develop distinct messages for one audience. Build the creative variants in Figma and connect them to clean HubSpot segments. Keep the campaign naming and offer consistent.',
'In Google Analytics, inspect the acquisition channel and conversion event. Connect the review loop in n eight n, then compare cost and response in Looker Studio before deciding what to test next.'],
'Chris:development':[
'Use React and TypeScript for the web workspace, then inspect the Flutter and Dart mobile flow. Keep loading, error, and success states explicit, with a shared contract for the underlying data.',
'Inspect Firestore access rules and trace retrieval in Langflow. Explore the same knowledge experience in Unity and Unreal. The interface changes, while sources, permissions, and the service boundary stay visible.'],
'Sage:strategy':[
'Map the booking journey in Miro. Ask Gemini to challenge the research assumptions, then record the evidence in Notion. Distinguish a customer problem from a feature that only sounds attractive.',
'Translate the opportunity into a small experiment. Use Jira for acceptance criteria and Figma for the interaction hypothesis. Compare the proposal with the evidence before choosing the next release.'],
'Sage:design':[
'In Figma, build the booking flow from reusable components and responsive frames. Use Claude to explore clearer interface copy, then test a transition in After Effects without hiding the important state change.',
'Adapt the concept in Canva and build a simple spatial treatment in Blender. Review the motion and format in Resolve, keeping typography, contrast, and interaction feedback consistent across surfaces.'],
'Sage:development':[
'Build the appointment journey in React, then compare the mobile version in Flutter. Handle an unavailable slot, an incomplete form, and a successful reservation as separate, testable states.',
'Use Supabase to inspect booking records and access policies. Review the interface beside the Figma flow, then check the Firebase configuration and a repeatable release pipeline in GitHub Actions.'],
'Pillow:design':[
'Begin with timing in After Effects and a spatial composition in Cinema 4D. Animate the reveal, inspect the graph editor, and adjust the camera so the installation has a clear focal point.',
'Trace a visual variation through ComfyUI, plan a restrained shot in Higgsfield, and refine the scene in Blender. Resolve connects the cuts and color into one continuous exhibition experience.'],
'Pillow:development':[
'Build the browser scene with Three dot js and React. Separate the camera, scene state, and interaction logic. A visitor should understand how to move and what can be selected without an explanation.',
'Compare the scene in Unity and Unreal, then inspect the Blender asset and Firebase content model. Test selection and loading before sending the browser experience through a repeatable GitHub release.'],
'John:development':[
'Define the invoice contract in FastAPI and validate it with typed models. Use Postman to send a correct request, an invalid request, and a duplicate request. Each response should have a clear meaning.',
'Inspect the transaction in Supabase and connect the downstream step in n eight n. Add an idempotency key before retrying. Use Grafana to review failures and GitHub Actions to keep releases repeatable.'],
'Sarah:strategy':[
'Use Notion for the production brief and Miro for the sequence of decisions. Separate creative exploration from approved scope, then assign a named owner to every handoff.',
'Track dependencies and review gates in Jira. Use Claude to challenge the plan, then compare effort and capacity in Excel. A change request must show its effect on timing and quality.'],
'Sarah:design':[
'Build a flexible campaign layout in Figma and plan the hero shot in Higgsfield. In Cinema 4D, refine the product silhouette, material response, and lighting before the sequence is edited.',
'Use After Effects to control the reveal and typography. Adapt the campaign into different formats in Canva, then review the final timing and color in Resolve at the actual delivery size.'],
'Joseph:analytics':[
'In Jupyter, check missing periods and separate training data from the validation window. Inspect seasonality and demand in Excel, then compare a simple baseline with a time-aware forecast.',
'Show the forecast and its uncertainty in Power BI. In Tableau, compare product groups. Use Grafana for the operational signal, keeping the model error visible beside the planning decision.'],
'Joseph:development':[
'Package the demand model behind a typed FastAPI endpoint. Keep the training notebook separate from the serving code. Use Postman to inspect the forecast, its horizon, and its uncertainty.',
'Store each model version and prediction in Supabase. Package the API and worker with Docker, then check the release in GitHub Actions. A planner needs a stable contract, not access to the notebook.'],
'Rachel:marketing':[
'Define the lifecycle stages in HubSpot. Use ChatGPT to draft different messages for new leads and returning customers. A useful sequence follows the customer context instead of sending the same message to everyone.',
'Inspect the landing-page and conversion events in Google Analytics. Compare the segment response in Looker Studio, then build the review step in n eight n and adapt the creative in Canva.'],
'Rachel:development':[
'Build an experiment dashboard in React and TypeScript. Keep assignment, exposure, and conversion as separate events. The interface should make the hypothesis and the current evidence easy to compare.',
'Inspect the experiment records in Supabase and test the event endpoint in Postman. Check the analytics naming, connect the review workflow, and keep the release reproducible with GitHub Actions.'],
'Joshua:analytics':[
'Use SQL to define the first active period for each customer. In Jupyter, build a retention matrix and check that each row uses the same cohort definition before comparing the percentages.',
'Compare the cohort heatmap in Tableau with a Power BI summary. Inspect the operational signal in Grafana, then reconcile the underlying totals in Excel. The cohort definition must remain consistent in every view.'],
'Joshua:development':[
'Build the cohort explorer in React and compare its mobile navigation in Flutter. Make the date window, segment filter, and cohort definition visible so a user understands what the chart represents.',
'Inspect the query and access rules in Supabase, then compare the result with the notebook. Use Docker for a repeatable stack and GitHub Actions to test the critical filtering journey before release.'],
'Elizabeth:workflow':[
'Use Gemini to structure the meeting notes, then put the decision record in Word. In Excel, separate decisions, open questions, owners, and dates. A summary becomes useful when responsibility is explicit.',
'Connect the approved actions in n eight n. Check the incoming record, assign the owner, and branch overdue items into a review queue. Keep the original meeting reference attached to every follow-up.'],
'Elizabeth:strategy':[
'Use Jira to show the delivery portfolio, then maintain the decision log in Notion. In Miro, map dependencies across teams so a blocked item is visible before it delays another project.',
'Ask Gemini to challenge the status summary. Compare capacity and risk in Excel, then prepare a concise portfolio review. Focus on the next decision and the owner responsible for it.'],
'Michael:analytics':[
'Start in Excel and reconcile revenue, target, and margin. Build explicit measures in Power BI, then use Tableau to compare regions and products without mixing incompatible definitions.',
'Inspect an unusual movement in Jupyter and check its source. Bring the verified measures into Looker Studio, then use PowerPoint to explain what changed and which management decision follows.'],
'Rebecca:workflow':[
'Ask ChatGPT to turn the onboarding request into a structured checklist. Keep the policy explanation in Word and the approved inputs in Excel. Access requests and personal details need clear boundaries.',
'Build separate approval and provisioning steps in n eight n. Inspect the payload, prevent duplicate requests, and expose missing information. An email draft and a Notion checklist should reflect the same approved state.'],
'Rebecca:development':[
'Build a cited knowledge assistant with a small, typed service boundary. In Langflow, inspect the query, retrieved passages, prompt, and response. An answer without supporting evidence needs a different state.',
'Check the source records and access policies in Supabase and Firebase. Test an empty retrieval and an unauthorized request in Postman, then run the release checks in GitHub Actions before expanding the knowledge base.']
};
const labels={
excel:['Inspect the source table','Check the formula and exceptions','Reconcile the source and report','Automate a repeatable table check'],word:['Write the evidence-based brief','Keep decisions and sources together','Review the next action'],powerpoint:['Turn evidence into a clear story','Review the slide structure','Adapt the executive summary'],outlook:['Prepare a reviewable email draft','Keep approval before sending'],chatgpt:['Structure the task in ChatGPT','Review the proposed output'],claude:['Challenge the rules with Claude','Review the artifact and its assumptions'],gemini:['Structure the evidence with Gemini','Compare the proposed next steps'],n8n:['Connect the workflow nodes','Inspect the input and output contract','Trace approval and recovery paths','Review the execution state'],notion:['Maintain the shared decision brief','Track owners and next actions'],miro:['Map evidence, dependencies, and decisions','Connect the opportunity to an experiment'],jira:['Track delivery and acceptance criteria','Make dependencies and review gates visible'],figma:['Build reusable interface components','Inspect layout, spacing, and states','Compare responsive surfaces'],aftereffects:['Shape the timing and composition','Animate the layers and keyframes','Inspect the graph editor'],cinema4d:['Build the camera and material system','Inspect the cloner and geometry','Review lighting and the rendered scene'],higgsfield:['Plan the camera and shot sequence','Compare camera, lens, and movement'],comfyui:['Trace the generation graph','Control the prompt, sampler, and decode'],blender:['Inspect the scene and asset structure','Review geometry, lighting, and render'],resolve:['Edit the sequence and sound','Review timing, color, and the final frame'],canva:['Adapt the campaign across formats','Review layout and type at delivery size'],vscode:['Inspect the architecture and source','Trace data and interface state','Review a testable service boundary'],flutter:['Build the Flutter interface in Dart','Compare the mobile state and source'],firebase:['Inspect Firestore records','Review document fields and ownership','Check the access rules'],supabase:['Inspect the relational data','Review the stored state','Trace the query and access boundary'],langflow:['Trace retrieval through the flow','Inspect context, answer, and sources'],unity:['Work in the Unity scene and Inspector','Inspect the scene hierarchy','Connect objects and interaction'],unreal:['Review the Unreal scene and assets','Inspect the actor properties','Trace the Blueprint event graph'],jupyter:['Explore the data in a notebook','Check assumptions and validation','Compare the analysis and output'],powerbi:['Build explicit dashboard measures','Inspect the report and filter context'],tableau:['Compare dimensions and measures','Inspect the analytical view'],grafana:['Monitor the operational signal','Inspect failures and changes over time'],hubspot:['Connect contacts and lifecycle stages','Review the segment and follow-up','Trace the customer activity'],ga4:['Inspect acquisition and conversion events','Compare the customer journey'],looker:['Bring the campaign signals together','Review the decision dashboard'],postman:['Test the request and response contract','Inspect errors and duplicate handling'],docker:['Package a repeatable service stack','Inspect container state and logs'],github:['Review the repeatable release pipeline','Check tests before publishing'],result:['The finished experience']};
export function refineFilm(f){const mid=mids[f.name+':'+f.fieldId];if(mid){f.beats[1].text=mid[0];f.beats[2].text=mid[1]}
 if(f.name==='Rebecca'&&f.fieldId==='development')f.beats[0].text='Build an internal knowledge assistant that knows its boundaries. Start with the question, the permitted sources, and the evidence required for a useful response.';
 if(f.name==='John'&&f.fieldId==='development')f.beats[0].text='Build a dependable invoice-processing service. Define the request, the validation rules, and the state change before connecting the API to another system.';
 if(f.name==='Joseph'&&f.fieldId==='development')f.beats[0].text='Turn a demand forecast into a service that a planner can use. Define the prediction horizon, the input contract, and the model version before building the interface.';
 const shot=(app,stage=0,weight=1,extra={})=>({app,stage,weight,title:(labels[app]||[app])[stage%(labels[app]?.length||1)],...extra});
 const set=(i,arr)=>f.beats[i].shots=arr.map(v=>typeof v==='string'?shot(v):shot(...v));
 if(f.fieldId==='design'){
   const model=f.name==='Sage'?'blender':'cinema4d';
   if(f.name==='Chris'||f.name==='Pillow'){
     set(1,[['aftereffects',1,1.2],['aftereffects',2,.9,{camera:'detail'}],[model,1,1.2],[model,2,1.4,{split:'aftereffects'}]]);
     set(2,[['higgsfield',1,1.4],['comfyui',2,1.7,{camera:'detail'}],['blender',2,.9],['resolve',2,1.2]]);
   }else if(f.name==='Sarah'){
     set(1,[['figma',1,1.3],['higgsfield',1,1.4],[model,1,.8],[model,2,1.4,{split:'figma'}]]);
     set(2,[['aftereffects',2,1.7,{camera:'detail'}],['canva',1,1.0],['resolve',2,1.5,{split:'aftereffects'}]]);
   }else{
     set(1,[['figma',1,1.5],['claude',1,.9],['figma',2,.8],['aftereffects',2,1.5]]);
     set(2,[['canva',1,1.0],['blender',1,1.2],['blender',2,.9],['resolve',2,1.5,{split:'figma'}]]);
   }
   set(3,[['resolve',2,1.4],['figma',2,.9,{split:'canva'}],['resolve',3,1.2,{split:'result'}],['result',3,1.8]]);
 }
 if(f.fieldId==='workflow'&&!['Chris','John'].includes(f.name)){
   const ai=f.name==='Elizabeth'?'gemini':'chatgpt';
   set(1,[[ai,1,1.1],['word',1,1.1],['excel',1,1.4],['excel',3,1.2,{split:'word'}]]);
   set(2,[['n8n',0,1.3],['n8n',1,1.7,{camera:'detail'}],['n8n',2,1.3],['n8n',3,1.2,{split:'excel'}]]);
   set(3,[['outlook',1,1.3],[f.name==='Rebecca'?'notion':'powerpoint',2,1.3],['result',3,1.9,{split:'excel'}],['result',3,1.2]]);
 }
 if(f.fieldId==='analytics'){
   const nb=f.name==='Joshua';set(1,[[nb?'vscode':'excel',1,1.2],['jupyter',1,1.4],['vscode',2,1.3,{camera:'detail'}],['jupyter',2,1.2,{split:'excel'}]]);
   set(2,[['powerbi',1,1.5],['tableau',2,1.4],['grafana',1,1.3],['tableau',1,.9,{split:'powerbi'}]]);
   set(3,[[f.name==='Michael'?'looker':'powerbi',2,1.4],['excel',2,.9],['result',3,1.5,{split:'tableau'}],['result',3,1.4]]);
 }
 if(f.fieldId==='development'){
   const flows={
    Chris:[[['vscode',1,1.5],['flutter',1,1.4],['vscode',2,1.1,{split:'flutter'}]],[['firebase',2,1.2],['langflow',2,1.5],['unity',0,1.1],['unreal',2,1.2]]],
    Sage:[[['vscode',1,1.5],['flutter',1,1.4],['flutter',2,1.2,{split:'result'}]],[['supabase',2,1.3],['figma',2,.9],['firebase',2,1.1],['github',1,1.4]]],
    Pillow:[[['vscode',1,1.5],['vscode',2,1.1,{camera:'detail'}],['vscode',3,1.5,{split:'result'}]],[['unity',0,1.4],['unreal',2,1.6],['blender',1,1.0],['firebase',0,1.0]]],
    John:[[['vscode',1,1.6],['postman',0,1.2],['postman',2,1.3,{camera:'detail'}]],[['supabase',2,1.5],['n8n',1,1.3],['grafana',1,1.1],['github',1,1.1]]],
    Joseph:[[['vscode',1,1.6],['jupyter',2,1.1],['postman',1,1.4,{split:'vscode'}]],[['supabase',2,1.4],['docker',0,1.4],['docker',1,.8,{camera:'detail'}],['github',1,1.4]]],
    Rachel:[[['vscode',1,1.5],['vscode',2,1.0,{camera:'detail'}],['vscode',3,1.7,{split:'result'}]],[['supabase',2,1.3],['postman',1,1.1],['ga4',1,.9],['n8n',2,1.1],['github',1,1.0]]],
    Joshua:[[['vscode',1,1.5],['flutter',1,1.4],['vscode',2,1.2,{split:'flutter'}]],[['supabase',2,1.4],['jupyter',2,1.0],['docker',1,1.2],['github',1,1.4]]],
    Rebecca:[[['vscode',1,1.3],['langflow',0,1.4],['langflow',2,1.5,{camera:'detail'}]],[['supabase',2,1.2],['firebase',2,1.2],['postman',2,1.3],['github',1,1.3]]]
   };const pair=flows[f.name];if(pair){set(1,pair[0]);set(2,pair[1]);set(3,[['github',1,1.2],['result',3,1.7,{split:'vscode'}],['result',3,2.1]])}
 }
 // Chris and John workflow edits have already been authored shot by shot.
 if(!(f.fieldId==='workflow'&&['Chris','John'].includes(f.name))){f.beats=f.beats.map(b=>({...b,shots:b.shots.map(sh=>({...sh,title:(labels[sh.app]||[sh.title])[(sh.stage||0)%(labels[sh.app]?.length||1)]}))}))}
 return f;
}
