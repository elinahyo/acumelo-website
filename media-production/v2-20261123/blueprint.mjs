export const fields={workflow:'AI Workflow & Automation',strategy:'AI Strategy & Project Management',design:'AI Design & Content',analytics:'AI Data Analytics',marketing:'AI Marketing & Sales',development:'AI Service Development'};
export const colors={workflow:'#5ad5b1',strategy:'#e8b769',design:'#bca0fa',analytics:'#66b8ef',marketing:'#fb8d8e',development:'#8d9eff'};
// Each tuple is an independently composed framework scene, not an app recording.
const S=(type,tool,title,detail,extra={})=>({type,tool,title,detail,...extra});
export const members=[
{id:'instructor-chris',name:'Chris',fields:Object.keys(fields),focus:'The connected AI production stack',color:'#799dff',scenes:[
 S('architecture','System architecture','One brief. Six connected disciplines.','Data contracts / event boundaries / human approvals',{labels:['Brief','Workflow','Data','Creative','Services','Release']}),
 S('nodes','n8n','Build the automation control plane','Webhook validation → deduplication → approval → retries',{labels:['Webhook','Validate payload','Idempotency','Approval gate','Write records','Error workflow']}),
 S('sheet','Excel + Office Scripts','Turn operations data into decisions','Typed tables / anomaly flags / report generation',{variant:1}),
 S('sql','PostgreSQL + Python','Design a reliable analytical layer','Incremental models / tests / cohort aggregation',{variant:1}),
 S('rag','RAG + vector search','Trace retrieval before generating','Chunking → hybrid retrieval → reranking → citations',{labels:['Documents','Chunk 512','Embed','Hybrid search','Rerank 8','Cited answer']}),
 S('ae','After Effects','Bind motion to data','Expressions / keyframe easing / precompositions',{asset:'sculpture',variant:1}),
 S('c4d','Cinema 4D','Make a procedural visual system','Cloner / Fields / material controls / render passes',{asset:'product',variant:1}),
 S('unity','Unity','Connect an interactive experience','Components / events / runtime data binding',{asset:'islands',variant:1}),
 S('unreal','Unreal Engine','Stage a cinematic interaction','Blueprint / Niagara / Sequencer',{asset:'gallery',variant:1}),
 S('higgsfield','Higgsfield','Direct a controlled AI shot sequence','Shot plan / reference continuity / camera intent',{asset:'product',variant:1}),
 S('tests','CI + evaluation','Test the whole pipeline','Contract tests / retrieval evaluation / quality gates',{variant:1}),
 S('deploy','Cloudflare + GitHub','Ship a versioned experience','Preview → checks → production → rollback',{variant:1})]},
{id:'instructor-sage',name:'Sage',fields:['strategy','design','development'],focus:'From product hypothesis to usable service',color:'#dfb674',scenes:[
 S('roadmap','Product strategy','Map the hypothesis to a measurable outcome','Problem statement / experiment / decision rule',{variant:2}),
 S('figma','Figma','Build a reusable interface language','Variables / components / responsive constraints',{variant:2}),
 S('research','Discovery research','Synthesize the evidence','Interview themes / opportunity scores / assumptions',{variant:2}),
 S('kanban','Jira + delivery planning','Convert ideas into testable stories','Acceptance criteria / dependencies / capacity',{variant:2}),
 S('figma','Figma prototypes','Define the interaction states','Empty / loading / success / error',{variant:3}),
 S('code','React + TypeScript','Implement a stateful booking flow','Validation / accessible forms / optimistic update',{variant:2}),
 S('schema','Supabase','Model permissions with the product','Bookings / memberships / row-level policy',{variant:2}),
 S('motion','Motion design','Prototype a meaningful transition','Hierarchy / feedback / reduced motion',{variant:2}),
 S('tests','Playwright','Verify the critical journey','Keyboard / mobile / error recovery',{variant:2}),
 S('metrics','Product analytics','Instrument the activation path','Events / cohorts / conversion definitions',{variant:2}),
 S('risk','Release readiness','Make the launch decision explicit','Owner / evidence / fallback / decision log',{variant:2}),
 S('deploy','GitHub + Cloudflare','Release a usable product slice','Staging review / asset budget / release notes',{variant:2})]},
{id:'instructor-03',name:'Pillow',fields:['design','development'],focus:'Motion, 3D and interactive creative systems',color:'#b69af1',scenes:[
 S('ae','After Effects','Shape movement with the graph editor','Velocity curves / keyframe interpolation / timing',{asset:'sculpture',variant:3}),
 S('ae','After Effects expressions','Drive motion with a reusable controller','Slider control / time remap / responsive title',{asset:'product',variant:4}),
 S('vfx','VFX compositing','Rebuild the image in layers','Depth / matte / emission / color matching',{asset:'gallery',variant:3}),
 S('c4d','Cinema 4D MoGraph','Make variation procedural','Cloner / radial distribution / Fields falloff',{asset:'sculpture',variant:3}),
 S('shader','Cinema 4D materials','Design a controllable surface','Noise → ramp → roughness → layered material',{asset:'product',variant:3}),
 S('higgsfield','Higgsfield','Plan continuity across AI shots','Lens / camera direction / subject consistency',{asset:'gallery',variant:3}),
 S('unity','Unity Shader Graph','Expose a runtime visual parameter','Fresnel / emission / time / property binding',{asset:'islands',variant:3}),
 S('unreal','Unreal Engine Niagara','Build an event-driven particle effect','Emitter / spawn rate / vector field / lifetime',{asset:'sculpture',variant:3}),
 S('code','Three.js + GLSL','Move the visual system into the browser','Uniforms / pointer input / render loop',{variant:3}),
 S('ae','After Effects render pipeline','Prepare multi-format motion assets','Composition variants / alpha / delivery settings',{asset:'sculpture',variant:5}),
 S('tests','WebGL performance','Profile the interactive piece','Draw calls / frame budget / texture sizing',{variant:3}),
 S('deploy','Interactive portfolio','Publish a responsive creative experience','Preview / touch interaction / asset loading',{variant:3})]},
{id:'instructor-04',name:'John',fields:['workflow','development'],focus:'Reliable office automation and service integration',color:'#63d0b3',scenes:[
 S('sheet','Excel Power Query','Normalize messy operational exports','Unpivot / type rules / duplicate keys',{variant:4}),
 S('sheet','Office Scripts','Generate a repeatable report','Named tables / formulas / workbook validation',{variant:5}),
 S('slides','PowerPoint','Produce a data-linked executive deck','Template slots / charts / speaker notes',{variant:4}),
 S('mail','Outlook + email rules','Route messages with confidence','Classify / redact / approval / draft',{variant:4}),
 S('nodes','n8n','Connect Excel, email and reporting','Schedule → transform → report → approval → send',{labels:['Schedule','Excel rows','Normalize','PPT summary','Approval','Email draft'],variant:4}),
 S('code','FastAPI','Expose a typed automation endpoint','Pydantic / idempotency / structured errors',{variant:4}),
 S('schema','PostgreSQL','Persist workflow state safely','Jobs / attempts / payload versions',{variant:4}),
 S('queue','Queues + workers','Handle retries without duplicates','Backoff / dead letters / correlation ID',{variant:4}),
 S('nodes','n8n sub-workflows','Separate reusable steps','Credential scopes / input contracts / error path',{labels:['Webhook','Contract check','Transform','Save job','Dispatch','Retry branch'],variant:5}),
 S('tests','Integration tests','Test failure paths deliberately','Timeout / malformed row / missing approval',{variant:4}),
 S('metrics','Operations telemetry','Trace one job across services','Latency / run history / failure reasons',{variant:4}),
 S('deploy','Docker + CI','Deliver the automation safely','Environment config / health checks / rollback',{variant:4})]},
{id:'instructor-05',name:'Sarah',fields:['strategy','design'],focus:'Creative production planning and campaign systems',color:'#e8a4b8',scenes:[
 S('research','Creative strategy','Turn a brief into a production system','Audience / message / formats / evidence',{variant:5}),
 S('roadmap','Production planning','Plan dependencies before production','Storyboard → 3D → compositing → QA',{variant:5}),
 S('figma','Figma','Build a campaign design kit','Type scale / format variants / asset library',{variant:5}),
 S('higgsfield','Higgsfield shot planning','Direct a coherent campaign sequence','Reference board / camera language / shot IDs',{asset:'product',variant:5}),
 S('ae','After Effects','Construct the campaign master template','Nested comps / expressions / essential controls',{asset:'product',variant:6}),
 S('c4d','Cinema 4D','Plan the 3D product stage','Camera / light rig / material variations',{asset:'product',variant:5}),
 S('vfx','VFX review','Review the composite by pass','Matte edges / light continuity / final grade',{asset:'gallery',variant:5}),
 S('kanban','Notion + production board','Route creative reviews','Owner / version / comments / approval',{variant:5}),
 S('risk','Project management','Manage changes without losing scope','Impact / budget / contingency / sign-off',{variant:5}),
 S('slides','Campaign presentation','Present the rationale and delivery plan','Story / variations / channels / metrics',{variant:5}),
 S('metrics','Creative testing','Compare assets by a defined signal','Message variants / sample size / decision rule',{variant:5}),
 S('deploy','Asset delivery','Package the final campaign','Naming / dimensions / caption file / archive',{variant:5})]},
{id:'instructor-06',name:'Joseph',fields:['analytics','development'],focus:'Data contracts, pipelines and analytical APIs',color:'#61bdd7',scenes:[
 S('schema','PostgreSQL','Design the analytical data contract','Fact grain / keys / dimensional model',{variant:6}),
 S('sql','SQL','Build an incremental revenue model','Watermarks / joins / late-arriving records',{variant:6}),
 S('code','Python + pandas','Validate and transform the source','Nullable types / schema assertions / profiling',{variant:6}),
 S('nodes','dbt + orchestration','Trace lineage across models','Sources → staging → marts → metrics',{labels:['Sources','Staging','Quality tests','Dimensions','Fact model','Metric API'],variant:6}),
 S('sheet','Data quality','Locate anomalies before reporting','Null rates / outliers / reconciliation',{variant:6}),
 S('notebook','Jupyter','Explain the analytical assumptions','Cohorts / confidence / validation windows',{variant:6}),
 S('code','FastAPI','Serve the model through a typed API','Filters / pagination / cache / response schema',{variant:6}),
 S('dashboard','Plotly + Dash','Build a linked analytical interface','Cross-filter / drill-down / uncertainty',{variant:6}),
 S('tests','Data tests','Check the invariants on every run','Uniqueness / freshness / referential integrity',{variant:6}),
 S('queue','Pipeline monitoring','Recover failed data partitions','Checkpoint / replay / alert routing',{variant:6}),
 S('metrics','Query performance','Measure cost before scaling','Query plan / scan size / materialization',{variant:6}),
 S('deploy','Data service deployment','Ship a versioned analytical service','Schema migration / checks / observability',{variant:6})]},
{id:'instructor-07',name:'Rachel',fields:['marketing','development'],focus:'Growth experiments and customer-facing services',color:'#f38c85',scenes:[
 S('funnel','GA4 + events','Define the acquisition measurement plan','Events / properties / consent / attribution',{variant:7}),
 S('sql','SQL segmentation','Build actionable customer segments','Recency / frequency / value / lifecycle',{variant:7}),
 S('crm','CRM','Model the sales lifecycle','Lead score / owner / next action / evidence',{variant:7}),
 S('figma','Landing page design','Design an experiment-ready offer','Message hierarchy / CTA / variant states',{variant:7}),
 S('code','Next.js','Implement a measurable landing page','Server rendering / forms / event contract',{variant:7}),
 S('higgsfield','Higgsfield campaign shots','Plan distinct creative variants','Product angle / motion / crop / continuity',{asset:'product',variant:7}),
 S('ae','After Effects ad variants','Build responsive campaign motion','Vertical / square / wide / type-safe area',{asset:'product',variant:7}),
 S('nodes','n8n + CRM','Connect acquisition to follow-up','Webhook → qualify → score → assign → nurture',{labels:['Signup','Consent','Qualify','Lead score','CRM owner','Nurture'],variant:7}),
 S('metrics','Experiment design','Read conversion with uncertainty','Control / treatment / lift / confidence',{variant:7}),
 S('mail','Email journeys','Personalize a lifecycle sequence','Trigger / segment / frequency / exit rule',{variant:7}),
 S('tests','Analytics QA','Verify events before a campaign','Duplicate events / UTM / form failure',{variant:7}),
 S('deploy','Growth service delivery','Release the full acquisition loop','Landing → CRM → experiment dashboard',{variant:7})]},
{id:'instructor-08',name:'Joshua',fields:['analytics','development'],focus:'Forecasting, geospatial analysis and decision apps',color:'#9bbe66',scenes:[
 S('notebook','Python forecasting','Separate signal from seasonality','Baseline / rolling validation / residuals',{variant:8}),
 S('sql','Time-series SQL','Create the training window safely','Time grain / gaps / leakage prevention',{variant:8}),
 S('map','GeoPandas','Connect performance to geography','Spatial join / projection / aggregation',{variant:8}),
 S('notebook','scikit-learn','Compare a model to the baseline','Backtesting / MAE / calibration',{variant:8}),
 S('dashboard','Streamlit','Build an interactive scenario model','Assumptions / sliders / forecast bands',{variant:8}),
 S('code','Python simulation','Quantify operational uncertainty','Monte Carlo / constraints / sensitivities',{variant:8}),
 S('schema','PostGIS','Serve spatial features efficiently','Indexes / bounding boxes / simplification',{variant:8}),
 S('map','MapLibre','Build a decision map','Layers / legends / hover / region filters',{variant:9}),
 S('metrics','Model evaluation','Expose what the model gets wrong','Residual plots / segments / drift',{variant:8}),
 S('tests','Model tests','Guard against silent data leakage','Time splits / feature availability / bounds',{variant:8}),
 S('queue','Scheduled inference','Refresh predictions predictably','Batch windows / version pinning / recovery',{variant:8}),
 S('deploy','Decision application','Ship a forecast people can inspect','Inputs / intervals / provenance / download',{variant:8})]},
{id:'instructor-09',name:'Elizabeth',fields:['workflow','strategy'],focus:'Governed workflows and programme delivery',color:'#73c9c7',scenes:[
 S('roadmap','Programme planning','Connect outcomes to milestones','Benefits / owners / dependencies / gates',{variant:9}),
 S('risk','Risk register','Make operational risks actionable','Likelihood / impact / mitigation / owner',{variant:9}),
 S('sheet','Excel + planning models','Build a capacity and budget model','Workload / allocation / forecast / variance',{variant:9}),
 S('kanban','Jira + Notion','Build an evidence-based delivery board','Dependencies / blockers / review criteria',{variant:9}),
 S('nodes','n8n approval workflows','Automate the human decision points','Request → policy → owner → approve → audit',{labels:['Request','Policy check','Owner','Approval','Audit log','Notify'],variant:9}),
 S('mail','Email operations','Convert requests into tracked work','Intent / routing / SLA / escalation',{variant:9}),
 S('slides','PowerPoint reporting','Produce a decision-ready steering pack','Progress / risk / spend / decision needed',{variant:9}),
 S('architecture','Governance design','Define accountability across the system','Roles / access / escalation / evidence',{labels:['Sponsor','Owner','Reviewer','Operator','Audit','Outcome'],variant:9}),
 S('metrics','Programme health','Detect delivery risk early','Flow time / blocked work / forecast drift',{variant:9}),
 S('queue','Escalation automation','Handle exceptions explicitly','Timeout / fallback owner / audit events',{variant:9}),
 S('tests','Control validation','Check policy enforcement','Access / approval / retention / recovery',{variant:9}),
 S('deploy','Operational handover','Transfer a maintainable workflow','Runbook / support owner / change process',{variant:9})]},
{id:'instructor-10',name:'Michael',fields:['analytics'],focus:'Business intelligence and evidence-led decisions',color:'#80aee0',scenes:[
 S('sheet','Excel Power Query','Clean the source before analysis','Type inference / merge rules / missing values',{variant:10}),
 S('sql','SQL analytics','Define metrics at the correct grain','Joins / windows / period comparisons',{variant:10}),
 S('schema','Power BI data model','Build a clear semantic model','Star schema / relationships / date table',{variant:10}),
 S('code','DAX','Write a context-aware measure','CALCULATE / filter context / time intelligence',{variant:10}),
 S('dashboard','Power BI','Design a drillable executive view','KPIs / comparison / tooltip / drill-through',{variant:10}),
 S('notebook','Python statistics','Explain the uncertainty in a result','Bootstrap / distributions / interval estimates',{variant:10}),
 S('heatmap','Cohort analysis','Separate retention from acquisition','Cohort month / tenure / denominator',{variant:10}),
 S('map','Location analysis','Compare regions on equal terms','Normalization / exposure / region filters',{variant:10}),
 S('metrics','Forecast review','Compare plan with observed outcomes','Variance / seasonality / sensitivity',{variant:10}),
 S('tests','Analytical QA','Reconcile the report to its source','Totals / missing groups / freshness',{variant:10}),
 S('slides','Decision storytelling','Present a recommendation with evidence','Finding / caveat / action / follow-up',{variant:10}),
 S('dashboard','Published analytics','Deliver a readable decision surface','Permissions / refresh / mobile view',{variant:11})]},
{id:'instructor-11',name:'Rebecca',fields:['workflow','development'],focus:'Knowledge assistants and service operations',color:'#c09ed9',scenes:[
 S('architecture','Service architecture','Design an assistant with boundaries','Knowledge / tools / permissions / audit',{labels:['Request','Policy','Retrieve','Tools','Approval','Response'],variant:11}),
 S('rag','RAG ingestion','Create a traceable knowledge index','Parse / chunk / metadata / version',{labels:['Documents','Parse','Chunk','Metadata','Embeddings','Index'],variant:11}),
 S('code','Python document pipeline','Preserve source structure','Headings / tables / provenance / checksum',{variant:11}),
 S('rag','Hybrid retrieval','Retrieve evidence before responding','BM25 / vector / merge / reranking',{labels:['Question','Keyword','Vector','RRF merge','Rerank','Citations'],variant:12}),
 S('nodes','n8n + tools','Separate answers from actions','Intent → permission → tool → approval → log',{labels:['Intent','Permission','Tool call','Human gate','Execute','Audit'],variant:11}),
 S('mail','Service inbox automation','Route and draft with source evidence','Classification / retrieval / draft / review',{variant:11}),
 S('code','FastAPI + streaming','Serve a responsive assistant','Streaming / cancellation / structured events',{variant:12}),
 S('schema','Supabase + access policy','Scope knowledge to the right audience','Tenant / role / document policy',{variant:11}),
 S('tests','RAG evaluation','Test groundedness and abstention','Golden set / citation recall / failure modes',{variant:11}),
 S('metrics','Assistant observability','Inspect the full response trace','Retrieval / latency / cost / feedback',{variant:11}),
 S('queue','Service recovery','Handle slow or unavailable tools','Timeout / retry budget / human fallback',{variant:11}),
 S('deploy','Knowledge service release','Publish a reviewable assistant','Versioned prompts / policy / rollback',{variant:11})]}
];

const P=(kind,title,subtitle,asset,theme)=>({type:kind,title,detail:subtitle,asset,theme});
export const projects={
workflow:[
P('report','Monthly operations brief','An automatically assembled management summary'),P('dashboard','Finance pulse','Revenue, spend and cash position'),P('inbox','A calm, organized inbox','Priority messages with suggested next actions'),P('presentation','The weekly briefing','A finished executive slide deck'),P('calendar','A week that fits','Scheduling and capacity at a glance'),P('invoice','Invoice ready','A clean, generated customer document'),P('portal','Leave, without the paperwork','A self-service request portal'),P('dashboard','Inventory watch','Stock levels and reorder alerts'),P('report','Supplier comparison','A side-by-side purchasing report'),P('kanban','Approval desk','Requests grouped by decision stage'),P('presentation','Sales in one story','A finished data-led presentation'),P('chat','The team knowledge desk','A searchable internal help experience'),P('calendar','Team availability','A shared planning calendar'),P('report','Customer meeting notes','Decisions, actions and owners'),P('dashboard','Project spend monitor','Budget and actuals in one view'),P('portal','Travel request','A simple end-to-end request interface'),P('inbox','A helpful follow-up','A personalized, reviewable email draft'),P('invoice','Purchase order','A generated purchasing document'),P('kanban','Onboarding checklist','A clear path from offer to first day'),P('report','Expense summary','Receipts organized into a readable report'),P('dashboard','Service queue','Requests, response times and trends'),P('presentation','Quarterly review','A concise leadership-ready deck'),P('calendar','Delivery schedule','Milestones and responsible teams'),P('portal','Operations home','One front door for everyday work')],
strategy:[
P('presentation','A strategy made tangible','A concise AI adoption proposal'),P('roadmap','The next ninety days','A milestone-based delivery roadmap'),P('portal','Project brief','Goals, scope and success criteria'),P('kanban','Launch room','A shared view of work and ownership'),P('report','Opportunity assessment','Use cases ranked by value and feasibility'),P('dashboard','Programme pulse','Health, capacity and delivery outlook'),P('presentation','Decision day','A steering committee decision pack'),P('roadmap','Creative production plan','From brief to final delivery'),P('portal','Research library','Evidence organized around decisions'),P('report','Risk and response','A readable risk review'),P('calendar','Release calendar','Launches and review windows'),P('dashboard','Benefits tracker','A view of intended and observed value'),P('presentation','The product story','Problem, prototype and next steps'),P('kanban','Review and approve','A clear creative approval workflow'),P('report','Resource plan','Capacity, allocation and constraints'),P('roadmap','AI pilot journey','A staged learning and validation plan'),P('portal','Stakeholder hub','Updates, decisions and shared context'),P('dashboard','Portfolio view','Projects compared on consistent criteria'),P('presentation','Workshop outcomes','A finished facilitation summary'),P('calendar','Production schedule','People, dates and review checkpoints'),P('report','Launch readiness','A completed release review pack'),P('kanban','Sprint review','A visible record of completed work'),P('roadmap','Scale with evidence','A rollout plan with decision gates'),P('portal','Programme home','A usable centre for delivery information')],
design:[
P('film','Sculptural motion','A finished abstract motion loop','sculpture','dark'),P('product','Object / 01','A polished product visual','product','cream'),P('poster','MAKE / CREATE','A kinetic typography poster',null,'violet'),P('architecture','Quiet architecture','A rendered gallery space','gallery','cream'),P('game','Beyond the horizon','A cinematic environment study','islands','dark'),P('website','Studio Forma','A finished creative portfolio','sculpture','cream'),P('motion','Better together','A responsive brand motion system',null,'blue'),P('poster','New perspectives','An editorial campaign poster',null,'coral'),P('product','Material matters','A product finish exploration','product','dark'),P('film','Orbit study','An abstract VFX composition','sculpture','dark'),P('website','The exhibition','A digital exhibition landing page','gallery','cream'),P('motion','Shape the future','An animated identity study',null,'coral'),P('architecture','Light and structure','An architectural mood film','gallery','cream'),P('poster','The creative week','An event identity',null,'yellow'),P('game','Floating worlds','A stylized environment artwork','islands','dark'),P('product','A new point of view','A product campaign composition','product','blue'),P('website','Object collection','A digital product gallery','product','cream'),P('film','Particles in motion','A luminous VFX study','sculpture','dark'),P('poster','Sound / space','A music event visual',null,'dark'),P('motion','Small ideas. Big moves.','A typographic social film',null,'yellow'),P('architecture','The living gallery','A spatial design visualization','gallery','dark'),P('website','Motion archive','A responsive motion portfolio','sculpture','dark'),P('game','Neon pathways','An interactive-world concept','islands','dark'),P('film','A world of possibilities','A final creative montage','sculpture','blue')],
analytics:[
P('dashboard','Revenue, explained','A finished executive analytics view'),P('heatmap','Customers who stay','A cohort retention report'),P('map','The regional picture','A location-based performance map'),P('forecast','What comes next','A forecast with visible uncertainty'),P('report','The insight brief','A concise analytical recommendation'),P('dashboard','Product adoption','Activation and engagement trends'),P('heatmap','When customers return','Patterns by day and hour'),P('map','Delivery coverage','A service-area planning view'),P('forecast','Demand outlook','A seasonal demand comparison'),P('presentation','The data story','A finished decision-making deck'),P('dashboard','Marketing efficiency','Spend, conversion and return'),P('report','Quality scorecard','Data completeness and freshness'),P('map','Market opportunity','Regions compared on equal terms'),P('heatmap','Channel cohorts','Retention across acquisition channels'),P('forecast','Inventory scenarios','A comparison of planning assumptions'),P('dashboard','Service performance','Queue, volume and response signals'),P('report','Pricing evidence','A readable price sensitivity study'),P('presentation','Quarterly intelligence','A business review with evidence'),P('map','Site selection','A location comparison interface'),P('forecast','Cash flow outlook','A range of financial scenarios'),P('dashboard','Learning impact','Engagement and completion patterns'),P('heatmap','Portfolio correlations','A matrix of related signals'),P('report','Experiment readout','Results with caveats and next steps'),P('dashboard','Decision centre','A linked view of the business')],
marketing:[
P('website','An offer worth exploring','A finished campaign landing page','product','cream'),P('crm','From interest to opportunity','A sales pipeline interface'),P('poster','A clear message','A finished campaign creative',null,'coral'),P('dashboard','Campaign pulse','A performance overview for a launch'),P('inbox','A thoughtful welcome','A customer onboarding email'),P('product','The launch film','A finished product advertising visual','product','dark'),P('website','Reserve your place','An event registration landing page','gallery','cream'),P('report','The customer brief','Audience insight in a readable report'),P('crm','The next best action','A focused sales follow-up view'),P('motion','Make your next move','A short social campaign animation',null,'blue'),P('website','The product story','A conversion-focused product page','product','coral'),P('dashboard','An experiment, explained','Control and treatment side by side'),P('inbox','A timely reminder','A personalized lifecycle message'),P('poster','Ideas in motion','An event campaign asset',null,'yellow'),P('film','A visual hook','A short-form brand motion piece','sculpture','dark'),P('website','Join the conversation','A community campaign page','gallery','cream'),P('crm','A stronger relationship','An account planning interface'),P('report','Launch lessons','A finished campaign review'),P('motion','One message. Many formats.','A responsive advertising concept',null,'coral'),P('dashboard','The growth view','Acquisition through retention'),P('inbox','A useful recommendation','A product recommendation email'),P('product','A fresh perspective','A product-focused campaign scene','product','blue'),P('website','A place to begin','A polished lead-generation site','islands','dark'),P('presentation','Campaign in one story','A finished marketing results deck')],
development:[
P('website','Fieldnotes','A responsive publishing interface','gallery','cream'),P('chat','Ask the knowledge base','A cited-answer assistant interface'),P('portal','Book a session','A self-service booking application'),P('game','Explore the archipelago','An interactive environment concept','islands','dark'),P('dashboard','Project cockpit','A complete project analytics interface'),P('product','Configure your object','A product customization concept','product','cream'),P('kanban','Work, together','A collaborative planning application'),P('map','Find your next place','A location discovery interface'),P('website','Studio directory','A searchable creative directory','sculpture','dark'),P('calendar','Time well spent','A scheduling service'),P('portal','The customer portal','A unified account and request interface'),P('film','Interactive motion','A browser-based visual experience','sculpture','dark'),P('chat','A helpful service desk','A support assistant with evidence'),P('dashboard','A financial companion','A personal finance application'),P('website','The learning room','A course discovery interface','gallery','cream'),P('game','Pathfinder','A playful interactive world','islands','dark'),P('portal','Document centre','A searchable document workflow'),P('kanban','Plan the launch','A release planning application'),P('product','The object viewer','A 3D product experience','product','dark'),P('map','Community connections','A local discovery application'),P('calendar','Events made simple','An event scheduling tool'),P('dashboard','Live operations','A finished operations interface'),P('chat','Research companion','A source-aware research assistant'),P('website','Made to be used','A responsive service landing page','gallery','cream')]
};
export const categoryScenes={
 workflow:[members[3].scenes[0],members[3].scenes[1],members[3].scenes[2],members[3].scenes[3],members[3].scenes[4],members[8].scenes[4],members[10].scenes[5],members[3].scenes[5],members[3].scenes[7],members[8].scenes[9],members[3].scenes[10],members[8].scenes[11]],
 strategy:[members[1].scenes[0],members[1].scenes[2],members[8].scenes[0],members[4].scenes[1],members[1].scenes[3],members[8].scenes[1],members[8].scenes[2],members[4].scenes[7],members[4].scenes[8],members[8].scenes[8],members[1].scenes[10],members[8].scenes[11]],
 design:[members[2].scenes[0],members[2].scenes[1],members[2].scenes[2],members[2].scenes[3],members[2].scenes[4],members[2].scenes[5],members[4].scenes[4],members[4].scenes[5],members[2].scenes[6],members[2].scenes[7],members[2].scenes[8],members[2].scenes[9]],
 analytics:[members[9].scenes[0],members[5].scenes[0],members[5].scenes[1],members[5].scenes[2],members[5].scenes[3],members[9].scenes[3],members[9].scenes[4],members[9].scenes[6],members[7].scenes[0],members[7].scenes[2],members[7].scenes[4],members[9].scenes[10]],
 marketing:[members[6].scenes[0],members[6].scenes[1],members[6].scenes[2],members[6].scenes[3],members[6].scenes[4],members[6].scenes[5],members[6].scenes[6],members[6].scenes[7],members[6].scenes[8],members[6].scenes[9],members[6].scenes[10],members[6].scenes[11]],
 development:[members[0].scenes[0],members[1].scenes[5],members[3].scenes[5],members[1].scenes[6],members[10].scenes[1],members[10].scenes[3],members[10].scenes[4],members[10].scenes[6],members[2].scenes[6],members[2].scenes[7],members[2].scenes[8],members[0].scenes[11]]
};
// Additional original AI key art gives the finished montage distinct subjects.
for(const [field,index,asset] of [['design',3,'forest'],['design',4,'world'],['design',8,'headphones'],['design',10,'forest'],['design',14,'world'],['design',15,'headphones'],['design',20,'forest'],['design',22,'world'],['marketing',5,'headphones'],['marketing',6,'forest'],['marketing',15,'forest'],['marketing',21,'headphones'],['marketing',22,'world'],['development',3,'world'],['development',5,'headphones'],['development',14,'forest'],['development',23,'forest']])projects[field][index].asset=asset;
for(const m of members)for(const s of m.scenes){if(s.type==='unreal')s.asset='world';if(s.type==='higgsfield')s.asset='headphones'}
for(const [field,index,asset] of [['design',9,'portal'],['design',12,'desert'],['design',14,'coastal'],['design',15,'watch'],['design',17,'portal'],['design',22,'islands'],['design',23,'portal'],['marketing',10,'watch'],['marketing',14,'portal'],['marketing',21,'headphones'],['development',15,'coastal'],['development',18,'watch']])projects[field][index].asset=asset;
members[2].scenes[7].asset='portal';members[4].scenes[4].asset='headphones';members[4].scenes[6].asset='desert';
// Distinct opening images make the instructor cards distinguishable at a glance.
for(const [memberIndex,sceneIndex] of [[1,1],[9,4],[10,1]]){const a=members[memberIndex].scenes;[a[0],a[sceneIndex]]=[a[sceneIndex],a[0]]}
export const references=[
 {tool:'After Effects',url:'https://helpx.adobe.com/after-effects/desktop/get-started/get-familiar-with-the-interface/workspaces-panels-viewers.html'},
 {tool:'Cinema 4D',url:'https://support.maxon.net/hc/en-us/articles/4406397183634-New-Layouts-Cinema-4D-R25-and-newer-Hot-Corners-Managers-and-New-Icon-Placement'},
 {tool:'Unreal Engine',url:'https://dev.epicgames.com/documentation/unreal-engine/tools-and-editors-in-unreal-engine?lang=en-US'},
 {tool:'Unity',url:'https://docs.unity3d.com/es/current/Manual/UsingTheInspector.html'}
];
