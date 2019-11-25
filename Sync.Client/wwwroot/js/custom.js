var $window = $(window);
var running = false;
var inView1 = false;
var inView2 = false;

function isScrolledIntoView($elem, $window) {
    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
$(document).on("scroll", function () {
  if (isScrolledIntoView($(".circle"), $window) && !running) {
    running = true;
    $('.circle').circleProgress({
      size: 250,
      value: 1,
      fill: { gradient: ['#3af0c0', '#6c5db8'] },
      animation: {duration: 2200}
    }).on('circle-animation-progress', function(event, progress, stepValue) {
      if (progress == 1) {
        $(this).find('strong').text("∞");
      } else {
        $(this).find('strong').text(String(parseInt(9862 * progress)));
      }
    });
  }
  if (isScrolledIntoView($(".footer"), $window) && !inView1) {
    inView1 = true;
    $('#footerIMG').fadeIn(3000);
  }
  if (isScrolledIntoView($(".header"), $window) && !inView2) {
    inView2 = true;
    $('#headerIMG').fadeIn(3000);
  }
});