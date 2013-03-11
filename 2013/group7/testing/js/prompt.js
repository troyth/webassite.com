var prompt = {
	selector: null,

	//set up default options
	options: {
		color: '#00FFFF',
		backgroundColor: '#FFFF00',
		fontSize: '58px',
		fontFamily: 'Arial, Helvetica, sans-serif',
		textAlign: 'center',
		backgroundImage: "url('assets/bowery.png')", 
		backgroundSize: 'cover'
	},

	message: {
		text: ""
	},

//should add images and video above?  or can former be handled by background images

	messageIndex: 0,

	init: function(selector){
		prompt.selector = selector;
		console.log('Prompt.Model.intialize() with selector: ' + prompt.selector);

		//apply all of the default css attributes to the selected HTML element
		$(prompt.selector)
			.css('color', prompt.options.color)
			.css('backgroundColor', prompt.options.backgroundColor)
			.css('fontSize', prompt.options.fontSize)
			.css('fontFamily', prompt.options.fontFamily)
			.css('textAlign', prompt.options.textAlign)
			.css('backgroundImage', prompt.options.backgroundImage)
			.css('backgroundSize', prompt.options.backgroundSize);

		//appends the #container with introductory content
	},

	randomBackgroundFlash: function(){
		console.log('randomBackgroundFlash()');
		$(prompt.selector).css('backgroundImage', '');


		var newBG = ['#ff0000', '#ffff00', '#ff00ff', '#00ff00', '#0000ff', '#008000', '#FFA500'];

		var i = 0;

		console.log('pre setInterval');

		var intervalId = setInterval(function(){
			//console.log('*');
			//console.log('set bg with ' + newBG[i]);
			$(prompt.selector).css('backgroundColor', newBG[i]);
			i++;
			if(i >= newBG.length){
				i = 0;
			}
		}, 100);


		console.log('post setInterval');

		console.dir(intervalId);
		return intervalId;

	},

	followColorTimer: function(time, callback){

		//@todo: divide time by 60, figure out minutes and seconds
		var current_time = time;

		var intervalId = setInterval(function(){

			console.log('*');
		
			var minutes = Math.floor( current_time / 60 );
			console.log('min: '+ minutes);
			var seconds = (current_time % 60); 
			
			if(seconds < 10){
				seconds = '0' + seconds;
			}
		
			var newMessage = prompt.message.text + '<div class="timer">' + minutes + ':' + seconds + '</div>';

			prompt.renderMessage( newMessage );

			current_time = current_time - 1;

			console.log('current_time'+ current_time);
			
			if(current_time < 0){
				clearInterval(intervalId);
				callback();
			}
						
		}, 1000);
	

	},

	setMessage: function(index){
		prompt.message = prompt.messages[index];
	},

	//@todo: implement a function to display the message with the current message parameters
	renderMessage: function(message){
		message = message || false;

		if(message == false){
			$('.message .text', prompt.selector).html( prompt.message.text );
		}else{
			$('.message .text', prompt.selector).html( message );
		}
	},

	toggleBackgroundColor: function(firstColor, secondColor, interval, iterations){
		console.log('toggleBackgroundColor()');

		var i = 1;
		var originalColor = $(prompt.selector).css('backgroundColor');

		var intervalID = setInterval(function(){
			//toggle back and forth depending on the value of i
			if(i%2 == 0){
				$(prompt.selector).css('backgroundColor', secondColor);
			}else{
				$(prompt.selector).css('backgroundColor', firstColor);
			}

			i++;
			if(i > iterations){
				$(prompt.selector).css('backgroundColor', originalColor);
				clearInterval( intervalID );
			}
		}, interval);

	},


	messages: [
		{
			text: 'Click Anywhere to Begin the Game'
		},
		{
			text: 'Tap Screen to Pick a color'
		},
		{
			text: 'Follow this Color for:'
		},
		{   
			text: 'Tap Screen for Next Idea'
		},
		{	
			text: 'Tap to Stop Arrow'
		},
		{	
			text: 'Find the Most Pleasent Sound From this Direction and Follow to Source'
		},
		{
			text: 'Get in a Deep Conversation with a Stranger as Fast as Possible'
		},
		{
			text: 'How Did it Go?'
		},
		{
			text: 'Find the Best Way to Leave a Message for Others to Find'
		},
		{
			text: 'Create a New Passageway Through the Urban Fabric'
		}	
		
		
	]
}