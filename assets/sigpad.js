// Signature pad overlay - injected, does not touch bundle logic
(function(){
  function getSigState(){
    // mock backend stores tables as harbor___UserProfile, harbor___Licence, etc (arrays)
    // try common table names
    let tables=['harbor___UserProfile','harbor___userprofile','harbor___Userprofile'];
    // also scan any harbor___ key holding array with profile-ish objects
    try{
      for(let i=0;i<localStorage.length;i++){
        let k=localStorage.key(i);
        if(k && k.indexOf('harbor___')===0 && tables.indexOf(k)<0) tables.push(k);
      }
    }catch(e){}
    for(let ti=0;ti<tables.length;ti++){
      try{
        let raw=localStorage.getItem(tables[ti]);
        if(!raw) continue;
        let arr=JSON.parse(raw);
        if(Array.isArray(arr) && arr.length>0){
          // pick first item that looks like profile (has full_name or signature_url or app_instance_id)
          for(let j=0;j<arr.length;j++){
            if(arr[j] && (arr[j].signature_url!==undefined || arr[j].full_name!==undefined || arr[j].app_instance_id!==undefined)){
              return {key:tables[ti], idx:j, data:arr};
            }
          }
          // fallback: first item
          if(arr[0] && typeof arr[0]==='object') return {key:tables[ti], idx:0, data:arr};
        }
      }catch(e){}
    }
    return null;
  }
  function saveSig(dataUrl){
    let st=getSigState();
    if(!st){
      alert('Save your profile once first (Save All Changes), then draw signature.');
      return;
    }
    st.data[st.idx].signature_url=dataUrl;
    localStorage.setItem(st.key, JSON.stringify(st.data));
    // update preview if visible
    let imgs=document.querySelectorAll('img[alt="Signature"]');
    imgs.forEach(im=>{im.src=dataUrl;});
    alert('Signature saved!');
    closePad();
  }
  function openPad(){
    if(document.getElementById('sigpad-overlay')) return;
    let ov=document.createElement('div');
    ov.id='sigpad-overlay';
    ov.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px;';
    ov.innerHTML=
      '<div style="background:#fff;border-radius:16px;padding:16px;width:100%;max-width:420px;">'+
      '<h3 style="font-weight:700;margin-bottom:8px;">Draw signature</h3>'+
      '<canvas id="sigpad-canvas" width="600" height="220" style="width:100%;height:140px;border:1px solid #ddd;border-radius:8px;touch-action:none;background:#fff;"></canvas>'+
      '<div style="display:flex;gap:8px;margin-top:12px;">'+
      '<button id="sigpad-clear" style="flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;">Clear</button>'+
      '<button id="sigpad-cancel" style="flex:1;padding:10px;border:1px solid #ddd;border-radius:10px;">Cancel</button>'+
      '<button id="sigpad-save" style="flex:1;padding:10px;background:#52B848;color:#fff;border-radius:10px;border:0;font-weight:700;">Save</button>'+
      '</div>'+
      '<p style="font-size:12px;color:#888;margin-top:8px;">Sized for licence display (h-16). Use finger or mouse.</p>'+
      '</div>';
    document.body.appendChild(ov);
    let cv=document.getElementById('sigpad-canvas');
    let ctx=cv.getContext('2d');
    ctx.lineWidth=3; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle='#111';
    let drawing=false, last=null;
    function pos(e){
      let r=cv.getBoundingClientRect();
      let cx=(e.touches?e.touches[0].clientX:e.clientX);
      let cy=(e.touches?e.touches[0].clientY:e.clientY);
      return {x:(cx-r.left)*(cv.width/r.width), y:(cy-r.top)*(cv.height/r.height)};
    }
    cv.addEventListener('pointerdown', e=>{drawing=true; last=pos(e); cv.setPointerCapture(e.pointerId);});
    cv.addEventListener('pointermove', e=>{if(!drawing) return; let p=pos(e); ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); last=p;});
    ['pointerup','pointerleave','pointercancel'].forEach(ev=>cv.addEventListener(ev, ()=>{drawing=false;}));
    document.getElementById('sigpad-clear').onclick=()=>{ctx.clearRect(0,0,cv.width,cv.height);};
    document.getElementById('sigpad-cancel').onclick=closePad;
    ov.onclick=(e)=>{if(e.target===ov) closePad();};
    document.getElementById('sigpad-save').onclick=()=>{
      // trim check - blank?
      let blank=document.createElement('canvas'); blank.width=cv.width; blank.height=cv.height;
      if(cv.toDataURL()===blank.toDataURL()){alert('Draw something first'); return;}
      saveSig(cv.toDataURL('image/png'));
    };
  }
  function closePad(){
    let ov=document.getElementById('sigpad-overlay');
    if(ov) ov.remove();
  }
  window.__openSigPad=openPad;
  window.__closeSigPad=closePad;
  // auto-inject Draw button next to Upload Signature whenever admin panel renders
  function inject(){
    // case 1: button with exact text
    document.querySelectorAll('button').forEach(btn=>{
      if(btn.textContent.trim()==='Upload Signature' && !btn.dataset.sigbound){
        btn.dataset.sigbound='1';
        let draw=document.createElement('button');
        draw.type='button';
        draw.textContent='Draw Signature';
        draw.id='sigpad-draw-btn';
        draw.style.cssText='margin-left:8px;padding:8px 12px;border:1px solid #ddd;border-radius:8px;background:#f6f6f6;';
        draw.onclick=(e)=>{e.preventDefault();e.stopPropagation();openPad();};
        // btn may be inside label > span structure (radix asChild) - append next to it
        let parent=btn.parentElement;
        if(parent) parent.appendChild(draw);
      }
    });
    // case 2: fallback - find signature-upload input, inject after its label
    let sigInput=document.getElementById('signature-upload');
    if(sigInput && !document.getElementById('sigpad-draw-btn')){
      let label=sigInput.closest('div');
      if(label && !label.querySelector('#sigpad-draw-btn')){
        let draw=document.createElement('button');
        draw.type='button';
        draw.textContent='Draw Signature';
        draw.id='sigpad-draw-btn';
        draw.style.cssText='margin-top:8px;padding:8px 12px;border:1px solid #ddd;border-radius:8px;background:#f6f6f6;display:block;';
        draw.onclick=(e)=>{e.preventDefault();openPad();};
        label.appendChild(draw);
      }
    }
  }
  let obs=new MutationObserver(inject);
  obs.observe(document.body,{childList:true,subtree:true});
  // run immediately + delayed (react render)
  inject();
  setTimeout(inject,1000);
  setTimeout(inject,2500);
})();
