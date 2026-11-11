(function(){
  const SECTIONS=window.DECK_SECTIONS||[];
  const stage=document.getElementById('stage');
  const slides=[...stage.querySelectorAll('.slide')];
  const N=slides.length;
  const $=id=>document.getElementById(id);
  const ov=$('overview'),help=$('help'),black=$('blackout');
  let cur=0;

  slides.forEach((s,k)=>{
    const br=document.createElement('a');br.className='brand';br.href='https://coccoc.atento.vn/';br.title='Về trang chủ coccoc.atento.vn';
    br.innerHTML='<img src="../assets/logos/atento.png" alt=""><b>Atento</b><span class="x" aria-hidden="true">×</span><img class="cc" src="../assets/logos/coccoc.png" alt="Cốc Cốc">';
    s.prepend(br);
    if(s.dataset.sec!==undefined){
      const c=+s.dataset.sec,t=document.createElement('div');t.className='trk';
      SECTIONS.forEach((name,j)=>{const e=document.createElement('span');e.textContent=name;if(j<c)e.className='past';if(j===c)e.className='cur';t.appendChild(e);});
      s.appendChild(t);
    }
    if(k>0){const p=document.createElement('div');p.className='pg';p.textContent=(k+1)+' / '+N;s.appendChild(p);}
    const b=document.createElement('button');
    b.innerHTML='<span>'+(k+1)+'</span>'+(s.dataset.title||'Slide '+(k+1));
    b.addEventListener('click',e=>{e.stopPropagation();go(k);toggle(ov,false);});
    $('ov-grid').appendChild(b);
  });

  function go(n){
    n=Math.max(0,Math.min(N-1,n));
    slides.forEach((s,k)=>s.classList.toggle('active',k===n));
    cur=n;
    $('progress').style.width=(N>1?cur/(N-1)*100:100)+'%';
    [...$('ov-grid').children].forEach((b,k)=>b.classList.toggle('cur',k===cur));
    $('b-prev').disabled=cur===0;$('b-next').disabled=cur===N-1;
    try{history.replaceState(null,'','#'+(cur+1));}catch(e){}
  }
  const next=()=>go(cur+1),prev=()=>go(cur-1);
  function fit(){
    const sc=Math.min(innerWidth/1600,innerHeight/900);
    stage.style.transform='translate(-50%,-50%) scale('+sc+')';
  }
  const toggle=(el,force)=>el.classList.toggle('on',force);

  document.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    const k=e.key;
    if(k==='Escape'){toggle(ov,false);toggle(help,false);black.classList.remove('on');return;}
    if(ov.classList.contains('on')&&k!=='o'&&k!=='O')return;
    switch(k){
      case 'ArrowRight':case 'ArrowDown':case ' ':case 'PageDown':case 'Enter':e.preventDefault();next();break;
      case 'ArrowLeft':case 'ArrowUp':case 'PageUp':case 'Backspace':e.preventDefault();prev();break;
      case 'Home':go(0);break;
      case 'End':go(N-1);break;
      case 'f':case 'F':
        if(!document.fullscreenElement){if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});}
        else document.exitFullscreen();break;
      case 'o':case 'O':toggle(ov);break;
      case 'b':case 'B':case '.':black.classList.toggle('on');break;
      case '?':case 'h':case 'H':toggle(help);break;
    }
  });

  let swiped=false,tx=0,ty=0;
  const vp=$('viewport');
  vp.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;swiped=false;},{passive:true});
  vp.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(String(getSelection()))return;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){swiped=true;dx<0?next():prev();}});
  $('b-prev').addEventListener('click',prev);
  $('b-next').addEventListener('click',next);
  black.addEventListener('click',()=>black.classList.remove('on'));
  help.addEventListener('click',()=>toggle(help,false));
  addEventListener('resize',fit);
  document.addEventListener('fullscreenchange',fit);
  const h=parseInt((location.hash||'').slice(1),10);
  go(isNaN(h)?0:h-1);
  fit();
})();
