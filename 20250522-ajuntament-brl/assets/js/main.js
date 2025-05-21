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


    


$(window).on("load", function() {
 function createRecruitmentProcess() {
        var path = document.querySelector(".ring-bg"),
        length = path.getTotalLength(),
        ring = $(path),
        noPoints = parseInt($(".recruitment-wrap").attr("data-points"), 10),
        currentPoint = 0,
        lastPoint = 0,
        plane = $(".plane-wrap"),
        animating = false,
        recruitmentText = $('.recruitment-text');

        function changeTextHeight(a) {
            var newHeight =  $(".step:nth-child("+(a+1)+")").outerHeight();
            recruitmentText.css('height', newHeight);
        } 

    // Generate points
    for (var i = 0; i < noPoints; i++) {
        // Add points to DOM
        $(".point-wrap").append(
            '<div class="point"><div class="point-inner"><div class="point-transform"><span>' +
            (i + 1) +
            "</span></div></div></div>"
            );

        // Add dots to DOM
        $(".dots").append('<div class="dot"></div>');

        // Set point position
        $(".point:nth-child(" + (i + 1) + ")")
        .css({
            transform: "translateY(-50%) rotate(" + 360 / noPoints * i + "deg)"
        })
        .find(".point-inner")
        .css({
            transform: "rotate(" + -360 / noPoints * i + "deg)"
        });
    }

    // Add default state
    $(".point:nth-child(1)").addClass("active");
    $(".dot:nth-child(1)").addClass("active");
    $(".step:nth-child(1)").addClass("active");
    
    // Set line animation to 0
    ring.css({
        "stroke-dasharray": length,
        "stroke-dashoffset": length
    });

    changeTextHeight(0);

    // Add animation to line
    setTimeout(function() {
        ring.addClass("animate");
    }, 10);

    // Change point. 'a' being chosen point
    function changePoint(a) {
        animating = true;

        setTimeout(function() {
            animating = false;
        }, 1000);

        // Change active point
        $(".point.active").removeClass("active");
        $(".point:nth-child(" + (a + 1) + ")").addClass("active");

        $(".dot.active").removeClass("active");
        $(".dot:nth-child(" + (a + 1) + ")").addClass("active");

        // Change Text
        var lastText = $(".step.active");

        lastText.addClass("next").removeClass("active");

        setTimeout(function() {
            lastText.removeClass("next");
        }, 800);

        setTimeout(function() {
            $(".step:nth-child(" + (a + 1) + ")").addClass("active");
        },100);

        changeTextHeight(a);

        // Reverse direction of plane
        if (lastPoint > currentPoint) {
            plane.addClass("reverse");
        } else {
            plane.removeClass("reverse");
        }

        // Get plane rotation
        var rotation = 360 / noPoints * a;

        // Change position of plane's shadow based on rotation
        if (rotation > 90 && rotation < 270) {
            plane.addClass("shadow");
        } else {
            plane.removeClass("shadow");
        }

        // Work out animation duration
        var difference = lastPoint - a;

        if (difference < 0) {
            difference = difference * -1;
        }

        var animationDuration = 1000 + 300 * difference;

        // Rotate plane
        plane.css({
            transition:
            animationDuration + "ms all cubic-bezier(0.645, 0.045, 0.355, 1)",
            transform: "translateY(-50%) rotate(" + rotation + "deg)"
        });

        // Animate ring
        ring.css({
            transition:
            animationDuration + "ms all cubic-bezier(0.645, 0.045, 0.355, 1)",
            "stroke-dasharray": length,
            "stroke-dashoffset": length - length / noPoints * a
        });

        // Animate Center
        var frames = 24,
        counter = 0,
        center = $(".center-wipe");
        setTimeout(function() {
            var interval = setInterval(function() {
                counter++;
                center.css({
                    "background-position": -counter * 100 + "%"
                });

                if (counter === frames / 2) {
                    $(".center-img").removeClass("active");
                    $(".center-img:nth-child(" + (a + 1) + ")").addClass("active");
                }

                if (counter > frames - 1) {
                    clearInterval(interval);
                    return;
                }
            }, 100 / 60 * 24);
        }, 300);
    }

    // Click interaction with point
    $(".recruitment-wrap").on("click", ".point", function() {
        if (animating) {
            return;
        }
        if ($(this).hasClass("active")) {
            return;
        }
        lastPoint = currentPoint;
        currentPoint = $(this).index();

        changePoint(currentPoint);
    });

    // Click Interaction with dot
    $(".recruitment-text").on("click", ".dot", function() {
        if (animating) {
            return;
        }
        if ($(this).hasClass("active")) {
            return;
        }
        lastPoint = currentPoint;
        currentPoint = $(this).index();

        changePoint(currentPoint);
    });

    // Click interaction with Arrow
    $(".arrow").on("click", function() {
        if (animating) {
            return;
        }
        var direction = parseInt($(this).attr("data-direction"), 10);
        lastPoint = currentPoint;

        currentPoint += direction;

        if (currentPoint > noPoints - 1) {
            currentPoint = 0;
        }

        if (currentPoint < 0) {
            currentPoint = noPoints - 1;
        }

        changePoint(currentPoint);
    });

    $(window).on('resize', function() {
        var resizeTimer;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            changeTextHeight(currentPoint);
        }, 80);
    });
}
  createRecruitmentProcess();   
});
    function replace( hide, show ) {
  document.getElementById(hide).style.display="none";
  document.getElementById(show).style.display="block";
}













document.addEventListener("DOMContentLoaded", function () {
  const ele = document.querySelector(".timeline-container");
  ele.style.cursor = "grab";

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const mouseDownHandler = function (e) {
    ele.style.userSelect = "none";

    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  const mouseUpHandler = function () {
    ele.style.cursor = "grab";
    ele.style.removeProperty("user-select");

    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  // Attach the handler
  ele.addEventListener("mousedown", mouseDownHandler);
});






class Accordion {
  constructor(document) {
    this.root = document;
    this.init();
  }

  init() {
    this.div = this.root.querySelector(".accordion");
    this.accordions = this.div?.querySelectorAll(".accordion__item");
    this.setupEventListeners();
  }

  toggleAccordion(accordion) {
    const isCurrentlyActive = accordion.classList.contains("clicked");
    const direction = isCurrentlyActive ? "reverse" : "init";

    if (!isCurrentlyActive && this.previousActiveAccordion) {
      this.expandAccordion(this.previousActiveAccordion, "reverse");
      this.previousActiveAccordion.classList.remove("clicked");
    }

    accordion.classList.toggle("clicked");
    this.expandAccordion(accordion, direction);
    this.previousActiveAccordion = isCurrentlyActive ? null : accordion;

    console.log("click");
  }

  expandAccordion(accordion, direction) {
    const inner = accordion.querySelector(".accordion__item-inner");
    const outer = accordion.querySelector(".accordion__item-outer");

    if (inner && outer) {
      if (direction === "init") {
        outer.style.height = accordion.classList.contains("clicked")
          ? `${inner.scrollHeight}px` // use scrollHeight for complete content height
          : "0px";
      } else if (direction === "reverse") {
        outer.style.height = "0px";
      }
    }
  }

  setupEventListeners() {
    if (this.accordions.length) {
      this.div.addEventListener("click", (e) => {
        const accordion = e.target.closest(".accordion__item");
        if (accordion) {
          e.preventDefault();
          this.toggleAccordion(accordion);
        }
      });
    }
  }
}

new Accordion(document);







$(function () {

  var activeIndex = $('.active-tab').index(),
      $contentlis = $('.tabs-content li'),
      $tabslis = $('.tabs li');
  
  // Show content of active tab on loads
  $contentlis.eq(activeIndex).show();

  $('.tabs').on('click', 'li', function (e) {
    var $current = $(e.currentTarget),
        index = $current.index();
    
    $tabslis.removeClass('active-tab');
    $current.addClass('active-tab');
    $contentlis.hide().eq(index).show();
     });
});