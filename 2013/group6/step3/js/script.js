var TRANSLATE_BUBBLE_INTERVAL_IN_PIXELS = 20;
var GROW_BUBBLE_INTERVAL = 20;

$(document).ready(function() {
	//declare the total number of images to allow for looping
	var IDX_MAX = 7235;
	var IDX_MIN = 1;




	var xStart, yStart = 0;

	

	function prepareBackground(){
		$('#wrapper').width( window.innerWidth ).height( window.innerHeight);
	}

	prepareBackground();


 
	var MAX_HEIGHT = 278;//max bubble height in pixels
 


	/*
	 *	renderBubbles(index)
	 *	
	 *	If bubbles[] has an object at index = idx, then build an html object and append it to the body
	 *
	*/
	function renderBubbles(idx){
		if(bubbles[idx] != undefined){

			//@todo: add icons
			var html = '<div id="index-' + idx +  '" class="bubble ' + bubbles[idx].side + '" style="color:' + bubbles[idx].color + '; position:absolute; top:' + bubbles[idx].positiony + 'px; left:' + bubbles[idx].positionx + 'px; width:100px; height:100px; background:transparent ' + bubbles[idx].src + ' no-repeat 0 0; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;"><div class="text" style="display:none;">' + bubbles[idx].text + '</div>'+ '<div class="icon"><img src="' + bubbles[idx].icon + '</div>'+'</div>';
	 
			$('#bubbles').append( html );

			return true;
		}else{
			return false;
		}
	}
 

 
 	/*
	 *	incrementBubbles()
	 *	
	 *	If bubbles[] has an object at index = idx, then build an html object and append it to the body
	 *
	*/
	function incrementBubbles(frameIndex){
		console.log('incrementBubbles()');

		$('.bubble:not(.off)').each(function(i){
			var current_width = parseInt( $(this).css('width') );
			var current_height = parseInt( $(this).css('height') );
			var current_left = parseInt( $(this).css('left') );

			console.log('');
			console.log('*******BUBBLES*******');
			console.log('width: '+ current_width + ' height: ' + current_height + ' left: ' + current_left);
	 
			if(current_height >= MAX_HEIGHT){
				$(this).children('.text').show();
	 

				if($(this).hasClass('left')){//translate to the left after full size
					var new_left = current_left - TRANSLATE_BUBBLE_INTERVAL_IN_PIXELS;
					$(this).css('left', new_left);

					/*
					$(this).animate({
						left: new_left
					}, 100);//100ms
					*/
	 
					if(new_left < (0 - current_width)){
						//$(this).remove();
						$(this).addClass('off');
						$(this).addClass('frame-'+frameIndex);
					}
	 
				}else{//translate to the right after full size
					var new_left = current_left + TRANSLATE_BUBBLE_INTERVAL_IN_PIXELS;
					//$(this).css('left', new_left);
	 	
					$(this).animate({
						left: new_left
					}, 100);//100ms
	 
					if(new_left > window.innerWidth){
						$(this).remove();
					}
				}
			}else{
				var new_width = current_width + GROW_BUBBLE_INTERVAL;
				var new_height = current_height + GROW_BUBBLE_INTERVAL;
				$(this).css('width', new_width);
				$(this).css('height', new_height);
			}
		});
	}


	function reenterBubbles(frameIndex){
		$('.bubble.off').each(function(){
			var classes = $(this).attr('class');
			var classes_array = classes.split(' ');

			var frame_i = -1;

			for(var i = 0; i < classes_array.length; i++){
				if( classes_array[i].indexOf('frame-') >= 0 ){
					frame_i = i;
				}
			}

			var reentryFrame = classes_array[frame_i].substr(6);
			reentryFrame = parseInt( reentryFrame );

			if( reentryFrame == frameIndex ){
				$(this).removeClass('off');
				$(this).addClass('reenter');
			}
		});
	}

	function decrementBubbles(frameIndex){
		$('.bubble.reenter').each(function(){
			var id = $(this).attr('id');
			id = id.substr(6);
			id = parseInt( id );

			var originalX = bubbles[id].positionx;

			var current_left = parseInt( $(this).css('left') );

			if( current_left == originalX ){//start to shrink
				//@todo: shrink the width and height by GROW_BUBBLE_INTERVAL value each scroll event

				//@todo: once width or height <= 0, do:
				//$(this).remove();

			}else{//continue to translate
				if( $(this).hasClass('left') ){
					var new_left = current_left + TRANSLATE_BUBBLE_INTERVAL_IN_PIXELS;
					$(this).css('left', new_left);
				}else{
					var new_left = current_left - TRANSLATE_BUBBLE_INTERVAL_IN_PIXELS;
					$(this).css('left', new_left);
				}
			}
		});

	}


	function scrollSwap(event){
	    console.log('scrollSwap() called with event: ');//log to the console each time this function is called
	    console.dir(event);

	    var delta = event.wheelDelta;
	    delta = parseInt(delta);

		//get the index of the current image assuming each image will be named cat#.jpg
		//var currentSource = $('#target').attr('src');

		var currentSource = $('#wrapper').css('backgroundImage');

		currentSource = currentSource.replace(/\(|\)/g, "");
		var temp_array = currentSource.split('/');
		currentSource = temp_array.pop();

		console.log('current source: ' + currentSource);

		var startIndex = 6;
		var endIndex = currentSource.lastIndexOf('.');
		var currentNumber = currentSource.substring(startIndex, endIndex);


		console.log('currentNumber: ' + currentNumber);

		currentNumber = parseInt(currentNumber);
		var newNumber = false;
		
		if(event.wheelDelta < 0){
	    	//move forwards
	    	//if the index is largest 
			if(currentNumber < IDX_MAX){
				newNumber = currentNumber + 1;
				console.log('newNumber: ' + newNumber);

				//construct the new source string
				var newSource = "url('img/Bowery" + newNumber + ".jpg')";
				$('#wrapper').css('backgroundImage', newSource);

				renderBubbles(newNumber);
				incrementBubbles(newNumber);
			}else{
				console.log("congrats you've walked the bowery!");
			}
	    }else{
	    	//move backward
	    	//if the index is largest 
			if(currentNumber > IDX_MIN){
				var newNumber = currentNumber - 1;
				console.log('newNumber: ' + newNumber);

				//construct the new source string
				var newSource = "url('img/Bowery" + newNumber + ".jpg')";
				$('#wrapper').css('backgroundImage', newSource);

				reenterBubbles(newNumber);
				decrementBubbles(newNumber);
			}else{
				console.log("congrats you've returned to the beginning!");
			}
	    }

		
    	return false;
	}



	window.onload = function(){
	    //adding the event listerner for Mozilla
	    if(window.addEventListener){
	        document.addEventListener('DOMMouseScroll', scrollSwap, false);
	    }

	    //for IE/OPERA/chrome/safari etc
	    document.onmousewheel = scrollSwap;
	}


	//@todo: set negative margins on top and left to center bubbles on their points



});