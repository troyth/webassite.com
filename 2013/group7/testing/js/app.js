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

	//BEGIN
	prompt.init('#container');
	prompt.setMessage(0);
	prompt.renderMessage();

	$('#container').rotate('30deg');


	//PROMPT 1 - user has begun game, random colors now flashing
	var intervalID;
	
	function prompt2(){
		console.log('prompt2()');
		prompt.setMessage(1);
		prompt.renderMessage();
		intervalID = prompt.randomBackgroundFlash();
		$(prompt.selector).unbind('click');

		$(prompt.selector).bind('click', prompt3);

	}

	$(prompt.selector).bind('click', prompt2);

//prob don't need to keep clearing interval id

	//PROMPT 2 - user has chosen a color, and the countdown is happening
	function prompt3(){
		console.log('prompt3()');
		clearInterval(intervalID);
		prompt.setMessage(2);
		prompt.renderMessage();
		prompt.followColorTimer(200, prompt4);
	}
	

 	//PROMPT 3 - Once time was out, criss-cross screen should be happening...
 	function prompt4(){
 		console.log('prompt4()');
 		//clearInterval(intervalID);
 		prompt.setMessage(3);
 		prompt.renderMessage();
 		$(prompt.selector).unbind('click');

		$(prompt.selector).bind('click', prompt5);

	}




	//PROMPT 4 - User has tapped screen, and now arrow is spinning
	


	//PROMPT 5 - User has tapped arrow - now telling to find the most pleasent sound
	function prompt5(){
		clearInterval(intervalID);
		prompt.setMessage(5);
		prompt.renderMessage();
	}
		
	
	//PROMPT 6 - ??Is check box the same as the next message?? (deep convo with stranger)
	

});


