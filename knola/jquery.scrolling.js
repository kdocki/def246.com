/**
  * handles the scrolling for the blog
  * I use easeOutBack easing and setTimeout to make it flow better... ^_^
  */
jQuery(document).ready(function () {
 
	// we only scroll in the x-axis (no y allowed)
	jQuery.localScroll.defaults.axis = 'x';
	jQuery.localScroll();
	
	// set the current link up for our users (this is the latest entry)
	var current_entry = 1;
	var zLatest_entry = jQuery("#wsite-content").children().length;
	jQuery("#current-link").attr("href", "#blog_entry_" + zLatest_entry);

	var hoverInterval;
	var delta = 200;
	var iterations = 0;
	var lastScroll = -1;
	
	var totalPageSize = jQuery(document).width();
	var windowRatio = jQuery(window).width() / totalPageSize;
	
	// find out what the hell to scroll ( html or body )
	function init_scroller() {
	
		var tests = ["html", "body", "html body", "html, body"];

		for(var i = 0; i < tests.length; i++)
		{	
			var obj = jQuery(tests[i]);
			var old_pos = obj.scrollLeft();
			obj.scrollLeft(old_pos+1);
			var new_pos = obj.scrollLeft();
			
			if(new_pos != old_pos) 
			{
				//console.log("old,new" + old_pos + "," + new_pos);
				obj.scrollLeft(old_pos);
				//console.log("using " + tests[i] + " as scroller obj");

				return obj;
				
			}
		}

		return jQuery(tests[0]);		// nothing worked?! (I donno what to do?) :/
	}
	
	var scroller = init_scroller();		// not all browsers scroll the same...

	// in case the user re-sizes the window...
	jQuery(window).resize(function() { 
		windowRatio = jQuery(window).width() / totalPageSize;		
	});
	
	function scrolling(direction, delta)
	{
		var thisScroll = scroller.scrollLeft();
		var location_percent = thisScroll / totalPageSize * 100;
		location_percent = Math.round(location_percent + location_percent * windowRatio);

		//console.log("thisScroll,totalPageSize,windowRatio,location_percent" + 
		//			thisScroll + "," + totalPageSize + "," + windowRatio + "," + location_percent);
		
		if(location_percent > 100) location_percent = 100;
		else if(location_percent < 0) location_percent = 0;
		
		// if we run up on a wall then
		// there is no need to scroll any longer
		if(lastScroll != thisScroll)
		{
			lastScroll = thisScroll;
			scroller.stop().animate({"scrollLeft": direction + "=" + delta + "px"}, {
				duration: 1000,
				easing: 'easeOutBack'
			});
			
			hoverInterval = window.setTimeout(function(){
				iterations = iterations + 1;
				scrolling(direction, delta + iterations * 2);
			}, 100);
		} else if(location_percent != 0) location_percent = 100;
		
		// update the percent so the user knows where in the document they are...
		jQuery('.page-percent').each(function(index) {
			jQuery(this).text(location_percent + "%");
		});
	}

	// this is the hovering part of the side scrollers
	jQuery("#navigation-left, #navigation-right").hover(
		function() {
			jQuery("#mouse-hint").hide(1000);
			jQuery(this).stop().fadeTo(700, 0.80);
			var direction;
			if(jQuery(this).attr("id") == "navigation-left") direction = "-";
			else direction = "+";

			
			// hide the lightbox since we are fixing to scroll
			jQuery("#lightbox2-overlay").hide();
			jQuery("#lightbox2").hide();
			
			
			//console.log("going to animate in direction: " + direction);
			scroller.stop().animate({"scrollLeft": direction + "=" + delta + "px"}, 200);
			scrolling(direction, delta);
		},
		function() {
			//console.log("cancelling timeout");
			window.clearTimeout(hoverInterval);
			delta = 200;
			iterations = 0;
			lastScroll = -1;
			jQuery(this).stop().fadeTo(1000, 0);
		}
	);

	// show navigation links to the users for 3 seconds after page starts
	// then fade 'em...
	jQuery("#navigation-left, #navigation-right").delay(3000).fadeTo(100, 0);

	// give users the ability to mouse wheel scroll
	jQuery("html, body").mousewheel(function(event, delta) {
		jQuery("#mouse-hint").hide();
		this.scrollLeft -= (delta * 225);
		event.preventDefault();
	});	// jQuery.mousewheel(...)	
	
	jQuery("#navigation-left, #navigation-right").css("visibility", "visible");
	
	// if this is a mobile device (iPad, android, etc)
	// then we don't need the side scrollers (or mouse hint)
	if(jQuery.browser.mobile == true)
	{
		jQuery("#navigation-left, #navigation-right, #mouse-hint").hide();

	} else {	
	
		// I need to handle the lightbox bug with absolute positioning
		jQuery("a[rel=lightbox]").click(function() {
			
			jQuery("#lightbox2-overlay").show().css("left", jQuery(window).scrollLeft());
			jQuery("#lightbox2").show().css("left", jQuery(window).scrollLeft());
		});				
	}
});	// jQuery.ready();


