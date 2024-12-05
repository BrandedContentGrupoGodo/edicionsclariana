$(document).ready(function() {
  var countdown_init = false;

  var eventTime = moment(event_date, 'YYYY-MM-DD HH:mm:ss');

  var currentTimeInEventGmt = moment().utcOffset(event_gmt);
  var currentTime = moment(currentTimeInEventGmt.format("YYYY-MM-DD HH:mm:ss"));

  var duration = moment.duration(eventTime.diff(currentTime));
  var interval = 1000;

  // if time to countdown
  if(duration > 0) {
    
    setInterval(function(){
        duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
        var d = moment.duration(duration).days();
        var h = moment.duration(duration).hours();
        var m = moment.duration(duration).minutes();
        var s = moment.duration(duration).seconds();
        var mm = moment.duration(duration).months();
        var a = moment.duration(duration).years();

        if (a > 0){
          mm = mm + (a*12);
        }

        a = $.trim(a).length === 1 ? '0' + a : a;
        mm = $.trim(mm).length === 1 ? '0' + mm : mm;
        d = $.trim(d).length === 1 ? '0' + d : d;
        h = $.trim(h).length === 1 ? '0' + h : h;
        m = $.trim(m).length === 1 ? '0' + m : m;
        s = $.trim(s).length === 1 ? '0' + s : s;

        $(".cd-months").text(mm+'m');
        $(".cd-days").text(d+'d');
        $(".cd-hours").text(h+'h');
        $(".cd-minutes").text(m+'m');
        $(".cd-seconds").text(s+'s');
        
        //$(".countdown-num.cd-years").text(a);
        $(".countdown-num.cd-months").text(mm);
        $(".countdown-num.cd-days").text(d);
        $(".countdown-num.cd-hours").text(h);
        $(".countdown-num.cd-minutes").text(m);
        $(".countdown-num.cd-seconds").text(s);

        if (!countdown_init){
          if (a=='0' || a=='00' || a==0){
            //$(".cd-box-years").fadeOut(0);
          }
          $(".about_count > div:first-child").fadeIn(100);
          $(".about_count .countdown").fadeIn(100);
          $(".countdown-box").fadeIn(100);
          countdown_init = true;
        }
      }, interval);
      
  }else{
    $(".cd-box").fadeOut(100);
  }


});