/**
 * author: def246.com
 * 
 * I wrote this to animate some falling leaves on a tree
 * in a parallax experiment I made using a bluemoon picture.
 * My daughter was born on a blue moon so I really liked the picture
 * and made the page sort of for her (and to learn how to parallax and
 * bring in some custom animations using jquery)
 */
(function( $ ) {
  $.fn.floatdown = function(options) {
    var settings = $.extend( {
      'sway': 100,              // a sway is how much the falling object
      'swayDx': -5,             // change our sway no more than this every iteration
      'minHeightDown': 15,      // the minimum distance in px we travel down each iteration
      'maxHeightDown': 55,      // the max distance in px we travel down each iteration      
      'animateTime': 1200,      // time between animations
      'easing': 'swing',        // easing the animation will use
      'minSway': 25,            // goes back and forth in the x-axis
      'changeDirection': true,  // determines if object goes left or right first
      'direction': 1,           // this object will sway right if 1, left if -1
      'spaceApart': 1500,       // we can start falling objects at different times
      'startAngle': 90,         // we can adjust the bezier animation but we should
      'endAngle': 0,            // probably leave these things alone
      'endLength': 0.25,        // another tweak to bezier curve path
      'complete': function(e){} // this closure is called once we finish animating the floatdown        
    }, options);
    
    var animateFloatDown = function(element, direction, sway)
    {
      element = $(element);
      
      if(sway < settings.minSway) {
        sway = settings.minSway;
      }
      
      var dx = element.position().left;
      var dy = element.position().top;      
      var params = {
        start: { 
          x: dx,
          y: dy, 
          angle: settings.startAngle * direction
        },  
        end: {
          x: dx + sway * direction,
          y: (dy + settings.minHeightDown + Math.floor((Math.random() * (settings.maxHeightDown - settings.minHeightDown)))),
          angle: settings.endAngle, 
          length: settings.endLength
        }
      };
      
      // animate the floating object      
      element.animate({path : new $.path.bezier(params)}, settings.animateTime, settings.easing, function()
      {
        var maxheight = $(element).parent().height();
        if(element.position().top < maxheight) {
          animateFloatDown(element, direction * -1, sway + Math.floor(Math.random() * settings.swayDx));
        }
        else {
          settings.complete(element);
        }
      });
    };
    
    var timeout = 0 - settings.spaceApart;
    
    return this.each(function() {   
      var element = $(this);
      
      setTimeout(function() {
        if(settings.changeDirection) {
          settings.direction *= -1;  
        }
        
        element.attr('data-floatdown-original-left', element.position().left);
        element.attr('data-floatdown-original-top', element.position().top);
        
        animateFloatDown(element, settings.direction, settings.sway);
      }, timeout += settings.spaceApart);

    });
  };
})( jQuery );