$(document).ready(function() {
	var MAX_ZOOM_LEVELS = 3;//the number of zoom levels supported

	/*
	 *	zoomIn()
	 *	
	 *	A function that replaces the src attribute of the #image img in the index.html file
	 *
	*/
	function zoomIn(){
		console.log('zoomIn() called');//log to the console each time this function is called

		//get the index of the current image assuming each image will be named cat#.jpg
		var idx = $('#image img').attr('src');
		idx = idx.substr(7,1);
		idx = parseInt(idx);

		console.log('idx')

		//only increment if within maximum zoom level 
		if(idx < MAX_ZOOM_LEVELS){
			//increment the index
			idx++;
			console.log('new idx: '+ idx);//print out the new index
		}

		//construct the new source string
		var src = 'img/cat' + idx + '.jpg';

		//swap the image for the next
		$('#image img').attr('src', src);
	}


	/*
	 *	zoomOut()
	 *	
	 *	A function that replaces the src attribute of the #image img in the index.html file
	 *
	*/
	function zoomOut(){
		console.log('zoomOut() called');//log to the console each time this function is called

		//get the index of the current image assuming each image will be named cat#.jpg
		var idx = $('#image img').attr('src');
		idx = idx.substr(7,1);
		idx = parseInt(idx);

		//only decrement if greater than 1
		if(idx > 1){
			//decrement the index
			idx--;
			console.log('new idx: '+ idx);//print out the new index
		}

		//construct the new source string
		var src = 'img/cat' + idx + '.jpg';

		//swap the image for the next
		$('#image img').attr('src', src);
	}

	//bind the #zoom-in anchor to the zoomIn() function on click
	$('#zoom-in').bind('click', zoomIn);

	//bind the #zoom-out anchor to the zoomOut() function on click
	$('#zoom-out').bind('click', zoomOut);


});
