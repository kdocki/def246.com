
(function($){

	var images_not_yet_loaded;
	var canvas;
	function _internet_explorer_refresh()
	{
		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
			images_not_yet_loaded--;
			if(images_not_yet_loaded == 0) canvas.collage();
		}
	}

	/**
	  * Global debug function I can turn on and off
	  * by just commenting one line
	  *
	  */
  	var verbosity = 5;
	function _debug(str, lvl) {
		if(lvl >= verbosity) console.log(str);
	}


	/**
	  * Gives a random integer between min and max values
	  *
	  */
	function _random(min, max)
	{
		min = Math.ceil(min);
		max = Math.ceil(max);

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	  * Returns the left position for the image based
	  * on the history of the last column
	  *
	  */
	function _getLeft(last, img)
	{
		if(last.length <= 0) return img.left;

		// assume at least 1 element in last column
		var min_left = 10000000;

		// look at all the other elements
		for(var i = 0; i < last.length; i++)
		{

			// if the img.top is between the range then we should look at those last images
			if( last[i].top <= img.top + img.height )
			{
				var value = last[i].left + last[i].width;
				if(min_left > value) min_left = value;
			}
		}

		return Math.ceil(min_left);
	}

	/**
	  * Function could be used to monitor last column to
	  * adjust the top position, but currently it just returns
	  * the top given to it... might change in future
	  *
	  */
	function _getTop(last, min_top)
	{
		// look at the tops of _last column
		if(last.length > 0){}

		return Math.ceil(min_top);
	}


	/**
	  * My ImageData class which helps me handle the images
	  * like keeping up with widths and tops and re-positioning
	  * for easy code readability below in my jquery collage function
	  *
	  */
	function ImageData(obj)
	{
		if(obj != undefined) {

			// public variables of this class
			this.width = Math.ceil(obj.width());
			this.height = Math.ceil(obj.height());
			this.top = Math.ceil(obj.offset().top);
			this.left = Math.ceil(obj.offset().left);
			this.image = obj;

			// some functions for this class
			this.reposition = function() {

				// change the image offset
				this.image.offset({
					left: Math.ceil(this.left),
					top: Math.ceil(this.top)
				});

				_debug("{ top: " + this.top + ", left: "
								 + this.left + ", width: "
								 + this.width + ", height: "
								 + this.height + "}", 1);

			}
		}
	}


	/**
	  * The collage method creates a square-like collage
	  * of images randomly positioned inside the canvas
	  *
	  * The canvas should probably have some style, i.e.
	  *
	  *		 <div style="width:700px; height: 300px;
	  *					 overflow: hidden; position: relative;
	  *					 visibility: hidden;" class="canvas">
	  *			<img src="1.jpg" />
	  *			<img src"2.jpg" />
	  *			...
	  *			<img src="N.jpg" />
	  *		 </div>
	  *
	  * This way, it will not show up until after all the images inside the
	  * canvas have loaded up (you should use window.load and not document.load)
	  *
	  *		jQuery(window).load(function() { jQuery('div.canvas').collage(); });
	  *
	  */
	$.fn.collage = function(options) {

		// defaults for the collage maker
		var defaults = {
			balloonWidth: null,
			balloonPosition: "null",
			balloonTip: 15,
			balloonDelay: 500,
			sizeMultiplier: .9,
			numberOfImages: -1
		};

		// we combine the collage options here
		var options = $.extend(defaults, options);

		// set the global variables to the number of images we have in this set
		// and also the canvas we are working with, so we can make a callback refresh in IE
		images_not_yet_loaded = options.numberOfImages;
		canvas = $(this);

		// for each selected element we apply this function
		// in case there are multiple elements we want to transform into collages
		return this.each(function() {

			var obj = $(this);

			// we have to fit all our images within this area...
			// we can resize the images inside this canvas and position them
			// but we must remain inside the canvas...
			var canvas_width = obj.width();
			var canvas_height = obj.height();
			//var canvas_ratio = canvas_height / canvas_width;
			var canvas_ratio = canvas_width / canvas_height;
			//var canvas_ratio = canvas_height / (canvas_width + canvas_height)

			// ---- randomly re-order some images! ------------------------------
			var grp = obj.children();
			var cnt = grp.length;
			var temp, x;

			if(cnt > 0)
			{
				var original_left = Math.floor($(grp[0]).offset().left);
				var original_top = Math.floor($(grp[0]).offset().top);

				_debug("original_left: " + original_left + ", original_top: " + original_top, 3);

				for (var i = 0; i < cnt; i++) {
					temp = grp[i];
					x = Math.floor(Math.random() * cnt);
					grp[i] = grp[x];
					grp[x] = temp;
				}

				$(grp).remove();
				obj.append($(grp));
			}
			// ------------------------------------------------------------------


			// we need to restrict the size of our images
			var remaining_height = canvas_height;

			var _last = new Array();
			var _this = new Array();

			// find all the images inside of the canvas, we are going to manipulate them
			var images = obj.find("img");

			// if there is no images in the canvas
			// then any futher work is futile
			var image_current = 1;
			var image_count = images.length;
			if(image_count == 0) return;

			var average_area = Math.sqrt(canvas_height * canvas_width / image_count);

			// calculate min height for pictures
			var min_height = Math.ceil(average_area * canvas_height/canvas_width + canvas_width/canvas_height);
			if(min_height > canvas_height) min_height = Math.ceil(canvas_height / 2);

			// calculate max height for pictures
			var max_height = Math.ceil(average_area * canvas_width/canvas_height);
			if(max_height > canvas_height) max_height = canvas_height;
			//Math.ceil(canvas_height * canvas_height / (canvas_width + canvas_height));

			// just in case (JIC) we swap the min and max if they are reversed
			if(max_height < min_height)
				min_height = -(max_height = (min_height += max_height) - max_height) + min_height;

			// setup the display to show the image at max size
			if(options.balloonWidth == null) options.balloonWidth = max_height + 100;

			_debug("min_height: " + min_height + ", max_height: " + max_height, 2);

			// Iterate through the images to determine some stats about our collection
			images.each(function(index) {

				// create an alias for readability
				var image = $(this);

				// set the image position to absolute and image border stuff
				image.css("position", "absolute"); image.css("border", "1px solid black");

				// let's resize this image
				image.aeImageResize({ height: _random(min_height, max_height), callback: _internet_explorer_refresh });

				// ------ see if we need to go to next column --------------

				// if the image height is bigger than the canvas height
				// then 2 possible scenarios...
				// 1) move this image to the next column and we expand previous image
				// 2) shrink the current image down (if remaining height > min_height)
				if(image.height() > remaining_height)
				{
					if(remaining_height > min_height)
						image.aeImageResize({ height: remaining_height });
					else {
						// since our random never grows larger than canvas_height
						// we should never have just 1 image in _this at this point
						var l = _this.length - 1;
						var grow = remaining_height + _this[l].height;

						_this[l].image.aeImageResize({ height: grow });
						_this[l].width = _this[l].image.width();
						_this[l].height = _this[l].image.height();

						remaining_height = 0;	// force this image to the next column
					}

				}

				// switch to the next column on canvas if we are out of room vertically
				if(remaining_height <= 0)
				{
					// copy _this array to _last array
					_last = new Array();
					for(var i = 0; i < _this.length; i++)
						_last.push(new ImageData(_this[i].image));

					// empty out _this array!
					_this = new Array();

					// reset the remaining_height
					remaining_height = canvas_height;
					_debug("-------------------------------", 1);
				}


				// ------- Now we actually position the image ---------------

				// push this re-sized image to _this column
				var x = new ImageData(image); _this.push(x);

				// get the index of the image
				var i = _this.length - 1;

				// used in case we do freshes...
				_this[i].top = original_top;
				_this[i].left = original_left;
				_this[i].reposition();

				// move the image down if it is not the first image in the column
				if(i > 0) _this[i].top = _getTop(_last, _this[i-1].height + _this[i-1].top);

				// move the image over given the history of the _last column
				_this[i].left = _getLeft(_last, _this[i]);

				// put the image where it needs to be
				_this[i].reposition();

				// ----------- Finished positioning the image ----------------


				// subtract the height from the remaining height
				remaining_height -= _this[i].height;


				// ------------ Adding some visual effects to the collage ----

				// image.balloon({		// puts a balloon with the "blown up" image (get it... cuz it's a balloon?)
				// 	contents: '<img class="balloonImage" src="' + image.attr("src") + '" width="' + options.balloonWidth + '" />',
				// 	position: options.balloonPosition,
				// 	tipSize: options.balloonTip,
				// 	minLifetime: 0,
				// 	showDuration: options.balloonDelay,
				// 	hideDuration: 0,
				// 	css: { opacity: "1" }
				// });

				image.hover(	// change border color on hover
					function () { $(this).css({ border: "2px white solid" }); },
					function () { $(this).css("border", "1px black solid");
				});

				// if lightbox plugin is being used, then we gladly utilize it!
				//if(typeof Lightbox !== 'undefined')
				//	image.wrap('<a href="' + image.attr("src") + '" rel="lightbox" />');

				image_current++;
			});


			obj.css("visibility", "visible");
			obj.css("cursor", "pointer");
			$('.balloonImage').parent().css("display", "none");

		});
	};

})(jQuery);
