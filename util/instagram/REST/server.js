var express = require('express'),
	passport = require('passport'),
	FlickrStrategy = require('passport-flickr').Strategy
    //tweets = require('./routes/tweets'),
    instagram = require('./routes/instagram'),
    flickr = require('./routes/flickr');

var app = express();

//enable the option to respond to jsonp
app.enable("jsonp callback");

app.configure(function () {
    //app.use(express.logger('tiny'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.cookieParser()); 
    app.use(express.session({ secret: 'keyboard cat' }));
	app.use(passport.initialize());
	app.use(passport.session());
});

//GET ENDPOINTS
app.get('/instagram/:collection', instagram.findAll);
app.get('/instagram/:collection/count', instagram.countAll);
app.get('/instagram/:collection/limit/:limit', instagram.findLimit);
app.get('/instagram/:collection/variety/limit/:limit', instagram.findVariety);


app.get('/instagram/:collection/undefinedcaption', instagram.findUndefined);



app.get('/instagram/:collection/uploaded', instagram.findUploaded);
app.get('/instagram/:collection/not-uploaded', instagram.findNotUploaded);

//Set all photos to uploaded remotely
app.get('/instagram/kinneinstagram/set-uploaded', instagram.setUploadedFlag);


//FLICKR AUTH
app.get('/auth/flickr',
  passport.authenticate('flickr', { scope: 'write' }),
  function(req, res){
    // The request will be redirected to Flickr for authentication, so this
    // function will not be called.
  });

app.get('/auth/flickr/callback', 
  passport.authenticate('flickr', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


passport.use(new FlickrStrategy({
    consumerKey: '1361ce967daf59821bc493392809c8e8',
    consumerSecret: '82a41cbf24541227',
    callbackURL: "http://webassite.com/util/instagram/REST/auth/flickr/callback"
  },
  function(token, tokenSecret, profile, done) {
  	console.log('***** GOT A TOKEN!!! OF: '+ token + ' with tokenSecret: '+ tokenSecret);

  	//flickr.saveToFlickr(token, tokenSecret);
  	/*
    User.findOrCreate({ flickrId: profile.id }, function (err, user) {
      return done(err, user);
    });*/
  }
));


//POST ENDPOINTS
//app.post('/tweet/:username', twitter_api.sendTweet);



var tags = ['kinneamman','kinneatacama','kinneathens','kinnebangalore','kinnebeijing','kinnebordeaux','kinnecannes','kinnechandigarh','kinnecopenhagen','kinnegeneva','kinnehyderabad','kinneistanbul','kinnejohannesburg','kinnekochi','kinnekumasi','kinnekyoto','kinnelondon','kinnemedellin','kinnemumbai','kinnenewdelhi','kinneparis','kinnerio','kinnerotterdam','kinnesanfrancisco','kinnesaopaulo','kinneshanghai','kinnetokyo','kinnevenice','kinnevienna', 'kinneahmedabad', 'kinneagra', 'kinnedelhi', 'kinneginza', 'kinnehongkong'];

var i = 0;



function countAllTags(){
	console.log('');console.log('');
	for(var j = 0; j < tags.length; j++){
		instagram.countByTag('kinneinstagram', tags[j]);
	}
	console.log('');console.log('');
}

countAllTags();

//instagram.count('kinneinstagram');

//var countTagIntervalID = setInterval(function(){
	//countAllTags();
//}, 60000);

var saveToFlickrID = setInterval(function(){
	instagram.saveToFlickr();
}, 30000);//1800000 = once every half hour

instagram.saveToFlickr();//at boot up
//instagram.resetUploadedFlag();


//instagram.findError();

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


//instagram.fetch('kinnekyoto');
//instagram.fetch('kinneatacama');

//fetchTags(5000);//fetch every half-minute, looking for a different tag each time


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