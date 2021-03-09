/*
 * filename: 	weebly.google.plus.js
 * author: 		K.D. 
 * website: 	def246.com
 * description:
 * 				Dynamically searches through your Weebly blog and adds a Google +1 button 
 *		 		for each post that you have...
 * 	
 *
 * NOTE: if weebly changes their identifiers or pattern then this won't work anymore...
 * currently the pattern seems to be "blog-post" -> "blog-header" -> "blog-title"
 *
 */

// Event.observe(window, 'load', function() {

// 	// looks for pattern "blog-post" -> blog-header" -> "blog-title"
// 	function findPatternIn(elmt) {
// 		var url = undefined;
		
// 		if(elmt.hasClassName("blog-post")) 
// 			elmt.childElements().each(function(child){
// 				if(child.hasClassName("blog-header"))
// 					child.childElements().each(function(grandchild) {
// 						if(grandchild.hasClassName("blog-title")) {
// 							url = grandchild.firstDescendant();				//.readAttribute('href');
// 							throw $break;
// 						}
// 					});	
			
// 				if(url != undefined) throw $break;
// 			});

// 		return url;
// 	}	


// 	// returns a url from a specific "blog-social" element
// 	function getUrlFrom(elmt) {
	
// 		var url = undefined;
			
// 		// search all your ancestor's children for the URL
// 		elmt.ancestors().each(function(child) {
// 			url = findPatternIn(child);
// 			if(url != undefined) throw $break;
// 		});
				
// 		return url;
// 	}

	

// 	$$('.blog-social').each(function(elmt) { 
	
// 		// get your weebly url for this post so we can pass this to <g:plusone>
// 		url = getUrlFrom(elmt);

// 		// for debugging!
// 		// console.log(url);
		
// 		if(url != undefined) {
// 			elmt.insert( { bottom: '<g:plusone href="' + url + '" size="small"></g:plusone>' } );
// 		}
		
// 	});

// 	// we want the float to apply to our google+ so we get it all on 1 line (looks prettier)
// 	$$('.blog-social div[style="clear:both"]').each(function(elmt) {
// 		elmt.style.clear = 'none';
// 	});
// });
