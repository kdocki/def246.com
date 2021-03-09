jQuery(function(){
	jQuery("#page-wrap").css('width','auto');
    jQuery("#page-wrap").wrapInner("<table><tr>");
	var counter = 1;    
	var content = jQuery("#wsite-content");
	var current_entry = jQuery("<td class=\"entry\" id=\"entry_" + counter + "\"></td>");
	
	current_entry.prependTo(content);
    content.children().each( function(index) {
		var obj = jQuery(this);
		var tagName = obj.get(0).tagName.toUpperCase();
		
		if(tagName != "TD") {
			if(tagName == "HR" || obj.find("div hr").length > 0){
				counter++;
				current_entry = jQuery("<td class=\"entry\" id=\"blog_entry_" + counter + "\"></td>");
				current_entry.prependTo(content);
				console.log("changing to entry_" + counter);
				obj.remove();
			} else {
				obj.appendTo(current_entry);
				console.log("appending " + tagName + " to entry_" + counter);
			}
		}
	});
	
	current_entry.remove();
});