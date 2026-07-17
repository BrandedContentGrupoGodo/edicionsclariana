const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const locale = document.documentElement.lang === 'es' ? 'es-ES' : 'ca-ES';
const format = (n, d = 0) => n.toLocaleString(locale, {minimumFractionDigits:d, maximumFractionDigits:d});
function count(el){const end=Number(el.dataset.count),dec=Number(el.dataset.decimals||0);if(reduced){el.textContent=format(end,dec);return}const start=performance.now();function frame(now){const p=Math.min((now-start)/1200,1),e=1-Math.pow(1-p,3);el.textContent=format(end*e,dec);if(p<1)requestAnimationFrame(frame)}requestAnimationFrame(frame)}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting||entry.target.dataset.seen)return;entry.target.dataset.seen='1';entry.target.classList.add('is-visible');if(entry.target.matches('[data-count]'))count(entry.target)}),{threshold:.25});
document.querySelectorAll('[data-count],.bars,.staff-chart').forEach(el=>observer.observe(el));

const mapButtons=[...document.querySelectorAll('.map-wrap button')], mapArticles=[...document.querySelectorAll('.map-copy article')], mapCopy=document.querySelector('.map-copy'), mapIntro=document.querySelector('.map-copy>p');
mapButtons.forEach(button=>button.addEventListener('click',()=>{
  mapButtons.forEach(b=>b.classList.toggle('is-active',b===button));
  const activePopup=mapArticles.find(a=>a.id===`map-${button.dataset.place}`);
  mapArticles.forEach(a=>a.hidden=a!==activePopup);
  const iconSource=button.querySelector('img')?.getAttribute('src')||'';
  if(mapCopy){
    mapCopy.dataset.color=iconSource.includes('vermell')?'coral':iconSource.includes('verd')?'sage':'cyan';
  }
  if(mapIntro)mapIntro.hidden=true;
}));

const track=document.querySelector('.cards');
document.querySelector('.carousel .next')?.addEventListener('click',()=>track.scrollBy({left:track.clientWidth*.72,behavior:'smooth'}));
document.querySelector('.carousel .prev')?.addEventListener('click',()=>track.scrollBy({left:-track.clientWidth*.72,behavior:'smooth'}));
