"""Preview by default. Explicit --apply merges local final manifests after all 36 exist.

Never generates/transforms images, invokes Git, contacts Drive, or writes a theme.
"""
from pathlib import Path
import argparse,copy,hashlib,json,os,struct,sys

BASE=Path(__file__).resolve().parent
WORKSPACE=BASE.parents[2]
REPO_PREFIX=Path('sskoi-web-integration-v01/ai-images/codex-v01')
EXPECTED_FROZEN='37bb982c1b032fc1508305849a160f7e37e01fc2f254cf9dafad42df97d68733'
BRANCH='codex/sskoi-web-scenes-v01-20261118'
def sha(b):return hashlib.sha256(b).hexdigest()
def load(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def jsbytes(v):return (json.dumps(v,ensure_ascii=False,indent=2)+'\n').encode('utf-8')
def need(ok,msg):
    if not ok:raise ValueError(msg)
def unique(xs):return list(dict.fromkeys(xs))
def key(r):return f"{r['slotId']}-{r['candidate']}"
def relative(p):return str(Path(p).resolve().relative_to(WORKSPACE)).replace('\\','/')
def portable_record(r):
    return {'native':relative(r['localPath']),'capturedActualJob':relative(r['capturedActualJobPath'])}

def assemble(receipt_dir,branch):
    frozen=BASE/'generation-plan.frozen.json';frozen_bytes=frozen.read_bytes()
    need(sha(frozen_bytes)==EXPECTED_FROZEN,'Frozen plan SHA changed; preserve actual jobs and stop.')
    need((BASE/'generation-plan.json').read_bytes()==frozen_bytes,'Mutable plan differs from frozen plan.')
    plan=json.loads(frozen_bytes);expected=[(j['slotId'],j['candidate']) for j in plan['jobs']]
    root_path=BASE/'delivery.json';original=root_path.read_bytes();delivery=json.loads(original)
    records=delivery.get('records',[])
    need(len(records)==36,'Finalization requires exactly 36 ingested candidates; found '+str(len(records)))
    need(len({key(r) for r in records})==36,'Duplicate delivery candidate keys.')
    need({(r['slotId'],r['candidate']) for r in records}==set(expected),'Delivery keys do not match the 36 frozen jobs.')
    need(all(r.get('status')=='REVIEW' for r in records),'All candidates must remain REVIEW.')
    records=sorted(records,key=lambda r:expected.index((r['slotId'],r['candidate'])))
    merged=copy.deepcopy(records);recommendations={};qa_sources={};snapshots={root_path:original,frozen:frozen_bytes}
    refpath=BASE/'_references/reference-provenance.json';refbytes=refpath.read_bytes();snapshots[refpath]=refbytes
    reference_manifest=json.loads(refbytes)
    for s in plan['slots']:
        slot=s['slotId'];qpath=BASE/'qa'/f'{slot}.json'
        need(qpath.exists(),'Missing independent slot QA: '+str(qpath))
        qbytes=qpath.read_bytes();snapshots[qpath]=qbytes;q=json.loads(qbytes);qr=q.get('records',[])
        need(q.get('slotId')==slot and len(qr)==3,'QA must contain exact slot and three candidates: '+slot)
        need({x.get('candidate') for x in qr}=={'a','b','c'},'QA candidates must be a,b,c: '+slot)
        preferred=q.get('preferredCandidate')
        if preferred is None:
            marked=[x['candidate'] for x in qr if x.get('recommendedWithinSlot') is True]
            need(len(marked)==1,'QA must name exactly one preferred candidate: '+slot);preferred=marked[0]
        need(preferred in ['a','b','c'],'Invalid preferred candidate: '+slot)
        qa_sources[slot]={'path':relative(qpath),'sha256':sha(qbytes),'reviewer':q.get('reviewer'),'scope':q.get('scope'),'summary':q.get('summary')}
        recommendation_reason=q.get('preferredReason') or next(x.get('recommendationReason') for x in qr if x['candidate']==preferred) or q.get('summary')
        need(bool(recommendation_reason),'Missing recommendation explanation: '+slot)
        recommendations[slot]={'candidate':preferred,'reason':recommendation_reason,'requiresRevision':next(x.get('requiresRevision') for x in qr if x['candidate']==preferred),'qa':qa_sources[slot]}
        slot_path=BASE/slot/'delivery.json';snapshots[slot_path]=slot_path.read_bytes()
        previous_slot=json.loads(snapshots[slot_path])
        for r in [x for x in merged if x['slotId']==slot]:
            need(r.get('status')=='REVIEW','Unexpected candidate status; do not silently relabel: '+key(r))
            old=next((x for x in previous_slot.get('records',[]) if x['candidate']==r['candidate']),None)
            need(old is not None and old['sha256']==r['sha256'] and old['actualPromptSHA256']==r['actualPromptSHA256'],'Root/per-slot immutable fields differ: '+key(r))
            p=Path(r['localPath']);b=p.read_bytes()
            need(p.resolve().parent==(BASE/slot).resolve() and p.name==r['filename'],'Native path must stay in its exact slot directory: '+key(r))
            need(sha(b)==r['sha256'] and len(b)==r['bytes'],'Native image bytes/hash changed: '+key(r))
            need(r.get('rawToolOutputSHA256')==r['sha256'] and r.get('originalBytesCopiedUnchanged') is True and r.get('imageProcessingOperations')==[],'Native-copy provenance is inconsistent: '+key(r))
            raw=Path(r['rawToolOutputPath'])
            if raw.exists():need(sha(raw.read_bytes())==r['sha256'],'Raw tool output differs from retained native: '+key(r))
            need(b[:8]==b'\x89PNG\r\n\x1a\n' and p.suffix.lower()=='.png' and r['format']=='png','Expected native PNG: '+key(r))
            w,h=struct.unpack('>II',b[16:24]);need((w,h)==(r['width'],r['height']),'PNG header dimensions differ: '+key(r))
            need(sha(r['fullPrompt'].encode('utf-8'))==r['actualPromptSHA256'],'Actual prompt hash differs: '+key(r))
            actual=Path(r['capturedActualJobPath']);ab=actual.read_bytes()
            need(actual.resolve()==(BASE/'_actual_jobs'/(key(r)+'_'+r['capturedActualJobSHA256']+'.json')).resolve(),'Captured actual request path must stay in its exact immutable slot: '+key(r))
            need(sha(ab)==r['capturedActualJobSHA256'],'Captured request hash differs: '+key(r))
            wrapper=json.loads(ab);job=wrapper.get('job',wrapper)
            actual_prompt=job.get('fullPrompt',job.get('prompt',job.get('toolArguments',{}).get('prompt')))
            need(actual_prompt==r['fullPrompt'],'Captured request prompt differs from delivery: '+key(r))
            for ref in r.get('references',[]):
                if ref.get('localPath') and ref.get('sha256'):need(sha(Path(ref['localPath']).read_bytes())==ref['sha256'],'Reference bytes changed: '+str(ref['localPath']))
            qrow=next(x for x in qr if x['candidate']==r['candidate'])
            need(qrow.get('sha256')==r['sha256'],'QA refers to different image bytes: '+key(r))
            need(qrow.get('status')=='REVIEW' and isinstance(qrow.get('requiresRevision'),bool),'QA must preserve REVIEW and explicit requiresRevision: '+key(r))
            receipt_path=receipt_dir/(key(r)+'.json');need(receipt_path.exists(),'Missing Drive receipt: '+key(r));receipt_bytes=receipt_path.read_bytes();snapshots[receipt_path]=receipt_bytes;dr=json.loads(receipt_bytes)
            need(dr.get('slotId')==slot and dr.get('candidate')==r['candidate'],'Drive receipt key differs: '+key(r))
            need(dr.get('sha256')==r['sha256'] and int(dr.get('bytes',-1))==r['bytes'],'Drive receipt bytes/hash differs: '+key(r))
            need(dr.get('actualPromptSHA256')==r['actualPromptSHA256'] and dr.get('capturedActualJobSHA256')==r['capturedActualJobSHA256'],'Drive receipt actual-request fingerprint differs: '+key(r))
            cr=dr.get('contentReadback',{});meta=dr.get('currentMetadata',{})
            need(dr.get('metadataVerified') is True and dr.get('contentVerified') is True and cr.get('exactBytesMatch') is True,'Drive metadata/content not verified: '+key(r))
            need(cr.get('sha256')==r['sha256'] and int(cr.get('bytes',-1))==r['bytes'],'Drive readback differs from native: '+key(r))
            fid=dr.get('fileId');parent=dr.get('parentId');parents=meta.get('parent_ids',[])
            need(fid and meta.get('id')==fid and meta.get('title')==r['filename'] and int(meta.get('size',-1))==r['bytes'],'Drive current metadata differs: '+key(r))
            need(parent in parents,'Drive current parent mismatch: '+key(r))
            permissions=meta.get('permissions',[]);emails={str(x.get('emailAddress','')).lower():x.get('role') for x in permissions if x.get('type')=='user'}
            need(not any(x.get('type')=='anyone' for x in permissions),'Public sharing found in receipt: '+key(r))
            need(emails.get('rachel.lqin@gmail.com')=='commenter' and emails.get('ql76.88@gmail.com')=='commenter','Rachel commenter access not verified: '+key(r))
            compact={k:meta.get(k) for k in ['id','title','mime_type','size','url','parent_ids','modified_time']}
            r.update({'status':'REVIEW','requiresRevision':qrow['requiresRevision'],'knownIssues':unique(r.get('knownIssues',[])+qrow.get('knownIssues',[])),'visualQAStatus':'REVIEWED','recommendedWithinSlot':r['candidate']==preferred,'recommendationReason':qrow.get('recommendationReason') or (recommendation_reason if r['candidate']==preferred else None),'qa':{'source':qa_sources[slot],'observations':qrow},'driveFileId':fid,'driveUrl':dr.get('driveUrl') or meta.get('url'),'driveParents':parents,'driveMetadata':compact,'driveVerification':{'metadataVerified':True,'contentVerified':True,'readbackSHA256':cr['sha256'],'readbackBytes':cr['bytes'],'restrictedSharingVerified':True,'rachelCommenterAccessVerified':True,'receiptSHA256':sha(receipt_bytes)},'portablePaths':portable_record(r),'branch':branch,'commit':r.get('commit'),'nextOwner':'Claude — visual QA'})
    # Preserve every existing immutable and unfamiliar field; only append QA/Drive metadata.
    immutable=['slotId','candidate','batch','filename','localPath','width','height','format','bytes','sha256','fullPrompt','actualPromptSHA256','actualPromptMatchesFrozenPlan','capturedActualJobPath','capturedActualJobSHA256','references','modelName','rawToolOutputPath','rawToolOutputSHA256','originalBytesCopiedUnchanged','imageProcessingOperations']
    for old,new in zip(records,merged):
        for field in immutable:need(old.get(field)==new.get(field),'Immutable field changed: '+key(old)+' '+field)
    delivery=copy.deepcopy(delivery);delivery.update({'status':'REVIEW','records':merged,'completedCount':36,'generationPlanSHA256':EXPECTED_FROZEN,'recommendations':recommendations,'finalization':{'version':'Codex-v01-final-review','date':'2026-11-18','qaSlots':12,'driveByteVerified':36,'allNativePNGBytesPreserved':True,'branch':branch,'sourceHeadCommit':'94ce80d22474be84c37b1eed87eb2941d463e089','approvalClaimed':False,'websiteIntegrated':False,'published':False,'nextOwner':'Claude — visual QA'}})
    writes={root_path:jsbytes(delivery)}
    for s in plan['slots']:
        sid=s['slotId'];p=BASE/sid/'delivery.json';v=load(p);v.update({'status':'REVIEW','records':[r for r in merged if r['slotId']==sid],'recommendation':recommendations[sid],'finalization':delivery['finalization']});writes[p]=jsbytes(v)
    return plan,delivery,writes,snapshots,reference_manifest

def readme(plan,d):
    records=d['records'];below=[r for r in records if not r['minimumMet']];hard=[key(r) for r in records if r['requiresRevision']]
    dims={}
    for r in records:dims[f"{r['width']}×{r['height']}"]=dims.get(f"{r['width']}×{r['height']}",0)+1
    lines=['# SSKOI Codex v01：36张网站场景候选 · REVIEW','', '四批按原顺序完成，共12槽×3候选。36张PNG均保留原生工具输出字节，Drive已逐个回读核对哈希。全部仍为REVIEW，没有James/Rachel批准，不接入主题、不发布。下一负责人：Claude质检。','',f"原生尺寸：{'; '.join(f'{k}（{v}张）' for k,v in dims.items())}。其中{len(below)}张低于提示文件的最小尺寸；按授权原样交付，不放大、锐化、裁切或重采样，也不因原生尺寸下限重跑。",'', '实际工具名为各条delivery中的modelName；底层图像模型未向工具公开，不虚构型号。每条实际prompt、参考图与哈希、捕获请求、原生尺寸和Drive文件链接均在根及分槽delivery.json。冻结计划不用于事后替换实际请求。','', '| 槽位 | 建议候选 | 原因 | 需修订 |','|---|---|---|---|']
    for s in plan['slots']:
        sid=s['slotId'];r=d['recommendations'][sid];reason=str(r['reason']).replace('|','／').replace('\n',' ')
        lines.append(f"| {sid} | {r['candidate']} | {reason} | {'是' if r['requiresRevision'] else '否'} |")
    lines+=['','建议仅用于选片，不代表批准。硬缺陷候选：'+('、'.join(hard) if hard else '独立QA未记录需强制重做的硬缺陷')+'。各图仍可能有遮挡导致的枝数不可实测、名义厘米不能从像素认证、精确色差未做标准色卡校准等限制；逐图knownIssues为准。','', '## 范围与优先级','', '- 最新用户要求覆盖旧手册的NEEDS-FIX状态：所有文件REVIEW；硬问题只写requiresRevision／knownIssues，保留原件。','- Prompt-Codex-v01的四批次优先于手册宽泛待办。跳过手部插花、拆包、弯枝演示、Gemini商品编辑等；L3/L4/L6/L7复用为Journal封面，不另生成。','- A+B+C+D保留原顺序；约束附在后面。Ranunculus花径未标明，不造数字；L4按指定石灰石浴室台面，L6枝条下段真实入瓶。','- 当前hero只作Prompt明确许可的构图／亚麻色参考；其他风格参考只控制光线、色板、材质，不控制商品几何。','- Austin指定creative-detail比set/stem更展开、黄蕊更大；真实set/stem优先。允许原照小簇自然米黄蕊，不绝对禁黄。','- 来源Drive手册与GitHub手册第7节Gemini/Claude分工有差别，当前Codex四批出图规则一致；两个版本及身份记录均保留。','', '## 来源格式与Git交付','', '部分源URL及保留文件名以.webp结尾，HTTP内容／解码元数据实际为JPEG。它们按下载原字节保留，不改扩展名冒充转换，也不转码；actualFormat在reference-provenance.json。36张新候选实际为PNG。','', 'Git仅推送自己的分支 `'+d['finalization']['branch']+'`，不创建PR、不合并。使用_finalization/staging-allowlist.txt中的逐文件白名单；禁止git add -A或整目录递归暂存。白名单不包含缩略图、诊断裁切、旧资产、原始上传响应、临时下载地址或账号凭据。','']
    lines+=['## 实际执行与冻结计划差异','', 'HW/HM最初7张参考被内置工具5参考上限拒绝，没有输出。实际请求改用三张商品＋两张hero；两张风格图已读但未附，A原样保留。冬季六张补充4枝4头≤8芽，L3-b/c补充空白书页，L6-c为4头子集。实际prompt／附件／SHA以捕获请求为准，允许actualPromptMatchesFrozenPlan=false，冻结计划不回写。','', 'Git采用单一资产提交A。delivery内本提交SHA保持null；root在push后的外部Git回执／交接记录给出真实A，不用第二个提交回填自引用。白名单JSON对自身的sha256为null，其余项目逐个哈希；复制JSON自身时核对当时实际字节。','']
    return '\n'.join(lines).encode('utf-8')

def staging(plan,d,refman,writes):
    entries={}
    source_brand={(BASE.parents[1]/'brand'/name).resolve() for name in ['PROMPT-Codex-v01.md','SSKOI-visual-handbook-v01.md']}
    frozen_refs={Path(r['localPath']).resolve():r['sha256'] for s in plan['slots'] for r in s['references'] if r.get('localPath') and r.get('sha256')}
    def add(p,category):
        p=Path(p).resolve()
        need(p.is_relative_to(BASE) or p in source_brand,'Staging source is outside this task and its two explicit brand instructions: '+str(p))
        parts=[x.lower() for x in p.relative_to(BASE).parts] if p.is_relative_to(BASE) else []
        need(not any(x in ['diagnostics','backups','readback','thumbnails','thumbs','__pycache__','.git'] for x in parts),'Excluded diagnostic/cache path cannot enter Git allowlist: '+str(p))
        need(p.suffix.lower() not in ['.env','.pem','.key','.pfx','.p12'] and not p.name.lower().startswith('.env'),'Secret-like source cannot enter Git allowlist: '+str(p))
        if category=='byte-preserved-reference':need(p in frozen_refs and sha(p.read_bytes())==frozen_refs[p],'Reference is not an exact frozen referenced source: '+str(p))
        rp=relative(p);b=writes.get(p)
        if b is None:need(p.exists(),'Missing allowlisted source: '+str(p));b=p.read_bytes()
        entries[rp]={'repositoryPath':rp,'sourcePath':str(p),'category':category,'bytes':len(b),'sha256':sha(b)}
    for r in d['records']:
        add(r['localPath'],'native-candidate-png');add(r['capturedActualJobPath'],'immutable-captured-actual-request')
        request=BASE/r['slotId']/(key(r)+'.actual-request.json')
        need(request.exists() and sha(request.read_bytes())==r['capturedActualJobSHA256'],'Original captured request differs: '+key(r));add(request,'original-captured-actual-request')
    add(BASE/'delivery.json','root-delivery')
    for s in plan['slots']:
        add(BASE/s['slotId']/'delivery.json','slot-delivery');add(BASE/'qa'/f"{s['slotId']}.json",'independent-slot-qa')
    for f in ['generation-plan.frozen.json','generation-plan-freeze.json','slot-matrix.csv','EXECUTION_AUDIT_zh.md','INGEST_README_zh.md','FINALIZATION_README_zh.md','README_REVIEW_zh.md','fingerprint_native.cjs','ingest_native.cjs','finalize_delivery.py','prepare_git_staging.py']:
        add(BASE/f,'necessary-plan-or-workflow-source')
    for f in ['PROMPT-Codex-v01.md','SSKOI-visual-handbook-v01.md']:add(BASE.parents[1]/'brand'/f,'authoritative-instruction-source')
    add(BASE/'_references/reference-provenance.json','reference-provenance')
    for r in refman['records']:add(r['localPath'],'byte-preserved-reference')
    for f in ['document-identity.json','PROMPT-Codex-v01.GitHub.md','SSKOI-visual-handbook-v01.GitHub.md','SSKOI-visual-handbook-v01.Drive-copy.md']:
        add(BASE/'_references/_provenance'/f,'instruction-version-provenance')
    txt=BASE/'_finalization/staging-allowlist.txt';manifest=BASE/'_finalization/staging-allowlist.json'
    allpaths=sorted(list(entries)+[relative(txt),relative(manifest)])
    content=('\n'.join(allpaths)+'\n').encode('utf-8');writes[txt]=content;add(txt,'explicit-git-pathspec')
    entries[relative(manifest)]={'repositoryPath':relative(manifest),'sourcePath':str(manifest),'category':'allowlist-self','sha256':None,'note':'Manifest does not attempt to hash itself.'}
    value={'status':'REVIEW','branch':d['finalization']['branch'],'sourceHeadCommit':'94ce80d22474be84c37b1eed87eb2941d463e089','noGitCommandsExecuted':True,'noPRRequested':True,'counts':{'nativePNGs':36,'slotDeliveryJSON':12,'rootDeliveryJSON':1,'slotQAJSON':12},'excluded':['thumbnails','diagnostic-crops','contactsheets','old assets','raw upload responses','temporary download URLs','secrets','unrelated registries','cancelled Red6','paused videos'],'files':[entries[p] for p in sorted(entries)]}
    writes[manifest]=jsbytes(value)
    return value

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--apply',action='store_true');ap.add_argument('--receipts',type=Path,default=WORKSPACE/'output/codex-web-scenes-v01-20261118/drive-receipts');ap.add_argument('--branch',default=BRANCH);args=ap.parse_args()
    lock=BASE/'.final-merge.lock';locked=False
    try:
        need(args.branch==BRANCH,'Use only the user-authorized own branch '+BRANCH)
        if args.apply:
            fd=os.open(lock,os.O_CREAT|os.O_EXCL|os.O_WRONLY);os.write(fd,str(os.getpid()).encode());os.close(fd);locked=True
        plan,d,writes,snapshots,refman=assemble(args.receipts,args.branch)
        readme_path=BASE/'README_REVIEW_zh.md';writes[readme_path]=readme(plan,d)
        allow=staging(plan,d,refman,writes)
        report={'mode':'APPLY' if args.apply else 'PREVIEW','status':'READY','candidates':36,'qaSlots':12,'driveVerified':36,'requiresRevision':[key(r) for r in d['records'] if r['requiresRevision']],'recommendations':{k:v['candidate'] for k,v in d['recommendations'].items()},'nativeBelowMinimum':sum(not r['minimumMet'] for r in d['records']),'allowlistedFiles':len(allow['files']),'wouldWrite':[relative(p) for p in writes],'noImagesModified':True,'noGitDriveOrThemeOperation':True}
        if args.apply:
            for p,b in snapshots.items():need(p.read_bytes()==b,'Concurrent ingest/source update detected; stop before final merge: '+str(p))
            backup=BASE/'_finalization/backups'/sha(snapshots[BASE/'delivery.json'])[:16]
            for p,b in snapshots.items():
                if p.name!='delivery.json':continue
                dst=backup/p.relative_to(BASE);dst.parent.mkdir(parents=True,exist_ok=True)
                if not dst.exists():dst.write_bytes(b)
            for p,b in writes.items():
                p.parent.mkdir(parents=True,exist_ok=True);tmp=p.with_name(p.name+'.finalizing.tmp');tmp.write_bytes(b);os.replace(tmp,p)
            report['result']='Merged QA/Drive into 13 delivery JSONs and wrote final README/allowlist. Images/prompts/frozen plan unchanged.'
            (BASE/'_finalization/finalization-receipt.json').write_bytes(jsbytes(report))
        print(json.dumps(report,ensure_ascii=False,indent=2));return 0
    except Exception as e:
        print(json.dumps({'mode':'APPLY' if args.apply else 'PREVIEW','status':'BLOCKED','reason':str(e),'noApplyRequested':not args.apply},ensure_ascii=False,indent=2));return 2
    finally:
        if locked:lock.unlink(missing_ok=True)
if __name__=='__main__':sys.exit(main())
