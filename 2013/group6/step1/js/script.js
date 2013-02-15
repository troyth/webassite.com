$(document).ready(function() {
	//declare the total number of images to allow for looping
	var IDX_MAX = 5;


	/*
	 *	scrollSwap()
	 *	
	 *	A function that replaces the src attribute of the #target img in the index.html file
	 *
	 *	@todo: 	need to stop it from scrolling down the page slowly, and to invoke directionality
	 *
	 */
	function scrollSwap(event){
		console.log('scrollSwap() called');//log to the console each time this function is called

		//get the index of the current image assuming each image will be named cat#.jpg
		var idx = $('#target').attr('src');
		idx = idx.substr(7,1);
		idx = parseInt(idx);

		//increment the index
		idx++;
		console.log('new idx: '+ idx);//print out the new index

		//if the index is largest 
		if(idx > IDX_MAX){
			idx = 1;
		}

		//construct the new source string
		var src = 'img/cat' + idx + '.jpg';

		//swap the image for the next
		$('#target').attr('src', src);

	}

	//the wrapper div needs to be bigger than the screen so scroll can be invoked
	$('.wrapper').height(window.innerHeight + 100);

	//bind the scrollSwap function to a scroll event
	$(window).bind('scroll', scrollSwap);
});