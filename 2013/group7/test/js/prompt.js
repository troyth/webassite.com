var prompt = {
	selector: null,

	//set up default options
	options: {
		color: '#00FFFF',
		backgroundColor: '#FFFF00',
		fontSize: '36px',
		fontFamily: 'Arial, Helvetica, sans-serif',
		textAlign: 'center',
		backgroundImage: "url('assets/bowery.png')",
		backgroundSize: 'cover'
	},

	message: {
		text: ""
	},

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
		$(prompt.selector).css('backgroundImage', '');

		//@todo: add/change colors
		var newBG = ['#ff0000', '#ffff00', '#ff00ff', '#00ff00', '#0000ff'];

		var i = 0;

		var intervalId = setInterval( function(){
			$(prompt.selector).css('backgroundColor', newBG[i]);
			i++;
			if(i > newBG.length){
				i = 0;
			}
		}, 200 );

		console.dir(intervalId);
		return intervalId;

	},

	followColorTimer: function(time, callback){

		//@todo: divide time by 60, figure out minutes and seconds
		var current_time = time;

		var intervalId = setInterval(function(){

			var newMessage = prompt.message.text + '<div class="timer">' + current_time + '</div>';

			prompt.renderMessage( newMessage );

			current_time = current_time - 1;

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
			text: 'Click anywhere to begin'
		},
		{
			text: 'Tap screen to pick a color'
		},
		{
			text: 'Follow this color for'
		}
	]
}