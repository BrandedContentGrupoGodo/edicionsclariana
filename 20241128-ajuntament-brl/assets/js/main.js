(function() {
    var t, e, n, i, o, r = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        },
        s = [].indexOf || function(t) {
            for (var e = 0, n = this.length; n > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        };
    e = function() {
        function t() {}
        return t.prototype.extend = function(t, e) {
            var n, i;
            for (n in e) i = e[n], null == t[n] && (t[n] = i);
            return t
        }, t.prototype.isMobile = function(t) {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(t)
        }, t.prototype.createEvent = function(t, e, n, i) {
            var o;
            return null == e && (e = !1), null == n && (n = !1), null == i && (i = null), null != document.createEvent ? (o = document.createEvent("CustomEvent")).initCustomEvent(t, e, n, i) : null != document.createEventObject ? (o = document.createEventObject()).eventType = t : o.eventName = t, o
        }, t.prototype.emitEvent = function(t, e) {
            return null != t.dispatchEvent ? t.dispatchEvent(e) : e in (null != t) ? t[e]() : "on" + e in (null != t) ? t["on" + e]() : void 0
        }, t.prototype.addEvent = function(t, e, n) {
            return null != t.addEventListener ? t.addEventListener(e, n, !1) : null != t.attachEvent ? t.attachEvent("on" + e, n) : t[e] = n
        }, t.prototype.removeEvent = function(t, e, n) {
            return null != t.removeEventListener ? t.removeEventListener(e, n, !1) : null != t.detachEvent ? t.detachEvent("on" + e, n) : delete t[e]
        }, t.prototype.innerHeight = function() {
            return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight
        }, t
    }(), n = this.WeakMap || this.MozWeakMap || (n = function() {
        function t() {
            this.keys = [], this.values = []
        }
        return t.prototype.get = function(t) {
            var e, n, i, o;
            for (e = n = 0, i = (o = this.keys).length; i > n; e = ++n)
                if (o[e] === t) return this.values[e]
        }, t.prototype.set = function(t, e) {
            var n, i, o, r;
            for (n = i = 0, o = (r = this.keys).length; o > i; n = ++i)
                if (r[n] === t) return void(this.values[n] = e);
            return this.keys.push(t), this.values.push(e)
        }, t
    }()), t = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (t = function() {
        function t() {
            "undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser."), "undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")
        }
        return t.notSupported = !0, t.prototype.observe = function() {}, t
    }()), i = this.getComputedStyle || function(t) {
        return this.getPropertyValue = function(e) {
            var n;
            return "float" === e && (e = "styleFloat"), o.test(e) && e.replace(o, (function(t, e) {
                return e.toUpperCase()
            })), (null != (n = t.currentStyle) ? n[e] : void 0) || null
        }, this
    }, o = /(\-([a-z]){1})/g, this.WOW = function() {
        function o(t) {
            null == t && (t = {}), this.scrollCallback = r(this.scrollCallback, this), this.scrollHandler = r(this.scrollHandler, this), this.resetAnimation = r(this.resetAnimation, this), this.start = r(this.start, this), this.scrolled = !0, this.config = this.util().extend(t, this.defaults), null != t.scrollContainer && (this.config.scrollContainer = document.querySelector(t.scrollContainer)), this.animationNameCache = new n, this.wowEvent = this.util().createEvent(this.config.boxClass)
        }
        return o.prototype.defaults = {
            boxClass: "wow",
            animateClass: "animated",
            offset: 0,
            mobile: !0,
            live: !0,
            callback: null,
            scrollContainer: null
        }, o.prototype.init = function() {
            var t;
            return this.element = window.document.documentElement, "interactive" === (t = document.readyState) || "complete" === t ? this.start() : this.util().addEvent(document, "DOMContentLoaded", this.start), this.finished = []
        }, o.prototype.start = function() {
            var e, n, i, o;
            if (this.stopped = !1, this.boxes = function() {
                    var t, n, i, o;
                    for (o = [], t = 0, n = (i = this.element.querySelectorAll("." + this.config.boxClass)).length; n > t; t++) e = i[t], o.push(e);
                    return o
                }.call(this), this.all = function() {
                    var t, n, i, o;
                    for (o = [], t = 0, n = (i = this.boxes).length; n > t; t++) e = i[t], o.push(e);
                    return o
                }.call(this), this.boxes.length)
                if (this.disabled()) this.resetStyle();
                else
                    for (n = 0, i = (o = this.boxes).length; i > n; n++) e = o[n], this.applyStyle(e, !0);
            return this.disabled() || (this.util().addEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler), this.util().addEvent(window, "resize", this.scrollHandler), this.interval = setInterval(this.scrollCallback, 50)), this.config.live ? new t(function(t) {
                return function(e) {
                    var n, i, o, r, s;
                    for (s = [], n = 0, i = e.length; i > n; n++) r = e[n], s.push(function() {
                        var t, e, n, i;
                        for (i = [], t = 0, e = (n = r.addedNodes || []).length; e > t; t++) o = n[t], i.push(this.doSync(o));
                        return i
                    }.call(t));
                    return s
                }
            }(this)).observe(document.body, {
                childList: !0,
                subtree: !0
            }) : void 0
        }, o.prototype.stop = function() {
            return this.stopped = !0, this.util().removeEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler), this.util().removeEvent(window, "resize", this.scrollHandler), null != this.interval ? clearInterval(this.interval) : void 0
        }, o.prototype.sync = function() {
            return t.notSupported ? this.doSync(this.element) : void 0
        }, o.prototype.doSync = function(t) {
            var e, n, i, o, r;
            if (null == t && (t = this.element), 1 === t.nodeType) {
                for (r = [], n = 0, i = (o = (t = t.parentNode || t).querySelectorAll("." + this.config.boxClass)).length; i > n; n++) e = o[n], s.call(this.all, e) < 0 ? (this.boxes.push(e), this.all.push(e), this.stopped || this.disabled() ? this.resetStyle() : this.applyStyle(e, !0), r.push(this.scrolled = !0)) : r.push(void 0);
                return r
            }
        }, o.prototype.show = function(t) {
            return this.applyStyle(t), t.className = t.className + " " + this.config.animateClass, null != this.config.callback && this.config.callback(t), this.util().emitEvent(t, this.wowEvent), this.util().addEvent(t, "animationend", this.resetAnimation), this.util().addEvent(t, "oanimationend", this.resetAnimation), this.util().addEvent(t, "webkitAnimationEnd", this.resetAnimation), this.util().addEvent(t, "MSAnimationEnd", this.resetAnimation), t
        }, o.prototype.applyStyle = function(t, e) {
            var n, i, o;
            return i = t.getAttribute("data-wow-duration"), n = t.getAttribute("data-wow-delay"), o = t.getAttribute("data-wow-iteration"), this.animate(function(r) {
                return function() {
                    return r.customStyle(t, e, i, n, o)
                }
            }(this))
        }, o.prototype.animate = "requestAnimationFrame" in window ? function(t) {
            return window.requestAnimationFrame(t)
        } : function(t) {
            return t()
        }, o.prototype.resetStyle = function() {
            var t, e, n, i, o;
            for (o = [], e = 0, n = (i = this.boxes).length; n > e; e++) t = i[e], o.push(t.style.visibility = "visible");
            return o
        }, o.prototype.resetAnimation = function(t) {
            var e;
            return t.type.toLowerCase().indexOf("animationend") >= 0 ? (e = t.target || t.srcElement).className = e.className.replace(this.config.animateClass, "").trim() : void 0
        }, o.prototype.customStyle = function(t, e, n, i, o) {
            return e && this.cacheAnimationName(t), t.style.visibility = e ? "hidden" : "visible", n && this.vendorSet(t.style, {
                animationDuration: n
            }), i && this.vendorSet(t.style, {
                animationDelay: i
            }), o && this.vendorSet(t.style, {
                animationIterationCount: o
            }), this.vendorSet(t.style, {
                animationName: e ? "none" : this.cachedAnimationName(t)
            }), t
        }, o.prototype.vendors = ["moz", "webkit"], o.prototype.vendorSet = function(t, e) {
            var n, i, o, r;
            for (n in i = [], e) o = e[n], t["" + n] = o, i.push(function() {
                var e, i, s, l;
                for (l = [], e = 0, i = (s = this.vendors).length; i > e; e++) r = s[e], l.push(t["" + r + n.charAt(0).toUpperCase() + n.substr(1)] = o);
                return l
            }.call(this));
            return i
        }, o.prototype.vendorCSS = function(t, e) {
            var n, o, r, s, l, a;
            for (s = (l = i(t)).getPropertyCSSValue(e), n = 0, o = (r = this.vendors).length; o > n; n++) a = r[n], s = s || l.getPropertyCSSValue("-" + a + "-" + e);
            return s
        }, o.prototype.animationName = function(t) {
            var e;
            try {
                e = this.vendorCSS(t, "animation-name").cssText
            } catch (n) {
                e = i(t).getPropertyValue("animation-name")
            }
            return "none" === e ? "" : e
        }, o.prototype.cacheAnimationName = function(t) {
            return this.animationNameCache.set(t, this.animationName(t))
        }, o.prototype.cachedAnimationName = function(t) {
            return this.animationNameCache.get(t)
        }, o.prototype.scrollHandler = function() {
            return this.scrolled = !0
        }, o.prototype.scrollCallback = function() {
            var t;
            return !this.scrolled || (this.scrolled = !1, this.boxes = function() {
                var e, n, i, o;
                for (o = [], e = 0, n = (i = this.boxes).length; n > e; e++)(t = i[e]) && (this.isVisible(t) ? this.show(t) : o.push(t));
                return o
            }.call(this), this.boxes.length || this.config.live) ? void 0 : this.stop()
        }, o.prototype.offsetTop = function(t) {
            for (var e; void 0 === t.offsetTop;) t = t.parentNode;
            for (e = t.offsetTop; t = t.offsetParent;) e += t.offsetTop;
            return e
        }, o.prototype.isVisible = function(t) {
            var e, n, i, o, r;
            return n = t.getAttribute("data-wow-offset") || this.config.offset, o = (r = this.config.scrollContainer && this.config.scrollContainer.scrollTop || window.pageYOffset) + Math.min(this.element.clientHeight, this.util().innerHeight()) - n, e = (i = this.offsetTop(t)) + t.clientHeight, o >= i && e >= r
        }, o.prototype.util = function() {
            return null != this._util ? this._util : this._util = new e
        }, o.prototype.disabled = function() {
            return !this.config.mobile && this.util().isMobile(navigator.userAgent)
        }, o
    }()
}).call(this);

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