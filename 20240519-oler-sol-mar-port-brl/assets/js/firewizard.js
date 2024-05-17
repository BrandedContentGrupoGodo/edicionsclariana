function castParallax() {

	var opThresh = 350;
	var opFactor = 750;


	window.addEventListener("scroll", function(event){
		var top = this.pageYOffset;
		console.log(top);
			var opacidad = 1-top/1000;


		var layers = document.getElementsByClassName("parallax");
		var layer, speed, yPos;
		for (var i = 0; i < layers.length; i++) {
			layer = layers[i];
			speed = layer.getAttribute('data-speed');
			var yPos = -(top * speed / 100);
			layer.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px); ');

			

		}
	});


}



function castSmoothScroll() {
	$.srSmoothscroll({
		step: 80,
		speed: 300,
		ease: 'linear'
	});
}

/*
 $(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 400) {
    $('.bottomMenu').fadeIn();
  } 
  else {
    $('.bottomMenu').fadeOut();
  }
});
  $(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 500) {
    $('.bottomMenuk').fadeIn();
  } else {
    $('.bottomMenuk').fadeOut();
  }
});
    $(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 800) {
    $('.menu1').fadeIn();
  } else {
    $('.menu1').fadeOut();
  }
});
    $(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 1200) {
    $('.menu2').fadeIn();
  } else {
    $('.menu2').fadeOut();
  }
});
    $(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 800) {
    $('.caja').fadeIn();
  } else {
    $('.caja').fadeOut();
  }
});
*/




document.body.onload = castParallax();