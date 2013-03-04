$(document).ready(function() {
 	// The DOM has been loaded



 	var videoLinks = [];

 	videoLinks[1] = '<iframe width="600" height="600" src="http://youtu.be/jNJqVNyU0Bw" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[2] = '<iframe width="600" height="600" src="http://youtu.be/vHGNE5erTHw" frameborder="0" allowfullscreen></iframe>';
 	videoLinks[6] = '<iframe width="600" height="600" src="http://www.youtube.com/embed/R9DViMqQ58I" frameborder="0" allowfullscreen></iframe>';
 	
 	console.log('ready');


 	
 	$('#q1').click(function() {
 		$('.video-item1').not('this').fadeTo('slow',0.5)
 	});
 	

 	$('#about').click(function(){
 		$('#main').fadeTo('Slow',0.2)
 		$('#aboutpage').show('slow')
 	});
 	$('#submission').click(function(){
 		$('#main').fadeTo('Slow',0.2)
 		$('#submissionpage').show('slow')
 	});

 	$('.close-button').click(function(){
 		$('#aboutpage').hide('slow')
 		$('#submissionpage').hide('slow')
 		$('#main').fadeTo('slow',1) 	
 	});


 	$('#question').hover(function(){
 		$('#question-question').hide();
 		$('#questions-list').show();
 		$('#questionscroll').show();
 	}, function(){
 		$('#questions-list').hide();
 		$('#questionscroll').hide();
 		$('#question-question').show();
 	});

 	$('#question-question').hover(function(){
 		$('#questions-list').show();
	});

	$('#questions-list').hover(function(){

	})

	




	function loopUp(){
		var topValue = $('#questions-list li').css('top');
		topValue = parseInt( topValue );
		topValue = topValue * -1;

		var maxTopValue = $('#questions-list').height();
		maxTopValue = parseInt( maxTopValue );

		var heightOfLastQuestion = $('#questions-list li:last-child').height();
		heightOfLastQuestion = parseInt( heightOfLastQuestion );

		var offset = heightOfLastQuestion + 20;


		if(topValue < (maxTopValue - offset)){
			$('#questions-list li').stop().animate({top:'-=20'}, 250, 'linear', loopUp);
		}

		console.log('topValue: '+ $('#questions-list li').css('top') + ' maxTopValue: ' + maxTopValue);		
	}        

	function stop(){
	    $('#questions-list li').stop();
	}

	$(".scrollup").hover(function () {
	   loopUp();
	},function () {
	   stop();
	});






 	$(document).keydown(function(e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
        	$('#video-container').hide();
        	$('#video-background').hide();
    }
	});



 	function videoPopup(){
 		var index = $(this).attr('class');
 		index = index.substr(10);
 		index = parseInt(index);
 		console.log(index);
 		// 1

 		$('#video-container').append( videoLinks[index] );
 		$('#video-container').fadeIn(300);
		$('#video-background').fadeIn(300);


 	}


 	$('.video-item img').bind('click', videoPopup);




 	function showVideosByQuestion(){
 		var id = $(this).attr('id');
 		$('.video-item:not(.' + id + ')').css('opacity', '0.2');
 		$('.video-item.' + id).css('opacity', '1.0');

 	}


 	$('#questions-list li').bind('click', showVideosByQuestion);

















});