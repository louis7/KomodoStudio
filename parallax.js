/* Komodo Parallax Engine — tiny scroll-driven animation helper shared by themes 13–24.
   [data-scroll]       tall section: sets --p (0→1) while it scrolls through the viewport. KP.on(el,fn) for custom per-frame logic.
   [data-par="0.3"]    parallax: positive = faster (foreground), negative = slower (background). Uses CSS `translate`, so transforms stay free.
   [data-reveal]       gets .in when visible.  [data-scramble] types itself in, Apple-callout style.  [data-count="13"] counts up. */
(function(){
 const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
 const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const cbs=new Map();let scenes=[],pars=[],ticking=false;
 window.KP={on(el,fn){cbs.set(el,fn);collect();tick()},clamp:cl,lerp:(a,b,t)=>a+(b-a)*t,
  seg:(p,a,b)=>cl((p-a)/(b-a)),ease:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,reduced:RM,refresh(){collect();tick()}};
 function collect(){scenes=[...document.querySelectorAll("[data-scroll]")];pars=[...document.querySelectorAll("[data-par]")]}
 function frame(){ticking=false;const vh=innerHeight;
  for(const s of scenes){const r=s.getBoundingClientRect();if(r.bottom<-vh||r.top>vh*2)continue;
   const p=cl(-r.top/Math.max(1,r.height-vh));s.style.setProperty("--p",p.toFixed(4));const f=cbs.get(s);if(f)f(p,s)}
  if(!RM)for(const e of pars){const r=e.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)continue;
   const c=(r.top+r.height/2-vh/2)/vh;const sp=parseFloat(e.dataset.par)||0;e.style.translate=`0 ${(-c*sp*vh*.5).toFixed(1)}px`}}
 function tick(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
 addEventListener("scroll",tick,{passive:true});addEventListener("resize",tick);
 function scramble(el){const fin=el.dataset.final||el.textContent;el.dataset.final=fin;const ch="ABCDEFGHJKLMNPQRSTUVWXYZ0123456789×";let f=0;const L=fin.length;
  const id=setInterval(()=>{f++;el.textContent=fin.split("").map((c,i)=>c===" "?" ":i<f/2?c:ch[Math.random()*ch.length|0]).join("");if(f/2>=L){el.textContent=fin;clearInterval(id)}},34)}
 function count(el){const to=parseFloat(el.dataset.count),dec=(el.dataset.count.split(".")[1]||"").length,t0=performance.now(),d=1400;
  (function st(t){const k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=(to*e).toFixed(dec);if(k<1)requestAnimationFrame(st)})(t0)}
 addEventListener("DOMContentLoaded",()=>{collect();tick();
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;io.unobserve(t);
   if(t.hasAttribute("data-reveal"))t.classList.add("in");if(t.hasAttribute("data-scramble"))RM?0:scramble(t);if(t.hasAttribute("data-count"))RM?t.textContent=t.dataset.count:count(t)}),{threshold:.3});
  document.querySelectorAll("[data-reveal],[data-scramble],[data-count]").forEach(e=>io.observe(e))});
})();
