

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


    