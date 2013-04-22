$(document).ready(function() {
	
	$('.box').after($('#instagram-images'));
	$('.box').after($('article'));


	var dw = $(document).width();
	var maxW = 940;
	if(dw > maxW){
		dw=maxW;
	}
	var dHalf = dw/2-dw/30;

	var pad = $('h3').css('padding');

	var question_width = dw - 48;
	//$('h3').css({'width':question_width+'px'});
	$('.resizable-textarea').css({'width':dw+'px'});
	$('.resizable-textarea').css({'margin-right': '0'});
	$('.comment-folded').css({'width':dw+'px'});
	$('.comment-folded').css({'margin-right': '0'});
	$('.comment-folded').css({'padding': pad});

	$('#instagram-images p').css({'width':dHalf+'px'});
	$('#instagram-images p').css({'height':dHalf+'px'});
	$('#instagram-images p').css({'background-color': '#000000'});

	$('#comment-form .resizable-textarea textarea').css('backgroundColor', $('#main-menu a.active').css('color'));
	//console.log('doc ready');
	//alert('dbkjdkbjdksbajdsfkb');

	$('.comment-spam-body').parent().parent('.comment').remove();

});