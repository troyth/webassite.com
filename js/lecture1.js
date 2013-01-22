$(function() {
	$.deck('.slide');

	$(document).ready(function(){

		$('.slide-bg img').css('opacity', '0.8');
		SyntaxHighlighter.all();

		var spanSelector = '.span6';

		var rowSelector = '.row1, .row2, .row3, .row4, .row5, .row6, .row7, .row8, .row9, .row10, .row11, .row12, .row13, .row14, .row15, .row16, .row17, .row18, .row19, .row20';
		var containerRowsSelector = '.container > .row1, .container > .row2, .container > .row3, .container > .row4, .container > .row5, .container > .row6, .container > .row7, .container > .row8, .container > .row9, .container > .row10, .container > .row11, .container > .row12, .container > .row13, .container > .row14, .container > .row15, .container > .row16, .container > .row17, .container > .row18, .container > .row19, .container > .row20';

		function resizeFits(){
			var rowHeight = Math.floor(window.innerHeight * 0.7);


			$('.slide').each(function(i){
				console.log('');
				console.log('slide: '+ i);
				$(containerRowsSelector, this).each(function(j){
					console.log('top level row: '+ j);
					$(spanSelector, this).each(function(k){
						console.log('--');
						console.log('article #: '+ k);

						var articleHeight = $(this).height();
						var scale = rowHeight / articleHeight;
						console.log('articleHeight: '+ articleHeight);
						console.log('scale: '+ scale);

						$(this).children(rowSelector).each(function(){
							var childRowHeight = $(this).height();
							var newHeight = Math.floor(childRowHeight * scale);
							console.log('change this to newHeight: '+ newHeight);
							$(this).height( newHeight );
						});
					});


				});
			});

			/*



			$('.fit').each(function(i){
				var figCaptionHeight = $(this).find('figcaption').height();
				var delta = rowHeight - figCaptionHeight;
				console.log('rowHeight: '+ rowHeight + ' figCaptionHeight: '+ figCaptionHeight + '= '+ delta);
				$(this).height( delta );

				//vertically center the fit-container
				var containerHeight = $(this).find('.fit-container').height();
				console.log('containerHeight: '+ containerHeight);
				if(containerHeight != null){
					var marginTop = Math.floor((rowHeight - containerHeight) / 2);
					$(this).find('.fit-container').css('marginTop', marginTop);
				}

			});
*/
		}
		//resizeFits();
		$(window).resize( resizeFits );
	});
});