
/**
 * author: def246.com
 *
 * I wrote this for my daugther because she was born on a blue moon
 * I wanted to make her something coolish looking, but after I finished
 * a grave thought occured to me. By the time she is old enough to see 
 * this thing and understand it, the technology of that time will probably
 * make this seem much like how my generation looks at cassette tapes and CDs.
 *
 * The will probably have 3D web stuff by that time... and this will be old news
 * but nonetheless, her poem and the words contained within will still ring just 
 * as true ... they are much less affected by time compared to the technology that
 * we consume ever so greedly.
 * 
 */

jQuery(document).ready(function(){

    // parallaxing 
    jQuery('#parallax .parallax-layer').parallax({
        mouseport: jQuery('#parallax')
    });


    // floating leaves animation
    function reset(elem)
    {
        elem.css({
            'top': elem.data('floatdown-original-top'),
            'left': elem.data('floatdown-original-left')
        });

        elem.floatdown({'complete': reset});  
    }

    $('.floatdown').floatdown({'complete': reset});


    // eagle animations
    (function( $ ) {                
        function animateEagle(element, direction, minWait, maxWait)
        {
          element = $(element);

          var amplitude = (Math.ceil(Math.random() * 7));

          var SineWave = function() {
            var padding = 100;
            this.css = function(p) {
              var s = Math.sin(p*amplitude);
              var x = -padding * p + (1-p) * element.parent().width() + padding * (1-p);
              var y = s * 30;

              if(direction == -1) {
                x = element.parent().width() - x;
              }
              return {top: y + "px", left: x + "px"};
            };
          };
          
          element.animate({path : new SineWave()}, 2000, 'swing', function()
          {
            setTimeout(function() {
              animateEagle(element, direction, minWait, maxWait);
            }, minWait + Math.floor(Math.random() * (maxWait - minWait)));
          });
        }

        $('.eagle.flying-right').each(function(index, element) {
          $(element).css('position', 'absolute');
          animateEagle(element, 1, 10000, 20000);
        });  

        $('.eagle.flying-left').each(function(index, element) {
          $(element).css('position', 'absolute');                    
          animateEagle(element, -1, 19000, 30000);
        });  

    })(jQuery);


});
