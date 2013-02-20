var prompt = {
	selector: null,
	DEFAULT_cycleTime: 1000,

	//set up default options
	options: {
		color: '#000000',
		backgroundColor: '#ffffff',
		fontSize: '36px',
		fontFamily: 'Arial, Helvetica, sans-serif',
		textAlign: 'center'
	},

	message: {
		text: "Click anywhere to begin",
		image: "",
		video: ""
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
			.css('textAlign', prompt.options.textAlign);

		//appends the #container with introductory content

		prompt.refreshMessage();
		$(prompt.selector).bind('click', prompt.begin);
	},

	begin: function(){
		$(prompt.selector).unbind('click');
		prompt.toggleBackgroundColor('red', '#F799A2', 50, 15);
		prompt.message = prompt.messages[messageIndex];
		prompt.refreshMessage();
	},

	//@todo: implement a function to display the message with the current message parameters
	refreshMessage: function(){
		$('.message .text', prompt.selector).html( prompt.message.text );
		$('.message .image', prompt.selector).html( prompt.message.image );
		$('.message .video', prompt.selector).html( prompt.message.video );
	},

	incrementMessage: function(){
		
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
			text: 'starting the game',
			image: '',
			video: ''
		},
		{
			text: 'second message',
			image: '<img src="http://placehold.it/350x150">',
			video: ''
		}
	]
}