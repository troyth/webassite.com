$(document).ready(function() {
 	// The DOM has been loaded

 	console.log('ready');


 	var newImage = "assets/rainbow.jpg";

 	var cloudsImage = "assets/clouds.jpg";


 	function swapImage(nImage){
 		console.log('HELLO! we just called swapImage()');
 		console.log('again!');

 		var jeremy = "jeremy";

 		$('#cat-image').attr("src", nImage);

 	}


 	console.log("jeremy's name is " + jeremy);


 	swapImage(newImage);


 	swapImage(cloudsImage);







});