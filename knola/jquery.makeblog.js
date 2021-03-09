/**
  * This creates the entries from just plain ol html objects (POHOs) from Weebly 
  */
jQuery(function(){

	// adds in the social networking links for each entry...
	// probably a bit over kill if not many people look at the site...
	function add_social_networking(current_entry)
	{
		/*
		var entry_id = current_entry.attr("id");
		var twitter = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://knola.weebly.com/#' + entry_id + '" data-via="kdocki">Tweet</a>';

		jQuery("<div class=\"social-container\">" + twitter + "</div>").appendTo(current_entry);
		*/
	}
	
	jQuery("#page-wrap").css('width','auto');
    jQuery("#page-wrap").wrapInner("<div id=\"wrapper-container\" class=\"draggable\"><table><tr>");
	var counter = 1;    
	var content = jQuery("#wsite-content");
	var current_entry = jQuery("<td class=\"entry\" id=\"blog_entry_" + counter + "\"></td>");
	
	current_entry.prependTo(content);
    content.children().each( function(index) {
		var obj = jQuery(this);
		var tagName = obj.get(0).tagName.toUpperCase();
		
		if(tagName != "TD") {
			if(obj.find("div hr").length > 0 && obj.find("div hr").hasClass("finished") ){
			
				add_social_networking(current_entry);

				counter++;				
				current_entry = jQuery("<td class=\"entry\" id=\"blog_entry_" + counter + "\"></td>");
				current_entry.prependTo(content);
				
				//console.log("changing to entry_" + counter);
				
				obj.remove();
			} else {
				obj.appendTo(current_entry);
				
				//console.log("appending " + tagName + " to entry_" + counter);
			}
		}
	});
	
	current_entry.remove();
	
	// re-order the IDs in the list... it is backwards... X_x
	// we want to swap 1,n, 2,n-1, ... 3,n-2, etc
	var first = 1;
	var last = content.children().length;
    content.children().each( function(index) {
		var obj = jQuery(this);
		//console.log(first + " " + last);
		if(first < last)
		{
			//console.log("swapping " + obj.attr("id") + "[" + last + "] with " + first);
			obj.attr("id", "blog_entry_temp");
			jQuery("#blog_entry_" + first).attr("id", "blog_entry_" + last);
			obj.attr("id", "blog_entry_" + first);
			
			first++;
			last--;
		} else return false;
	});


	// the footer needs to be shown to users...
	// I hide it so it doesn't show up in the weebly blog
	jQuery(document).ready(function () {	
		jQuery("#footer").css("visibility", "visible");
		//alert(navigator.userAgent);
		//alert(navigator.vendor);
		//alert(window.opera);
		
		// take them to the right place...
		//jQuery("html, body").delay(200).scrollTo("#start-here", 1000);

	});
	
});