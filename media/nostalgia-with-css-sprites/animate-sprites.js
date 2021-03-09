
var totalNumOfImages = 64;
var sprite = new Array();
var oldClass = new Array();
var xCenter = new Array();
var yCenter = new Array();

function loadSprite(id, x, y)
{
  sprite.push(id);
  oldClass.push("");
  
  if(x == undefined) x = -1;	// -1 means we calculate center each pass
  if(y == undefined) y = -1; 	// in case the center of picture changes
  														// for example, a moving sprite or width changes
  														
  xCenter.push(x);
  yCenter.push(y);
  
  jQuery( document ).mousemove(animateSprites);
}

function animateSprites(event)
{
	var x = event.pageX;
  var y = event.pageY;
  
  for ( var i in sprite )
  {
 		var c = getSpriteClass(sprite[i], i, x, y);
	  setSpriteClass(sprite[i], i, c);
	}
}

function setSpriteClass(s, i, c)
{
  if(oldClass[i] != "") jQuery(s).removeClass(oldClass[i]);
  jQuery(s).addClass(c);
	oldClass[i] = c;
}

function getSpriteClass(s, e, x, y)
{
	var degrees = getSpriteDegree(s, e, x, y);
	var degreeOffset = Math.abs(45 - degrees % 90);
	var numPicsPerQuad = Math.sqrt(totalNumOfImages) * 2;
	
	if(degreeOffset == 0) degreeOffset = 1; 																				// gets rid of a glitch at 45 degree angles 
	var num = Math.floor(numPicsPerQuad - numPicsPerQuad * degreeOffset / 45);

	var row = Math.floor(num / (Math.sqrt(numPicsPerQuad)));
	var col = num % Math.sqrt(numPicsPerQuad);

	if(degrees <= 90) col = col + Math.sqrt(numPicsPerQuad);
	else if(degrees > 180 && degrees <= 270) row = row + Math.sqrt(numPicsPerQuad);
	else if(degrees > 270 && degrees < 360)
	{
		row = row + Math.sqrt(numPicsPerQuad);
		col = col + Math.sqrt(numPicsPerQuad);
	}	
	return "row" + row + " col" + col;
}

function getSpriteDegree(s, e, x, y)
{
	var cx = xCenter[e];
	var cy = yCenter[e];
	
	console.log(s);
	if(cx == -1) cx = jQuery(s).offset().left + jQuery(s).width() / 2;
	if(cy == -1) cy = jQuery(s).offset().top + jQuery(s).height() / 2;
	
	var dx = x - cx;
	var dy = y - cy;
	
  // find the angle of mouse pointer relavant to our picture
  var degrees = 0;
  if(dx != 0) degrees = Math.abs(Math.floor(Math.atan(dy/dx) * 180/Math.PI));
  
  if(x >= cx) { if(y > cy && degrees != 0) degrees = 360 - degrees;	}
  else 
  {
  	if(y < cy) degrees = 180 - degrees;
  	if(y >= cy)	degrees = 180 + degrees;
	}
	
	return degrees;	
}