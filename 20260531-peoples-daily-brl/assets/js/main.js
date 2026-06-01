 
document.addEventListener("DOMContentLoaded",()=>{

const hero =
document.querySelector(".hero");

const sidebar =
document.querySelector(".sidebar");

if(!hero || !sidebar) return;

function updateSidebar(){

const heroBottom =
hero.getBoundingClientRect().bottom;

if(heroBottom < 100){

sidebar.classList.add(
"sidebar-visible"
);

}else{

sidebar.classList.remove(
"sidebar-visible"
);

}

}

window.addEventListener(
"scroll",
updateSidebar,
{ passive:true }
);

updateSidebar();

});
