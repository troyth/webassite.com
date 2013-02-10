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
var model;
var controller;

//the jQuery ready function: everything inside will be called only after the entire
//DOM is loaded
$(document).ready(function() {
	/*
	 *	STEP 1: Instantiate the model with the content container selector as parameter
	 *
	 *	This is creating an instance of the Prompt.Model defined in prompt.js so that
	 *	you can access the methods and attributes stored in the Prompt.Model object
	*/
	model = new Prompt.Model('#wrapper');


	/*
	 *	STEP 2: Set and extend the model to add attributes and update defaults as desired
	 *
	 *	This is using the Underscore.js extend function, see here: http://underscorejs.org/#extend
	*/
	_.extend(model, {
		borderBottom: '2px solid red',
		fontSize: '24px'
	});

	/*
	 *	STEP 3: Initialize model to set default css attributes
	*/
	model.initialize();


	/*
	 *	STEP 4: Run your functions here
	 *
	 *	Note: later, this is where the controller will go
	*/
	//model.toggleBackgroundColor('red', '#F799A2', 1000); //toggle the background color from red to #F799A2 after 1000ms

	//@TODO: add more functions to the Prompt.Model object in prompt.js and call them here

	controller = new Prompt.Controller(model);

	controller.initialize();
	controller.randomize(100);


});


