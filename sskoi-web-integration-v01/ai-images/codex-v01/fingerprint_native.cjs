// Read image metadata and hash bytes. This script never writes or transforms an image.
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const sharp=require(path.resolve(__dirname,'../../../shopify-preview-20261112/node_modules/sharp'));
const args=process.argv.slice(2);
const opts={};
for(let i=0;i<args.length;i+=2){if(!args[i]?.startsWith('--')||!args[i+1])throw new Error('Use --input path --slot H1 --candidate a --model actual-reported-name [--out receipt.json]');opts[args[i].slice(2)]=args[i+1];}
for(const k of ['input','slot','candidate','model'])if(!opts[k])throw new Error('Missing --'+k);
if(!['a','b','c'].includes(opts.candidate))throw new Error('Candidate must be a, b, or c');
const plan=JSON.parse(fs.readFileSync(path.join(__dirname,'generation-plan.json'),'utf8'));
const slot=plan.slots.find(s=>s.slotId===opts.slot);
if(!slot)throw new Error('Unknown slot '+opts.slot);
const job=plan.jobs.find(j=>j.slotId===opts.slot&&j.candidate===opts.candidate);
const input=path.resolve(opts.input);
const data=fs.readFileSync(input);
const sha=crypto.createHash('sha256').update(data).digest('hex');
(async()=>{
 const meta=await sharp(data,{failOn:'error'}).metadata();
 const min=slot.minimumDimensions;
 const minimumMet=meta.width>=min.width&&(!min.height||meta.height>=min.height);
 const [rw,rh]=slot.requestedAspectRatio.split(':').map(Number);
 const ratioError=Math.abs(meta.width/meta.height-rw/rh)/(rw/rh);
 const knownIssues=[];
 if(!minimumMet)knownIssues.push('Actual native file is below the requested minimum; retain original unchanged.');
 if(ratioError>0.01)knownIssues.push('Actual native aspect differs from requested ratio; do not resize or crop to conceal this.');
 const result={slotId:opts.slot,candidate:opts.candidate,batch:slot.batch,status:'REVIEW',inputPath:input,filename:path.basename(input),suggestedFilename:job.filenameTemplate.replace('<actualWidth>',meta.width).replace('<actualHeight>',meta.height).replace('<nativeExt>',meta.format==='jpeg'?'jpg':meta.format),width:meta.width,height:meta.height,format:meta.format,bytes:data.length,sha256:sha,requestedAspectRatio:slot.requestedAspectRatio,actualAspectRatio:meta.width+'/'+meta.height,minimumDimensions:min,minimumMet,referenceUrls:job.referenceUrls,referenceLocalHashes:job.referenceHashes,fullPrompt:job.fullPrompt,modelName:opts.model,nativeOriginVerifiedByThisHelper:false,nativeOriginNote:'The generator provenance must establish native output and maximum setting; dimensions/hash alone cannot prove absence of upstream transforms.',thisHelper:{imageBytesWritten:0,performedTransforms:[]},requiresRevision:null,knownIssues,visualQAStatus:'NOT_REVIEWED',recommendedWithinSlot:false,recommendationReason:null,nextOwner:'Claude — visual QA'};
 const final=crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex');
 if(final!==sha)throw new Error('Input changed during metadata/hash inspection');
 if(opts.out){const out=path.resolve(opts.out);if(out===input)throw new Error('Receipt cannot replace input image');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');}
 console.log(JSON.stringify(result,null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
