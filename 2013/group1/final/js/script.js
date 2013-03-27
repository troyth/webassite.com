$(document).ready(function() {
 	// The DOM has been loaded

 	var videoLinks = [];

 	videoLinks[1] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/zL1Qq1mmOtg" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[2] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/_842utmj4Mg" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[3] = '<iframe width="600" height="400" src="http://www.youtube.com/embed/R9DViMqQ58I" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[4] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/x-sThPIwOZo" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[5] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/ZC9cx9On5bk" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[6] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/8mnHWk3n6Pw" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[7] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/3NokQTzYnoc" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[8] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/oREpTvfcot8" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[9] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/3HwwZtd6CAc" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[10] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/jAwq-tLmFTk" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[11] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/BS8Da1W02XA" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[12] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/KujpamPn7Mk" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[13] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/RpFMXMQUATw" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[14] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/wDHjygmhnSM" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[15] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/cLUmSaxSwts" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[16] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/R9DViMqQ58I" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[17] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/wEito0JS4KA" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[18] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/P1k-4bp3wJ0" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[19] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/CyxZsMEAvIE" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[21] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/nmqXsMADESw" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[22] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/IYArkpbBjVk" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[23] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/8yMHiJHxTx0" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[24] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/EjVcYotWndk" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[25] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/-pHH53lsNb8" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[26] = '';
 	videoLinks[27] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/J1lQOhGKYQo" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[28] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/mhbWHqxBMo8" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[29] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/RgRynXPMsok" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[30] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/J1lQOhGKYQo" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[31] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/-5jMS5PgIrk" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[32] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/JP8KzfnGqSY" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[33] = '';
 	videoLinks[34] = '<iframe width="420" height="315" src="http://www.youtube.com/embed/mXgM2jydXDA" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[35] = '';
 	videoLinks[36] = '';
 	videoLinks[37] = '';
 	videoLinks[38] = '';

 	
 	console.log('ready');

 	var questiontext = [];

 	questiontext[1] = $('#question1').text();
 	questiontext[2] = $('#question2').text();
 	questiontext[3] = $('#question3').text();
 	questiontext[4] = $('#question4').text();
 	questiontext[5] = $('#question5').text();
 	questiontext[6] = $('#question6').text();
 	questiontext[7] = $('#question7').text();
 	questiontext[8] = $('#question8').text();
 	questiontext[9] = $('#question9').text();



 	$('#about').click(function(){
 		$('#main').fadeTo('Slow',0.2)
 		$('#question').fadeTo('Slow',0.2)
 		$('#aboutpage').show('slow')
 	});
 	$('#submission').click(function(){
 		$('#main').fadeTo('Slow',0.2)
 		$('#question').fadeTo('Slow',0.2)
 		$('#submissionpage').show('slow')
 	});

 	$('.close-button').click(function(){
 		$('#aboutpage').hide('slow');
 		$('#submissionpage').hide('slow');
 		$('#video-popup').hide('slow');
        $('#video-background').hide('slow');
 		$('#main').fadeTo('slow',1);
 		$('#question').fadeTo('Slow',1);
 		$('#video-container iframe').remove();
 		$('#video-question').html( '' );

 		restoreAllVideos();

 	});

 	function incrementQuestion(){

 		var $current = $('#questions-list .question-text:visible');

 		var current_id = $('#questions-list .question-text:visible').attr('id');
 		current_id = current_id.substr(8);

 		console.log('current_id '+ current_id);
 		if(current_id == '9'){
 			var id = 'question1';
 		}else{
 			var id = $current.next().attr('id');
 		}

 		console.log('id: '+ id);
 		
 		
 		$('.video-item:not(.' + id + ')').css('opacity', '0.2');
 		$('.video-item img').unbind('click').removeClass('clickable');
 		$('.video-item.' + id).css('opacity', '1.0');
 		$('.video-item.' + id + ' img').bind('click', videoPopup).addClass('clickable');
 		
 		if(id == "question1"){
 			$('#questions-list .question-text:first-child').show();
 		}else{
 			$current.next().show();
 		}

 		
 		$current.hide();
 	}


	function questionNextInitial(){
 		$('#question-question').remove();
 		$('#questions-list .question-text:first-child').show();

 		$('.video-item:not(.question1)').css('opacity', '0.2');
 		$('.video-item:not(.question1) img').unbind('click').removeClass('clickable');
 		$('.video-item .question1').css('opacity', '1.0');
 		$('.video-item .question1 img').bind('click', videoPopup).addClass('clickable');


 		$('#question-prev').show();
 		$(this).unbind('click');
 		$(this).bind('click', incrementQuestion);
 	}


	function decrementQuestion(){
 		var $current = $('#questions-list .question-text:visible');
 		

 		var current_id = $('#questions-list .question-text:visible').attr('id');
 		current_id = current_id.substr(8);

 		console.log('current_id '+ current_id);
 		if(current_id == '1'){
 			var id = 'question9';
 		}else{
 			var id = $current.prev().attr('id');
 		}

 		console.log('id: '+ id);


 		
 		$('.video-item:not(.' + id + ')').css('opacity', '0.2');
 		$('.video-item img').unbind('click').removeClass('clickable');
 		$('.video-item.' + id).css('opacity', '1.0');
 		$('.video-item.' + id + ' img').bind('click', videoPopup).addClass('clickable');
 		
 		if(id == "question9"){
 			$('#questions-list .question-text:last-child').show();
 		}else{
 			$current.prev().show();
 		}

 		//$current.prev().show();
 		$current.hide();
 	}

 

 	

 	$('#question-next').bind('click', questionNextInitial);
 	$('#question-prev').bind('click', decrementQuestion);


	function restoreAllVideos(){
		//$('.video-item').css('opacity', '1.0');
		console.log( 'restoreAllVideos' );
	}


 	

 	function videoPopup(){
 		var index = $(this).closest('.video-item').attr('class');
 		//console.log('first class: '+index);

 		var idx = index.indexOf('question');
 		var idx2 = parseInt(idx) + 8;
 		index = index.substr(idx2);
 		index = parseInt(index);
 		//console.log(index);

 		var videoIndex = $(this).attr('class');
 		var array = videoIndex.split(' ');

 		for(var i = 0; i < array.length; i++){

 			if( array[i].indexOf('video-link') >= 0){
 				videoIndex = array[i].substr(10);
 			}
 		}

 		console.log('videoIndex: '+ videoIndex);


 		// 1

 		$('#video-container').append( videoLinks[videoIndex] );
 		$('#video-question').text( $('#question'+index).text() );
 		$('#video-popup').fadeIn(300);
		$('#video-background').fadeIn(300);
 	}
 	$('.video-item img').bind('click', videoPopup).addClass('clickable');


 	$(document).keydown(function(e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
        	$('#video-popup').hide('slow');
        	$('#video-background').hide('slow');
    }
	});




 	/*
 	$('#question').hover(function(){
 		$('#question-question').hide();
 		$('#questions-list').show();
 		$('#questionscroll').show();
 	}, function(){
 		$('#questions-list').hide();
 		$('#questionscroll').hide();
 		$('#question-question').show();
 	});
*/
	/*
 	$('#question-question').hover(function(){
 		$('#questions-list').show();
	});

	$('#questions-list').hover(function(){

	})

	

	function loopDown(){
		var topValue = $('#questions-list li').css('top');
		topValue = parseInt( topValue );
		topValue = topValue * -1;

		var maxTopValue = $('#questions-list').height();
		maxTopValue = parseInt( maxTopValue );

		var heightOfLastQuestion = $('#questions-list li:last-child').height();
		heightOfLastQuestion = parseInt( heightOfLastQuestion );

		var offset = heightOfLastQuestion + 28;


		if(topValue < (maxTopValue - offset)){
			$('#questions-list li').stop().animate({top:'-=20'}, 800, 'linear', loopDown);
		}

		console.log('topValue: '+ $('#questions-list li').css('top') + ' maxTopValue: ' + maxTopValue);		
	}        

	function stop(){
	    $('#questions-list li').stop();
	}

	$(".scrolldown").hover(function () {
	   loopDown();
	},function () {
	   stop();
	});



	function loopUp(){
		var topValue = $('#questions-list li').css('top');
		topValue = parseInt( topValue );

		var maxtopValue = $('#questions-list').height();
		maxtopValue = parseInt( maxtopValue );

		var heightOfFirstQuestion = $('#questions-list li:first-child').height();
		heightOfFirstQuestion = parseInt( heightOfFirstQuestion );

		var offset = heightOfFirstQuestion + 220;


		if(topValue < (maxtopValue - offset)){
			$('#questions-list li').stop().animate({top:'+=20'}, 800, 'linear', loopUp);
		}
		console.log('bottomValue: '+ $('#questions-list li').css('top') + ' maxtopValue: ' + maxtopValue);		
	}        

	function stop(){
	    $('#questions-list li').stop();
	}

	$(".scrollup").hover(function () {
	   loopUp();
	},function () {
	   stop();
	});
*/















});