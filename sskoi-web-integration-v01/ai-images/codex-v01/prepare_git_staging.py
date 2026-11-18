"""Explicit allowlist copy/stage support for root. Default preview runs no Git and writes nothing.

This script never commits, pushes, resets, unstages, deletes, opens a PR or publishes.
"""
from pathlib import Path,PurePosixPath
import argparse,hashlib,json,os,subprocess,sys

BASE=Path(__file__).resolve().parent
WORKSPACE=BASE.parents[2]
BRANCH='codex/sskoi-web-scenes-v01-20261118'
SOURCE_HEAD='94ce80d22474be84c37b1eed87eb2941d463e089'
PREFIX='sskoi-web-integration-v01/ai-images/codex-v01/'
BRAND={'sskoi-web-integration-v01/brand/PROMPT-Codex-v01.md','sskoi-web-integration-v01/brand/SSKOI-visual-handbook-v01.md'}
def need(ok,msg):
    if not ok:raise ValueError(msg)
def digest(b):return hashlib.sha256(b).hexdigest()
def git(checkout,*args,input_bytes=None):
    p=subprocess.run(['git','--literal-pathspecs','-C',str(checkout),*args],input=input_bytes,stdout=subprocess.PIPE,stderr=subprocess.PIPE,shell=False)
    need(p.returncode==0,'Git failed: '+p.stderr.decode('utf-8','replace').strip())
    return p.stdout
def names(b):return [x.decode('utf-8') for x in b.split(b'\0') if x]
def safe_relative(s):
    p=PurePosixPath(s)
    need(not p.is_absolute() and '..' not in p.parts and '\\' not in s and '\0' not in s and '\n' not in s and '\r' not in s,'Unsafe repository path: '+repr(s))
    need(s.startswith(PREFIX) or s in BRAND,'Path is outside explicit task scope: '+s)
    lowered=[x.lower() for x in p.parts]
    need(not any(x in ['.git','diagnostics','backups','thumbnails','thumbs','readback','__pycache__'] for x in lowered),'Excluded generated/cache path: '+s)
    need(not p.name.lower().startswith('.env') and p.suffix.lower() not in ['.pem','.key','.pfx','.p12'],'Secret-like path refused: '+s)
    return p
def index_entries(checkout):
    out={}
    for row in git(checkout,'ls-files','--stage','-z').split(b'\0'):
        if not row:continue
        header,name=row.split(b'\t',1);mode,oid,stage=header.decode('ascii').split()
        need(stage=='0','Unmerged index entry; preserve it and stop.')
        out[name.decode('utf-8')]={'mode':mode,'oid':oid}
    return out
def blob_oid(b,algorithm):return hashlib.new(algorithm,b'blob '+str(len(b)).encode('ascii')+b'\0'+b).hexdigest()

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--checkout',type=Path,required=True);ap.add_argument('--manifest',type=Path,default=BASE/'_finalization/staging-allowlist.json');ap.add_argument('--copy',action='store_true');ap.add_argument('--stage',action='store_true');args=ap.parse_args()
    try:
        checkout=args.checkout.resolve();need(checkout.is_dir() and (checkout/'.git').exists(),'Use an existing isolated Git checkout, not a new arbitrary folder.')
        need(checkout not in [WORKSPACE,BASE,BASE.parents[1]] and not checkout.is_relative_to(BASE),'Source workspace/task cannot be the isolated checkout.')
        manifest_path=args.manifest.resolve();manifest_bytes=manifest_path.read_bytes();m=json.loads(manifest_bytes)
        need(m.get('branch')==BRANCH and m.get('sourceHeadCommit')==SOURCE_HEAD,'Unexpected branch or source HEAD in allowlist.')
        rows=m.get('files',[]);need(rows and len({x['repositoryPath'] for x in rows})==len(rows),'Empty/duplicate allowlist.')
        files={}
        for r in rows:
            rp=r['repositoryPath'];rel=safe_relative(rp);src=Path(r['sourcePath']).resolve()
            need(src==(WORKSPACE/Path(*rel.parts)).resolve(),'Source path does not correspond to literal repository path: '+rp)
            need(src.is_file() and not src.is_symlink(),'Source is not a regular preserved file: '+rp)
            b=src.read_bytes();h=digest(b)
            if r.get('sha256') is None:need(r.get('category')=='allowlist-self' and src==manifest_path,'Only the actual allowlist manifest may omit its self-hash.')
            else:need(h==r['sha256'] and len(b)==r.get('bytes',len(b)),'Allowlisted source bytes changed: '+rp)
            dest=(checkout/Path(*rel.parts)).resolve();need(dest.is_relative_to(checkout),'Destination escapes isolated checkout: '+rp)
            files[rp]={'source':src,'destination':dest,'bytes':b,'sha256':h,'category':r['category']}
        need(sum(x['category']=='native-candidate-png' for x in files.values())==36,'Exactly 36 native candidates must be allowlisted.')
        need(sum(x['category']=='slot-delivery' for x in files.values())==12 and sum(x['category']=='root-delivery' for x in files.values())==1,'Expected 12 slot deliveries plus root delivery.')
        staged_before=[];algorithm=None
        if args.stage:
            top=Path(git(checkout,'rev-parse','--show-toplevel').decode('utf-8').strip()).resolve();need(top==checkout,'Checkout must be the repository root.')
            need(git(checkout,'symbolic-ref','--quiet','--short','HEAD').decode('utf-8').strip()==BRANCH,'Refuse to stage on any other branch.')
            need(git(checkout,'rev-parse','HEAD').decode('ascii').strip()==SOURCE_HEAD,'HEAD changed from source; root must review before using this first-commit staging helper.')
            algorithm=git(checkout,'rev-parse','--show-object-format').decode('ascii').strip();need(algorithm in ['sha1','sha256'],'Unsupported Git object format.')
            staged_before=names(git(checkout,'diff','--cached','--name-only','-z'))
            need(set(staged_before)<=set(files),'Unrelated staged files exist; preserve index and stop.')
            idx=index_entries(checkout)
            for p in staged_before:need(idx[p]['oid']==blob_oid(files[p]['bytes'],algorithm),'Existing staged content differs; preserve index and stop: '+p)
            dirty=names(git(checkout,'diff','--name-only','-z'))+names(git(checkout,'ls-files','--others','--exclude-standard','-z'))
            for p in dirty:
                need(p in files,'Unrelated working-tree change exists; preserve it and stop: '+p)
                dest=files[p]['destination'];need(dest.exists() and digest(dest.read_bytes())==files[p]['sha256'],'Existing working copy differs from this delivery; do not overwrite: '+p)
        report={'mode':'STAGE' if args.stage else 'COPY' if args.copy else 'PREVIEW','branch':BRANCH,'sourceHeadCommit':SOURCE_HEAD,'checkout':str(checkout),'allowlistedFiles':len(files),'nativePNGs':36,'manifestRuntimeSHA256':digest(manifest_bytes),'copied':0,'staged':0,'gitExecuted':bool(args.stage),'commitExecuted':False,'pushExecuted':False,'prCreated':False}
        if args.copy:
            for rp,f in files.items():
                dest=f['destination']
                if dest.exists() and digest(dest.read_bytes())==f['sha256']:continue
                dest.parent.mkdir(parents=True,exist_ok=True);temp=dest.with_name(dest.name+'.allowlist-copy.tmp')
                with temp.open('xb') as out:out.write(f['bytes'])
                os.replace(temp,dest);need(digest(dest.read_bytes())==f['sha256'],'Copied bytes differ: '+rp);report['copied']+=1
        if args.stage:
            for rp,f in files.items():need(f['destination'].is_file() and digest(f['destination'].read_bytes())==f['sha256'],'Destination missing or different; use --copy first: '+rp)
            payload=b'\0'.join(p.encode('utf-8') for p in sorted(files))+b'\0'
            git(checkout,'add','--pathspec-from-file=-','--pathspec-file-nul',input_bytes=payload)
            staged_after=names(git(checkout,'diff','--cached','--name-only','-z'));need(set(staged_after)<=set(files),'Unexpected path entered index.')
            idx=index_entries(checkout)
            for rp,f in files.items():need(rp in idx and idx[rp]['mode'] in ['100644','100755'] and idx[rp]['oid']==blob_oid(f['bytes'],algorithm),'Git index bytes differ (possible clean/LFS filter): '+rp)
            report['staged']=len(staged_after);report['indexAllAllowlistedBytesVerified']=True
        print(json.dumps(report,ensure_ascii=False,indent=2));return 0
    except Exception as e:print(json.dumps({'status':'STOPPED','reason':str(e),'noCommitOrPush':True},ensure_ascii=False,indent=2));return 2
if __name__=='__main__':sys.exit(main())
