

$(document).ready(function(){
  var $prev = $('.previousx');
  var $next = $('.nextx');
  var mode = "auto";
  $prev.on({
    click: function(e){
      e.preventDefault();
      mode = "manual";
      showPreviousImage();
    }
  });
  $next.on({
    click: function(e){
      e.preventDefault();
      mode = "manual";
      showNextImage();
      
    }
  });
  
  setInterval(function(){
    if(mode==="auto"){
      showNextImage();
    }
  },4200);
  
  function showNextImage(){
      var $actEl = $('.activx');
      var $nextEl = $actEl.next('.slidex');
      if($nextEl.length){
        $actEl.removeClass('activx');
        $nextEl.addClass('activx');
      }else{
        $actEl.removeClass('activx');
        $('.slidex:first-child').addClass('activx');
      }
  }
  
  function showPreviousImage(){
      var $actEl = $('.activx');
      var $prevEl = $actEl.prev('.slidex');
      if($prevEl.length){
        $actEl.removeClass('activx');
        $prevEl.addClass('activx');
      }else{
        $actEl.removeClass('activx');
        $('.slidex.last').addClass('activx');
      }
  }
});


    var desplegables = document.querySelectorAll('.acordio h4')
    desplegables.forEach(function (desplegable) {
        desplegable.addEventListener("click", function () {
            desplegables.forEach(function (des) {
                if (desplegable === des) {
                    des.classList.toggle("desplegat")
                } else {
                    des.classList.remove("desplegat")
                }
            })
        }, false);
    })

        //Fletxes
    var fletxes = document.querySelectorAll('.fltx')
    fletxes.forEach(function (fletxa) {
        new ScrollMagic.Scene({ triggerElement: fletxa, triggerHook: 0.7, reverse: false })
            .setClassToggle(fletxa, "active")
            .addTo(controller);
    })

    $(function() {
  $('.text').on('click', function(e) {
    //$(this).toggleClass('open');
    $('.text').removeClass('open');
    $(this).addClass('open');
    
  });
});


    function replace( hide, show ) {
  document.getElementById(hide).style.display="none";
  document.getElementById(show).style.display="block";
}


    

    ////////////////////
// Const's
////////////////////
const _sliderAutoChangeTime = 3000;
const _sliderWrap = document.getElementById("slider-wrap");
const _slider = document.getElementById("slider");
const _slides = _slider.querySelectorAll("li");
const _sliderCount = _slides.length;
const _dotNavigation = document.getElementById("dot-navigation");
const _nextButton = document.querySelector(".next");
const _previousButton = document.querySelector(".previous");

////////////////////
// Create Dot Navigation
////////////////////
_slides.forEach(function () {
  _dotNavigation.innerHTML += "<li></li>";
});

////////////////////
// Secondary Const's (now things are dynamically built)
////////////////////
const _dots = document.querySelectorAll("#dot-navigation li");

////////////////////
// Activate First Dot Navigation
////////////////////
_dots[0].classList.add("active");

////////////////////
// Activate First Slider
////////////////////
_slides[0].classList.add("active");

////////////////////
// Create Dot Navigation 'click' events
////////////////////
_dots.forEach(function (dot, index) {
  dot.addEventListener("click", function () {
    setActiveSliderIndex(index);
  });
});

////////////////////
// Previous Arrow 'click' event
////////////////////
_previousButton.addEventListener("click", function () {
  let currentIndex = currentLiveIndex(),
    previousIndex = currentIndex - 1 < 0 ? _sliderCount - 1 : currentIndex - 1;
  setActiveSliderIndex(previousIndex);
});

////////////////////
// Next Arrow 'click' event
////////////////////
_nextButton.addEventListener("click", function () {
  MoveToNextSlider();
});

////////////////////
// Move to Next Slider
////////////////////
let MoveToNextSlider = () => {
  let currentIndex = currentLiveIndex(),
    nextIndex = currentIndex + 1 > _sliderCount - 1 ? 0 : currentIndex + 1;
  setActiveSliderIndex(nextIndex);
};

////////////////////
// Current Live Slide Index
////////////////////
let currentLiveIndex = () => {
  var response;
  _slides.forEach(function (li, index) {
    if (li.classList.contains("active")) response = index;
  });
  return response;
};

////////////////////
// Set Slider and Dot Nav Active
////////////////////
let setActiveSliderIndex = (activeSliderIndex) => {
  // Changes Slider
  _slider.querySelector("li.active").classList.remove("active");
  _slides[activeSliderIndex].classList.add("active");
  // Change Dot Navigation
  _dotNavigation.querySelector("li.active").classList.remove("active");
  _dots[activeSliderIndex].classList.add("active");
  // Reset Timer
  restartInterval();
};

////////////////////
// Timer
////////////////////
let timer = setInterval(MoveToNextSlider, _sliderAutoChangeTime);

////////////////////
// Reset time between sliders
////////////////////
let restartInterval = () => {
  clearInterval(timer);
  timer = setInterval(MoveToNextSlider, _sliderAutoChangeTime);
};

////////////////////
// Pause on hover
////////////////////

_slider.addEventListener("mouseover", function () {
  clearInterval(timer);
});
_slider.addEventListener("mouseout", function () {
  restartInterval();
});
