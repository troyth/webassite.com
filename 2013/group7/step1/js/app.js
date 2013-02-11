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
	model = new Prompt.Model('#container');


	/*
	 *	STEP 2: Set and extend the model to add attributes and update defaults as desired
	 *
	 *	This is using the Underscore.js extend function, see here: http://underscorejs.org/#extend
	 *
	 *	@todo: this is just for example, you may want to change these values and attributes
	*/
	_.extend(model, {
		borderBottom: '2px solid red',
		fontSize: '24px'
	});

	/*
	 *	STEP 3: Initialize model to set default css attributes
	*/
	model.initialize();

	//@todo: once you implement STEP 4, you will want to comment out the line below, this is just for testing
	model.toggleBackgroundColor('red', '#F799A2', 1000); //toggle the background color from red to #F799A2 after 1000ms




	/*
	 *	STEP 4: Instantiate the controller passing in the model as it's sole parameter
	 *
	 *	@todo: following step 1 above, create a new Prompt.Controller initialized with model
	*/
	
	//your code here



	/*
	 *	STEP 5: Initialize controller
	 *
	 *	@todo: following step 2 above, initialize the new controller
	*/
	
	//your code here



	/*
	 *	STEP 6: Call the surprise function on the controller
	 *
	 *	@todo: call the surprise function with the correct parameters
	*/
	
	//your code here


});


