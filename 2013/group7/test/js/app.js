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


	//PROMPT 1
	var intervalID;
	function prompt2(){
		prompt.setMessage(1);
		prompt.renderMessage();
		intervalID = prompt.randomBackgroundFlash();
		$(prompt.selector).unbind('click');

		$(prompt.selector).bind('click', prompt3);

	}

	$(prompt.selector).bind('click', prompt2);


	//PROMPT 2
	function prompt3(){
		clearInterval(intervalID);
		prompt.setMessage(2);
		prompt.renderMessage();
		prompt.followColorTimer(5, prompt4);
	}

 	//PROMPT 3
 	function prompt4(){
 		console.log('prompt4');
 	}



});


