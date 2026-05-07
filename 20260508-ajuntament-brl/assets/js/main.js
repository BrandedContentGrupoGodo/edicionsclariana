/* ========================================
   STATS CAROUSEL
======================================== */

function initStatsCarousel(){

const track = document.querySelector(".stats-track");
if(!track) return;

const cards = Array.from(document.querySelectorAll(".stat-card"));

const prev = document.querySelector(".stats-arrow--left");
const next = document.querySelector(".stats-arrow--right");

const dotsContainer = document.querySelector(".stats-dots");

const visibleCards = window.innerWidth < 700 ? 1 : 3;

let index = visibleCards;


/* CLONES (correctes) */

const firstClones = cards.slice(0, visibleCards).map(el=>el.cloneNode(true));
const lastClones = cards.slice(-visibleCards).map(el=>el.cloneNode(true));

lastClones.forEach(el=>track.prepend(el));
firstClones.forEach(el=>track.append(el));

const allCards = document.querySelectorAll(".stat-card");


/* DOTS */

cards.forEach((_,i)=>{

const dot=document.createElement("button");

if(i===0) dot.classList.add("active");

dotsContainer.appendChild(dot);

dot.addEventListener("click",()=>{

index=i+visibleCards;
update();

});

});

const dots=document.querySelectorAll(".stats-dots button");


/* UPDATE */

function update(anim=true){

const gap = window.innerWidth < 700 ? 0 : 30;

const cardWidth = allCards[0].offsetWidth + gap;

track.style.transition = anim ? "transform .5s ease" : "none";

track.style.transform = `translateX(-${index*cardWidth}px)`;

let dotIndex = index-visibleCards;

if(dotIndex>=cards.length) dotIndex=0;
if(dotIndex<0) dotIndex=cards.length-1;

dots.forEach(d=>d.classList.remove("active"));
dots[dotIndex].classList.add("active");

}

update(false);


/* ARROWS */

next.addEventListener("click",()=>{

index++;
update();

});

prev.addEventListener("click",()=>{

index--;
update();

});


/* LOOP RESET */

track.addEventListener("transitionend",()=>{

if(index>=cards.length+visibleCards){

index=visibleCards;
update(false);

}

if(index<visibleCards){

index=cards.length+visibleCards-1;
update(false);

}

});


/* AUTOPLAY */

setInterval(()=>{

index++;
update();

},4000);

}



/* ========================================
   PARKS CAROUSEL
======================================== */

function initParksCarousel(){

const track = document.querySelector(".parks-track");
if(!track) return;

const cards = Array.from(document.querySelectorAll(".park-card"));

const prev = document.querySelector(".parks-arrow--left");
const next = document.querySelector(".parks-arrow--right");

const dotsContainer = document.querySelector(".parks-dots");

const visible = window.innerWidth < 700 ? 1 : 3;

let index = visible;


/* CLONES (correctes) */

const firstClones = cards.slice(0, visible).map(el=>el.cloneNode(true));
const lastClones = cards.slice(-visible).map(el=>el.cloneNode(true));

lastClones.forEach(el=>track.prepend(el));
firstClones.forEach(el=>track.append(el));

const allCards = document.querySelectorAll(".park-card");


/* DOTS */

cards.forEach((_,i)=>{

const dot=document.createElement("button");

if(i===0) dot.classList.add("active");

dotsContainer.appendChild(dot);

dot.addEventListener("click",()=>{

index=i+visible;
update();

});

});

const dots=document.querySelectorAll(".parks-dots button");


/* UPDATE */

function update(anim=true){

const gap = window.innerWidth < 700 ? 0 : 30;

const w = allCards[0].offsetWidth + gap;

track.style.transition = anim ? "transform .5s ease" : "none";

track.style.transform = `translateX(-${index*w}px)`;

let dotIndex = index-visible;

if(dotIndex>=cards.length) dotIndex=0;
if(dotIndex<0) dotIndex=cards.length-1;

dots.forEach(d=>d.classList.remove("active"));
dots[dotIndex].classList.add("active");

}

update(false);


/* ARROWS */

next.onclick=()=>{

index++;
update();

};

prev.onclick=()=>{

index--;
update();

};


/* LOOP RESET */

track.addEventListener("transitionend",()=>{

if(index>=cards.length+visible){

index=visible;
update(false);

}

if(index<visible){

index=cards.length+visible-1;
update(false);

}

});


/* AUTOPLAY */

setInterval(()=>{

index++;
update();

},7000);

}



/* ========================================
   VIDEO YOUTUBE LAZY LOAD
======================================== */

function initVideoLazyLoad(){

document.querySelectorAll(".video-wrapper").forEach(video=>{

video.addEventListener("click",()=>{

const id = video.dataset.video;

const iframe = document.createElement("iframe");

iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

iframe.setAttribute("frameborder","0");

iframe.allow =
"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

iframe.allowFullscreen = true;

video.innerHTML="";
video.appendChild(iframe);

});

});

}



/* ========================================
   MODALS
======================================== */

function initModals(){

let lastTrigger = null;

function openModal(modal, trigger){

if(!modal) return;

lastTrigger = trigger || null;

modal.classList.add("is-open");
modal.setAttribute("aria-hidden","false");

document.body.style.overflow="hidden";

}

function closeModal(modal){

if(!modal) return;

modal.classList.remove("is-open");
modal.setAttribute("aria-hidden","true");

document.body.style.overflow="";

if(lastTrigger) lastTrigger.focus();

}


/* OPEN */

document.querySelectorAll("[data-modal-open]").forEach(el=>{

el.addEventListener("click",()=>{

const id = el.getAttribute("data-modal-open");

const modal = document.getElementById(id);

openModal(modal, el);

});

});


/* CLOSE BUTTON */

document.querySelectorAll("[data-modal-close]").forEach(btn=>{

btn.addEventListener("click",()=>{

const modal = btn.closest(".modal");

closeModal(modal);

});

});


/* CLOSE OVERLAY */

document.querySelectorAll(".modal__overlay").forEach(overlay=>{

overlay.addEventListener("click",()=>{

const modal = overlay.closest(".modal");

closeModal(modal);

});

});


/* ESC */

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

const modal = document.querySelector(".modal.is-open");

if(modal) closeModal(modal);

}

});

}



/* ========================================
   INIT
======================================== */

document.addEventListener("DOMContentLoaded",()=>{

initStatsCarousel();
initParksCarousel();
initVideoLazyLoad();
initModals();

});

const items = document.querySelectorAll('.reasons-ajuntament__item');

function showOnScroll() {
    const trigger = window.innerHeight * 0.85;

    items.forEach((item, index) => {
        const top = item.getBoundingClientRect().top;

        if (top < trigger) {
            // apareixen de 2 en 2
            const pairIndex = Math.floor(index / 2);

            setTimeout(() => {
                item.classList.add('is-visible');
            }, pairIndex * 200);
        }
    });
}

window.addEventListener('scroll', showOnScroll);