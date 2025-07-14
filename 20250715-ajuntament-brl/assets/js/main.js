

$(window).on("load", function() {
 function createRecruitmentProcess() {
        var path = document.querySelector(".ring-bg"),
        length = path.getTotalLength(),
        ring = $(path),
        noPoints = parseInt($(".recruitment-wrap").attr("data-points"), 4),
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
