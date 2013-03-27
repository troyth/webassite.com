var express = require('express'),
    //tweets = require('./routes/tweets'),
    twitter_api = require('./routes/twitter_api');

var app = express();

//enable the option to respond to jsonp
app.enable("jsonp callback");

app.configure(function () {
    //app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

//GROUP 2 and 4
//app.get('/tweets/geo/bowery', tweets.findAll);
//app.get('/tweets/stream/bowery', tweets.findAllStreetCache);
app.get('/tweets/:collection', twitter_api.findAll);
app.get('/tweets/:collection/count', twitter_api.countAll);

//GROUP 2

//app.get('/tweets/geo/bowery/limit/:limit', tweets.findAllLimited);
app.get('/tweets/:collection/limit/:limit', twitter_api.findAllLimited);

//app.get('/tweets/geo/bowery/id/:id', tweets.findById);
app.get('/tweets/:collection/id/:id', twitter_api.findById);

//app.get('/tweets/geo/bowery/hashtag/:hashtag/limit/:limit', tweets.findByHashtagLimited);
app.get('/tweets/:collection/hashtag/:hashtag/limit/:limit', twitter_api.findByHashtagLimited);

//app.get('/tweets/geo/bowery/hashtag/:hashtag/recent/:timewindow/count', tweets.countByHashtagLimited);
app.get('/tweets/:collection/hashtag/:hashtag/recent/:timewindow/count', twitter_api.countByHashtagLimited);

app.get('/tweets/:collection/hashtag/:hashtag/recent/:timewindow', twitter_api.findByHashtagTimeWindow);

//app.get('/tweets/geo/bowery/block/:block/recent/:timewindow/count', tweets.countByBlockLimited);
app.get('/tweets/:collection/block/:block/recent/:timewindow/count', twitter_api.countByBlockLimited);

//GROUP 4
//app.get('/tweets/stream/bowery/recent/:timewindow', tweets.findStreamRecentTimeWindow);
app.get('/tweets/:collection/recent/:timewindow', twitter_api.findRecent);


//POST REQUESTS
app.post('/tweet/:username', twitter_api.sendTweet);

//app.get('/tweets/geo/bowery/hashtag/:hashtag/limit/:limit', tweets.findByHashtagLimited);
app.get('/tweets/:collection/username/:username/limit/:limit', twitter_api.findByUsernameLimited);



//begin the streaming
//twitter_api.stream('movements');
twitter_api.stream('streetcache');

//twitter_api.clear('movements');

var block = 1;
//print out the current counts every 20 seconds
var interval_id = setInterval(function(){ 
		twitter_api.count('movements');
		twitter_api.count('streetcache');
		twitter_api.fetch('movements', block);
		twitter_api.fetchAtStreetcache();
		block++;
		if(block > 3){
			block = 1;
		}
	}, 15000);//fetch every 20 seconds



//listen on port 3000
app.listen(3000);
console.log('Listening on port 3000...');