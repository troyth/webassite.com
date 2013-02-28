/*
	App.js
	Part of the Web as Site course at Columbia University's Graduate School of Architecture, Planning and Preservation
	webassite.com
	group7.webassite.com
	
	[File description]
	[Date]
	[Author]
	[License]
*/

//declare the model and controller outside of the ready loop so it is available to query in the console

//the jQuery ready function: everything inside will be called only after the entire
//DOM is loaded
$(document).ready(function() {
	prompt.init('#container');

	var intvervalId = prompt.randomBackgroundFlash();

 	$('#container').bind('click', function(){ clearInterval(intvervalId); });



});


