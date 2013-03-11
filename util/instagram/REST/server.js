var express = require('express'),
    //tweets = require('./routes/tweets'),
    instagram = require('./routes/instagram');

var app = express();

//enable the option to respond to jsonp
app.enable("jsonp callback");

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

//GET ENDPOINTS
app.get('/instagram/:collection', instagram.findAll);
app.get('/instagram/:collection/limit/:limit', instagram.findLimit);
app.get('/instagram/:collection/variety/limit/:limit', instagram.findVariety);


//POST ENDPOINTS
//app.post('/tweet/:username', twitter_api.sendTweet);


var tags = ['kinneamman','kinneatacama','kinneathens','kinnebangalore','kinnebeijing','kinnebordeaux','kinnecannes','kinnechandigarh','kinnecopenhagen','kinnegeneva','kinnehyderabad','kinneistanbul','kinnejohannesburg','kinnekochi','kinnekumasi','kinnekyoto','kinnelondon','kinnemedellin','kinnemumbai','kinnenewdelhi','kinneparis','kinnerio','kinnerotterdam','kinnesanfrancisco','kinnesaopaulo','kinneshanghai','kinnetokyo','kinnevenice','kinnevienna'];

var i = 0;


function countAllTags(){
	for(var j = 0; j < tags.length; j++){
		instagram.countByTag('kinneinstagram', tags[j]);	
	}
}

//instagram.clear('kinneinstagram');

function fetchTags(interval){
	setTimeout(function(){
		instagram.fetch(tags[i]);
		i++;
		if(i >= tags.length){
			i = 0;
		}
		fetchTags(interval);
	}, interval);
}

fetchTags(30000);//fetch every half-minute, looking for a different tag each time


//instagram.count('kinneinstagram');
//instagram.showAll('kinneinstagram');







//setTimeout(function(){ instagram.count('kinneinstagram'); instagram.showAll('kinneinstagram'); }, 100);

//print out the current counts every 20 seconds
//var interval_id = setInterval(function(){ 
		//instagram.count('movements');
		//instagram.count('streetcache');
		//instagram.fetch('movements', block);
		//instagram.fetchAtStreetcache();
//	}, 15000);//fetch every 20 seconds



//listen on port 3001
app.listen(3001);
console.log('Listening on port 3001...');