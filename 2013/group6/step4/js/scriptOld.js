$(document).ready(function() {
	//declare the total number of images to allow for looping
	var IDX_MAX = 7235;
	var IDX_MIN = 1;


	var xStart, yStart = 0;

	


 
var MAX_HEIGHT = 500;//max bubble height in pixels
 


	/*
	 *	renderBubbles(index)
	 *	
	 *	If bubbles[] has an object at index = idx, then build an html object and append it to the body
	 *
	*/
	function renderBubbles(idx){
		if(bubbles[idx] != undefined){
			var html = '<div class="bubble"' + bubbles[idx].side + '" style="color:' + bubbles[idx].color + '; position:absolute; top:' + bubbles[idx].positiony + '; left:' + bubbles[idx].positionx + '; width:0; height:0;"><div class="text" style="display:none;"">' + bubbles[idx].text + '</div>'+ '<div class="icon"><img src="' + bubbles[idx].icon + '</div>'+'</div>';
	 
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
	function incrementBubbles(){
		console.log('incrementBubbles()');

		$('.bubble').each(function(i){
			var current_width = $(this).css('width');
			var current_height = $(this).css('height');
			var current_left = $(this).css('left');
	 
			if(current_height >= MAX_HEIGHT){
				$(this).children('.text').show();
	 
				if($(this).hasClass('left')){
					var new_left = current_left - 10;
					$(this).css('left', new_left);
	 
					if(new_left < (0 - current_width)){
						$(this).remove();
					}
	 
				}else{
					var new_left = current_left + 10;
					//$(this).css('left', new_left);
	 
					$(this).animate({
						left: new_left
					}, 100);//100ms
	 
					if(new_left > window.innerWidth){
						$(this).remove();
					}
				}
			}else{
				var new_width = current_width + 10;
				var new_height = current_height + 10;
				$(this).css('width', new_width);
				$(this).css('height', new_height);
			}
	 
		});
	 
	}


	function scrollSwap(event){
	    console.log('scrollSwap() called with event: ');//log to the console each time this function is called
	    console.dir(event);

	    var delta = event.wheelDelta;
	    delta = parseInt(delta);

		//get the index of the current image assuming each image will be named cat#.jpg
		var currentSource = $('#target').attr('src');

		console.log('current source: ' + currentSource);

		var startIndex = 10;
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
				var newSource = 'img/Bowery' + newNumber + '.jpg';
				$('#target').attr('src', newSource);

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
				var newSource = 'img/Bowery' + newNumber + '.jpg';
				$('#target').attr('src', newSource);
			}else{
				console.log("congrats you've returned to the beginning!");
			}
	    }

	    if(newNumber != false){
	    	console.log('attempting to call renderBubbles() with newNumber = '+ newNumber);
	    	renderBubbles(newNumber);
	    	incrementBubbles();
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


});