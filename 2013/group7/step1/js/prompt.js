/*
	Prompt.js
	Part of the Web as Site course at Columbia University's Graduate School of Architecture, Planning and Preservation
	webassite.com
	group7.webassite.com
	
	[File description]
	[Date]
	[Author]
	[License]
*/


//initialize the Prompt object which will later be extend with Model and perhaps View, Controller, etc.
var Prompt = {};



/****************************************************************************************
*****************************************************************************************
	Model

	The model is the javascript object that will hold the attribute values for the selected
	HTML element to be updated with prompts. It will be controlled, eventually, by a
	controller.
*/

/*
 *	STEP 1: Create the Prompt model
 *	
 *	Create the Prompt model to be extended with the minimum necessary variables and the
 *	required parameter to construct the object.
 *
 *	selector: the selector of the HTML element to display prompts
 *
 *	@todo: 	nothing
 *
 */
var Model = Prompt.Model = function(selector){
	this.selector = selector;
}

/*
 *	STEP 2: Extend the Prompt model
 *	
 *	Use the Underscore.js _.extend(object, extension) function to extend the attributes 
 *	and methods of the Prompt model.
 *
 *	@todo: 	add additional attributes and methods for controlling the DOM with prompts
 *
 */
_.extend(Model.prototype, {
	//declare default attributes
	color: '#FF0000',
	backgroundColor: '#FFFFFF',
	fontSize: '36px',
	fontFamily: 'Arial, Helvetica, "Helvetica Neue", sans-serif',
	textAlign: 'center',

	//call this function to intialize the main content container
	initialize: function(){
		console.log('Prompt.Model.intialize() with selector: ' + this.selector);

		//apply all of the default css attributes to the selected HTML element
		$(this.selector)
			.css('color', this.color)
			.css('backgroundColor', this.backgroundColor)
			.css('fontSize', this.fontSize)
			.css('fontFamily', this.fontFamily)
			.css('textAlign', this.textAlign);

		//need to bind *this* to all the functions below so it can be accessed when called
		//uses the _.bindAll() function from Underscore.js: http://underscorejs.org/#bindAll
		_.bindAll(this, 'alert', 'toggleBackgroundColor');
	},

	//a sample function for altering the DOM
	alert: function(msg){
		console.log('Prompt.Model.alert() called with message: ' + msg);

		var message = (msg != undefined) ? msg : 'default message';
		$(this.selector).text(message);
	},

	//a more complex sample function for altering the DOM
	toggleBackgroundColor: function(f, s, i){
		console.log('Prompt.Model.toggleBackgroundColor() called');

		//set to defaults in case no variables passed in
		var first = (f != undefined) ? f : this.backgroundColor;
		var second = (s != undefined) ? s : 'blue';
		var interval = (i != undefined) ? i : 1000;//measured in milliseconds

		//set selected HTML element background color to first color
		$(this.selector).css('backgroundColor', first);

		var _this = this;//need to add a pointer to this so it is available in the setTimeout()

		//setTimeout(function, interval) will call function after interval milliseconds
		setTimeout(function(){ 
			console.log('Background color of ' + _this.selector + ' should now change to ' + second);

			$(_this.selector).css('backgroundColor', second);

			//return true for chaining and callbacks
			return true;
		 }, interval );
	}
});



/****************************************************************************************
*****************************************************************************************
	Controller

	The controller is the javascript object that will hold the attribute value and methods
	for the model. It will eventually control what content gets displayed to the user
	and when.
*/

/*
 *	STEP 3: Create the Prompt controller
 *	
 *	Create the Prompt controller to be extended with the minimum necessary variables and the
 *	required parameter to construct the object.
 *
 *	model: 	the instance of a Prompt model that this controller will control
 *
 *	@todo: 	create a controller in the same manner that the model was created above, set
 *			the local model to the parameter that will be passed in on construction and
 *			initialize an empty local array called functionArray
 *
 */
var Controller = Prompt.Controller = function(model){
	this.model = model;//initialize the controller with its model
	console.log('#');
	this.functionArray = [];
}

/*
 *	STEP 4: Extend the Prompt controller
 *	
 *	Use the Underscore.js _.extend(object, extension) function to extend the attributes 
 *	and methods of the Prompt controller.
 *
 *	@todo: 	extend the controller in the same manner that the model was extended above and
 *			create a function called initialize that populates the functionArray with each
 *			of the functions of the model and anther function called surprise that calls one
 *			of the functions in functionArray at random after 5 seconds
 *
 */
_.extend(Controller.prototype, {

	initialize: function(){
		console.log('Controller.initialize() called');
		console.dir(this.model);
		this.functionArray.push(this.model.alert);
		this.functionArray.push(this.model.toggleBackgroundColor);
	},

	randomize: function(interval){
		if(this.functionArray.length <= 0){
			return false; //if no functions available, abort and return false
		}else{
			console.log('should call tbc');
			this.functionArray[0].call();
			this.functionArray[1].call();
			return true;
		}
	}
})



