// Preserve raw tool-output bytes and captured actual prompts. No image transformation occurs.
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const sharp=require(path.resolve(__dirname,'../../../shopify-preview-20261112/node_modules/sharp'));
const base=__dirname;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const readJSON=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const opts={};
for(let i=2;i<process.argv.length;i+=2){if(!process.argv[i]?.startsWith('--')||!process.argv[i+1])throw new Error('Use --input raw-tool-image --slot H1 --candidate a --actual-job-json captured-job.json [--model actual-tool-name]');opts[process.argv[i].slice(2)]=process.argv[i+1];}
for(const k of ['input','slot','candidate','actual-job-json'])if(!opts[k])throw new Error('Missing --'+k);
if(!['a','b','c'].includes(opts.candidate))throw new Error('Candidate must be a, b, or c');
const planPath=path.join(base,'generation-plan.frozen.json');
if(!fs.existsSync(planPath))throw new Error('Frozen plan is required. Do not infer an actual prompt from a mutable plan.');
const planBytes=fs.readFileSync(planPath),plan=JSON.parse(planBytes);
const slot=plan.slots.find(x=>x.slotId===opts.slot);
const plannedJob=plan.jobs.find(x=>x.slotId===opts.slot&&x.candidate===opts.candidate);
if(!slot||!plannedJob)throw new Error('Unknown slot/candidate');
const actualPath=path.resolve(opts['actual-job-json']);
const actualBytes=fs.readFileSync(actualPath),captured=JSON.parse(actualBytes.toString('utf8').replace(/^\uFEFF/,''));
const actual=captured.job??captured;
const fullPrompt=actual.fullPrompt??actual.prompt??actual.toolArguments?.prompt;
if(typeof fullPrompt!=='string'||!fullPrompt.trim())throw new Error('Captured actual job must contain fullPrompt, prompt or toolArguments.prompt.');
if(actual.slotId&&actual.slotId!==opts.slot)throw new Error('Captured slotId does not match requested slot.');
if(actual.candidate&&actual.candidate!==opts.candidate)throw new Error('Captured candidate does not match requested candidate.');
const modelName=opts.model??captured.modelName??actual.modelName??actual.model??'imagegen (underlying model not exposed)';
const input=path.resolve(opts.input),bytes=fs.readFileSync(input),imageSHA=hash(bytes);
const promptSHA=hash(Buffer.from(fullPrompt,'utf8')),actualSHA=hash(actualBytes);
const relativeWithin=(root,p)=>{const r=path.relative(root,p);return r!==''&&!r.startsWith('..')&&!path.isAbsolute(r);};
const candidateKey=opts.slot+'-'+opts.candidate;
const deliveryPath=path.join(base,'delivery.json');
const initial={version:'Codex-v01',date:'2026-11-18',status:'REVIEW',totalPlanned:36,generationPlanSHA256:hash(planBytes),sourceRepository:plan.source,records:[]};
const delivery=fs.existsSync(deliveryPath)?readJSON(deliveryPath):initial;
if(!Array.isArray(delivery.records))throw new Error('Existing delivery.json has an unfamiliar schema; preserve it and stop.');
const prior=delivery.records.find(x=>x.slotId===opts.slot&&x.candidate===opts.candidate);
if(prior&&(prior.sha256!==imageSHA||prior.actualPromptSHA256!==promptSHA||prior.capturedActualJobSHA256!==actualSHA))throw new Error('Candidate already recorded with different immutable bytes/prompt. Do not overwrite history.');

(async()=>{
 const m=await sharp(bytes,{failOn:'error'}).metadata();
 if(!m.width||!m.height||!m.format)throw new Error('Actual native dimensions/format unavailable.');
 const ext=m.format==='jpeg'?'jpg':m.format;
 const filename=plannedJob.filenameTemplate.replace('<actualWidth>',m.width).replace('<actualHeight>',m.height).replace('<nativeExt>',ext);
 const dir=path.join(base,opts.slot),dest=path.join(dir,filename);
 if(!relativeWithin(base,dest))throw new Error('Output path escapes the task directory.');
 fs.mkdirSync(dir,{recursive:true});
 let copied=false;
 if(fs.existsSync(dest)){if(hash(fs.readFileSync(dest))!==imageSHA)throw new Error('Destination exists with different bytes; nothing overwritten.');}
 else{fs.copyFileSync(input,dest,fs.constants.COPYFILE_EXCL);copied=true;}
 if(hash(fs.readFileSync(dest))!==imageSHA)throw new Error('Byte-preserving copy failed verification.');
 if(hash(fs.readFileSync(input))!==imageSHA)throw new Error('Raw tool output changed during ingest.');
 const actualDir=path.join(base,'_actual_jobs');fs.mkdirSync(actualDir,{recursive:true});
 const capturedCopy=path.join(actualDir,candidateKey+'_'+actualSHA+'.json');
 if(fs.existsSync(capturedCopy)){if(hash(fs.readFileSync(capturedCopy))!==actualSHA)throw new Error('Captured actual-job copy conflicts.');}
 else fs.copyFileSync(actualPath,capturedCopy,fs.constants.COPYFILE_EXCL);
 const actualLocalPaths=actual.referenced_image_paths??actual.toolArguments?.referenced_image_paths??actual.referenceLocalPaths??actual.referencePaths??null;
 const actualUrls=actual.referenceUrls??actual.references?.filter(x=>x.url).map(x=>x.url)??null;
 let references=[];
 if(actualLocalPaths){
  references=actualLocalPaths.map(p=>{if(!p)throw new Error('Captured reference path is empty.');const localPath=path.resolve(p),b=fs.readFileSync(localPath);const mapped=slot.references.find(x=>path.resolve(x.localPath??'').toLowerCase()===localPath.toLowerCase());return {url:mapped?.url??null,role:mapped?.role??'actual captured reference',localPath,bytes:b.length,sha256:hash(b),actualCaptured:true};});
 }else if(actualUrls){
  references=actualUrls.map(url=>{const mapped=slot.references.find(x=>x.url===url);return {url,role:mapped?.role??'actual captured reference',localPath:mapped?.localPath??null,sha256:mapped?.sha256??null,actualCaptured:true};});
 }
 const minimumMet=m.width>=slot.minimumDimensions.width&&(!slot.minimumDimensions.height||m.height>=slot.minimumDimensions.height);
 const [rw,rh]=slot.requestedAspectRatio.split(':').map(Number);
 const aspectMet=Math.abs(m.width/m.height-rw/rh)/(rw/rh)<=0.01;
 const knownIssues=[];
 if(!minimumMet)knownIssues.push('Native output is below requested minimum. Allowed unchanged delivery; no resize, upscale or regeneration to fabricate compliance.');
 if(!aspectMet)knownIssues.push('Actual native aspect differs from requested ratio; retained unchanged.');
 if(!references.length)knownIssues.push('Actual attached reference list was not captured in job JSON; do not substitute planned attachments as fact.');
 const record=prior??{slotId:opts.slot,candidate:opts.candidate,batch:slot.batch,status:'REVIEW',filename,localPath:dest,width:m.width,height:m.height,format:m.format,bytes:bytes.length,sha256:imageSHA,requestedAspectRatio:slot.requestedAspectRatio,actualAspectRatio:m.width+':'+m.height,minimumDimensions:slot.minimumDimensions,minimumMet,aspectMet,rawToolOutputPath:input,rawToolOutputSHA256:imageSHA,originalBytesCopiedUnchanged:true,imageProcessingOperations:[],fullPrompt,actualPromptSHA256:promptSHA,actualPromptMatchesFrozenPlan:fullPrompt===plannedJob.fullPrompt,actualPromptSource:'Captured immutable actual-job JSON; never inferred from later plan',capturedActualJobPath:capturedCopy,capturedActualJobSHA256:actualSHA,references,modelName,modelDisclosure:'Record the actual exposed tool/model name; underlying image model is not exposed unless the tool explicitly reports it.',requiresRevision:null,knownIssues,visualQAStatus:'PENDING',recommendedWithinSlot:null,recommendationReason:null,driveFileId:null,driveUrl:null,driveParents:[],branch:null,commit:null,nextOwner:'Claude — visual QA'};
 if(!prior)delivery.records.push(record);
 delivery.records.sort((a,b)=>plan.jobs.findIndex(j=>j.slotId===a.slotId&&j.candidate===a.candidate)-plan.jobs.findIndex(j=>j.slotId===b.slotId&&j.candidate===b.candidate));
 delivery.completedCount=delivery.records.length;
 delivery.status='REVIEW';
 fs.writeFileSync(deliveryPath,JSON.stringify(delivery,null,2)+'\n');
 const slotDelivery={version:delivery.version,date:delivery.date,status:'REVIEW',slotId:opts.slot,totalPlanned:3,generationPlanSHA256:hash(planBytes),records:delivery.records.filter(x=>x.slotId===opts.slot)};
 fs.writeFileSync(path.join(dir,'delivery.json'),JSON.stringify(slotDelivery,null,2)+'\n');
 console.log(JSON.stringify({candidateKey,copied,filename,width:m.width,height:m.height,sha256:imageSHA,status:'REVIEW',minimumMet,actualPromptMatchesFrozenPlan:record.actualPromptMatchesFrozenPlan,rootCompletedCount:delivery.records.length,deliveryPath,slotDeliveryPath:path.join(dir,'delivery.json')}));
})().catch(e=>{console.error(e.stack??e.message);process.exitCode=1;});
