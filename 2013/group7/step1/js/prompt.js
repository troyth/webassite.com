var prompt = {
	selector: null,
	DEFAULT_cycleTime: 1000,

	//set up default options
	options: {
		color: '#00FFFF',
		backgroundColor: '#FFFF00',
		fontSize: '36px',
		fontFamily: 'Arial, Helvetica, sans-serif',
		textAlign: 'center'
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
			.css('textAlign', prompt.options.textAlign);

		//appends the #container with introductory content
	},

	randomBackgroundFlash: function(){

		var newBG = ['#ff0000', '#ffff00', '#ff00ff', '#00ff00'];
		var i = 0;

		var intervalId = setInterval( function(){
			$(prompt.selector).css('backgroundColor', newBG[i]);
			i++;
			if(i > newBG.length){
				i = 0;
			}
		}, 200 );

		return intervalId;

	},

	chooseColor: function(){


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
			text: 'Click screen to choose color'
		},
		{
			text: 'Follow color in background for 5 minutes'
		}
	]
}