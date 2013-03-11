var mongo = require('mongodb');
var twitter = require('ntwitter');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('group2_2013_tweetsdb', server, {safe:false});

 
db.open(function(err, db) {
	console.log('opening DB in tweets.js');
    if(!err) {
        console.log("Connected to 'group2_2013_tweetsdb' database");
        db.collection('tweets', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'tweets' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});


var hashtags = ['#235bowery', '#237bowery', '#football', '#bowery', '#museum', '#design', '#art'];

var block1 = new Array('273bowery', '269bowery', '267bowery', '265bowery', '263bowery', '261bowery', '259bowery', '257bowery', '255bowery', '2stanton');
var block2 = new Array('245bowery', '243bowery', '241bowery', '239bowery', '235bowery', '231bowery', '229bowery', '227bowery', '225bowery', '223bowery', '221bowery', '219bowery', '217bowery', '215bowery', '4rivington', '6rivington', '8rivington', '12rivington', '16rivington', '181chrystie', '183chrystie', '187chrystie', '189chrystie', '191chrystie', '195chrystie', '199chrystie', '201chrystie', '203chrystie', '205chrystie', '9stanton', '11stanton', '13stanton', '15stanton', '17stanton');
var block3 = new Array('213bowery','209bowery','207bowery','199bowery','197bowery','195bowery','193bowery','191bowery','189bowery','187bowery','185bowery','183bowery','6delancey','10delancey','12delancey','14delancey','16delancey','18delancey','155chrystie','157chrystie','159chrystie','163chrystie','165chrystie','167chrystie','169chrystie','173chrystie','17rivington','15rivington','11rivington','7rivington','5rivington');







var RESPONSE_LIMIT = 300;

function prune(results){
	var returnArray = [];
	for(var i = 0; i < results.length; i++){
		//@todo: only copy over the fields we need
		returnArray[i] = results[i];
	}
	return returnArray;
}


var twit = new twitter({
  consumer_key: '53H5ThqX93SE3576cNbLRA',
  consumer_secret: 'a5XZVQ0TopZ8gZmcp0dhoMXnFuMtpzop6JRdTsFg00',
  access_token_key: '1223207689-0QVomPx6LdfgbHRXSlmY8GcU4j6xnQHw7ZNxYVK',
  access_token_secret: 'PLszYQorIl0ooEAITXsrIhj9WMyKniCIBG6FNXLJVQ'
});


var MAX_ID, MAX_ID_STRING, NEXT_PAGE, PAGE, RESULTS_PER_PAGE, SINCE_ID, SINCE_ID_STRING, results_pruned;



/*
 *******************************************************************************************************
 *******************************************************************************************************
 *	HELPER FUNCTIONS
 *******************************************************************************************************
 *******************************************************************************************************
*/

/*
 *	showAll(col)
 *
 *	logs all tweets in collection col to the console
 *
*/
exports.showAll = function(col){
	console.log('-------showAll() from collection: '+ col);
	db.collection(col, function(err, collection) {
        collection.find().toArray(function(err, items) {
        	if(err){
        		console.log('Error: showAll() fired an error:');
        		console.log(err);
        	}else{
            	console.log(items);
            }
        });
    });

}


/*
 *	clear(col)
 *
 *	Deletes all documents in the col collection
 *
*/
exports.clear = function(col){
	console.log('-------clear() from collection: ' + col);
	db.collection(col, function(err, collection) {
        collection.remove();
    });
}



exports.count = function(col){
	db.collection(col, function(err, collection) {
		var total = collection.count(function(err, total) {
			if(err){
				console.log('Error: error trying to count total documents in ' + col + ' collection');
			}else{
				console.log('####### TOTAL TWEETS in ' + col + ' collection: '+ total + ' #######');
			}
		});
    });
}





/*
 *******************************************************************************************************
 *******************************************************************************************************
 *	GROUP 2 - BOWERY MOVEMENTS - TWITTER API MIRROR RESTful ACCESS FUNCTIONS
 *******************************************************************************************************
 *******************************************************************************************************
*/


/*
 *	findAll(req, res)
 *
 *	Returns (up to) the RESPONSE_LIMIT most recent tweets in reverse chronological order 
 *	from the movements collection that have come from the Bowery region
 *
*/
exports.findAll = function(req, res) {
	console.log('findAll() in movements collection');

    db.collection('movements', function(err, collection) {
        collection.find().sort({"timestamp":-1}).limit(RESPONSE_LIMIT).toArray(function(err, items) {
            res.jsonp(items);
        });
    });
};


/*
 *	findAllLimited(req, res)
 *
 *	Returns (up to) the :limit most recent tweets with a maximum of RESPONSE_LIMIT tweets in 
 *	reverse chronological order that have come from the Bowery region
 *
*/
exports.findAllLimited = function(req, res) {
	var limit = req.params.limit;
	console.log('findAllLimited() in movements collection with limit: '+ limit);

	limit = parseInt(limit);

    db.collection('movements', function(err, collection) {
        collection.find().sort({"timestamp":-1}).limit(limit).toArray(function(err, items) {
        	if(err){
        		console.log('Error: findAllLimited() returned with error:');
        		console.log(err);
        	}else{
            	res.jsonp(items);
            }
        });
    });
};


/*
 *	findAllLimited(req, res)
 *
 *	Returns (up to) the :limit most recent tweets with a maximum of RESPONSE_LIMIT tweets in 
 *	reverse chronological order that have come from the Bowery region
 *
*/
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById() in movements collection with id: ' + id);

    db.collection('movements', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
        	if(err) {
                console.log('error: An error has occurred in trying to find a tweet document in movements collection by id with _id: '+ id);
                console.log(err);
            } else {
                console.log('Success: A tweet in movements collection has been found and returned with _id: '+ id);
                res.jsonp(item);
            }
            
        });
    });
};


/*
 *	findByHashtagLimited(req, res)
 *
 *	Returns (up to) the :limit most recent tweets in reverse chronological order that have 
 *	come from the Bowery region with the hashtag of :hashtag
 *
*/
exports.findByHashtagLimited = function(req, res) {
    var hashtag = '#' + req.params.hashtag;//prepend #
    var limit = req.params.limit;
    limit = parseInt(limit);

    console.log('findByHashtag called on movements collection with hashtag: '+ hashtag);
  
    db.collection('movements', function(err, collection) {
        collection.find({'hashtags': hashtag}).sort({"timestamp":-1}).limit(limit).toArray(function(err, item) {
        	if(err) {
                console.log('error: An error has occurred in trying to find a tweets with hashtag: '+ hashtag);
                console.log(err);
            } else {
                console.log('Success: Tweets have been found and returned with hashtag: '+ hashtag);
                res.jsonp(item);
            }
            
        });
    });
};


/*
 *	countByHashtagLimited(req, res)
 *
 *	Returns the number of tweets for a given :hashtag within the last :seconds
*/
exports.countByHashtagLimited = function(req, res) {
    var hashtag = '#' + req.params.hashtag;//prepend #
    var time_window = req.params.timewindow * 1000;//multiply seconds to milliseconds
    console.log('findByHashtag called with hashtag: '+ hashtag);

    var d = new Date();
    var current_time = d.getTime();
    //current_time = current_time - (d.getTimezoneOffset() * 60 * 1000);//add the offset to convert server time to UTC
    var min_time = current_time - time_window;

    var m = new Date(min_time);

    console.log("calling findStreamRecentTimeWindow() with min_time: "+ m.toString() );
  
    db.collection('movements', function(err, collection) {
        collection.find({'hashtags': hashtag,  "timestamp": { $gt: min_time } }).count(function(err, total) {
        	if(err) {
                console.log('error: An error has occurred in trying to count the tweets with hashtag: '+ hashtag + ' within timewindow: '+time_window);
                console.log(err);
            } else {
                console.log('Success: Counted '+ total +' tweets with hashtag: '+ hashtag + ' within timewindow: '+ time_window);
                res.jsonp(total);
            }
            
        });
    });
};


/*
 *	countByBlockLimited(req, res)
 *
 *	Returns the number of tweets for a given :block within the last :seconds where :block can take the values 1, 2 or 3
*/
exports.countByBlockLimited = function(req, res) {
    var block = req.params.block;//prepend #
    var time_window = req.params.timewindow * 1000;//multiply seconds to milliseconds
    console.log('findByHashtag called with hashtag: '+ hashtag);

    var d = new Date();
    var current_time = d.getTime();
    //current_time = current_time - (d.getTimezoneOffset() * 60 * 1000);//add the offset to convert server time to UTC
    var min_time = current_time - time_window;

    var m = new Date(min_time);

    console.log("calling findStreamRecentTimeWindow() with min_time: "+ m.toString() );

    var errorThrow = false;
    var block;

    switch(block){
    	case 1:
    		block = new Array(block1);
    		break;
    	case 2:
    		block = new Array(block2);
    		break;
    	case 3:
    		block = new Array(block3);
    		break;
    	default:
    		errorThrow = true;
    		break;
    }

    if( !errorThrow ){

    	for(var i = 0; i < block.length; i++){
    		block[i] = '#' + block[i];
    	}

    	block = block.join(',');
  
	    db.collection('movements', function(err, collection) {
	        collection.find({'hashtags': block,  "timestamp": { $gt: min_time } }).count(function(err, total) {
	        	if(err) {
	                console.log('error: An error has occurred in trying to count the tweets on block: '+ block + ' within timewindow: '+time_window);
	                console.log(err);
	            } else {
	                console.log('Success: Counted '+ total +' tweets on block: '+ block + ' within timewindow: '+ time_window);
	                res.jsonp(total);
	            }
	            
	        });
	    });
	}else{
		//@todo: need to send a res with status NOT OK
	}
};











/*
 *******************************************************************************************************
 *******************************************************************************************************
 *	GROUP 4 - STREET CACHE - TWITTER API MIRROR RESTful ACCESS FUNCTIONS
 *******************************************************************************************************
 *******************************************************************************************************
*/


/*
 *	findAllStreetCache(req, res)
 *
 *	Returns (up to) the RESPONSE_LIMIT most recent tweets in reverse chronological order 
 *	from the streetcache collection that have come from the Bowery region
 *
*/
exports.findAllStreetCache = function(req, res) {
	console.log('trying to findAllStreetCache()');
    
    db.collection('streetcache', function(err, collection) {
        collection.find().sort({"timestamp":-1}).limit(RESPONSE_LIMIT).toArray(function(err, items) {
        	if(err){
        		console.log('Error: with findAllStreetCache(), error: ' + err);
        	}else{
        		console.log('Success: returning max of ' + items.length + ' tweets');
            	res.jsonp(items);
            }
        });
    });
};






exports.findStreamRecentTimeWindow = function(req, res) {
	console.log('trying to findStreamRecentTimeWindow');

	var time_window = req.params.timewindow * 1000;//convert from seconds to ms

	var d = new Date();
	var current_time = d.getTime();
    //current_time = current_time - (d.getTimezoneOffset() * 60 * 1000);//add the offset to convert server time to UTC
	var min_time = current_time - time_window;

	var m = new Date(min_time);

	console.log("calling findStreamRecentTimeWindow() with min_time: "+ m.toString() );


    
    db.collection('streetcache', function(err, collection) {
        collection.find({ "timestamp": { $gt: min_time } }).sort({"timestamp":-1}).limit(RESPONSE_LIMIT).toArray(function(err, items) {
        	if(err){
        		console.log('Error: with findStreamRecentTimeWindow(), error: ' + err);
        	}else{
        		console.log('Success: findStreamRecentTimeWindow() returning max of ' + items.length + ' tweets');
            	res.jsonp(items);
            }
        });
    });
};

/*
 *	stream()
 *
 *	Streams the twitter API storing all tweets from the Bowery in the last day
 *
*/

var streamBoundsStart = [];
streamBoundsStart[0] = -73.995;//-73.994401
streamBoundsStart[1] = 40.717;//40.717371

var streamBoundsEnd = [];
streamBoundsEnd[0] = -73.991;//-73.991482
streamBoundsEnd[1] = 40.726;//40.725795

var streamBoundsString = streamBoundsStart.join(',') + ',' + streamBoundsEnd.join(',');
console.log("streamBoundsString: "+ streamBoundsString);

var temp = 0;

exports.stream = function(){
	twit.stream('statuses/filter', {'locations': streamBoundsString }, function(stream) {//{'locations':'-73.994401,40.717371,-73.991482,40.725795'}
		console.log('starting to stream');
		stream.on('data', function (data) {

			//console.log('');
			

			var outside = false;

				if( data.geo == null ){
					//data.splice(i, 1);//remove from data if no geo
					//console.log('');
					//console.log('had no geo, removing');
					//console.log('');
					outside = true;
				}else{
					//console.log('entered for j loop');

					if( streamBoundsStart[1] > parseFloat(data.geo.coordinates[0])){
						//console.log(streamBoundsStart[1] + ' > ' + data.geo.coordinates[0] + ' therefore outside 1');
						outside = true;
					}
					if( parseFloat(data.geo.coordinates[0]) > streamBoundsEnd[1]){
						//console.log(data.geo.coordinates[0] + ' > ' + streamBoundsEnd[1] + ' therefore outside 2');
						outside = true;
					}
					if(streamBoundsEnd[0] < parseFloat(data.geo.coordinates[1])){
						//console.log(streamBoundsEnd[0] + ' < ' + data.geo.coordinates[1] + ' therefore outside 3');
						outside = true;
					}
					if(parseFloat(data.geo.coordinates[1]) < streamBoundsStart[0]){
						//console.log(data.geo.coordinates[1] + ' < ' + streamBoundsStart[0] + ' therefore outside 4');
						outside = true;
					}


				}
				
			//console.log('streaming a tweet with outside: ' + outside);

			if(!outside){
				var timestamp = new Date(data.created_at);
				data.timestamp = timestamp.getTime();

				console.log('*******outside was false, adding to streetcache with geo: ');
				console.dir(data.geo);


				db.collection('streetcache', function(err, collection) {
			        collection.insert(data, {safe:true}, function(err, result) {
			        	if (err) {
			                console.log('Stream error: An error has occurred in trying to insert into the DB streetcache collection');
			                console.log(err);
			            } else {
			                //console.log('Stream success: added ' + data.length + ' tweets to the DB streetcache collection');
			                //res.send(result[0]);
			            }
			        });
		    	});
			}


		});
		
		//setTimeout(stream.destroy, 14400000);//24hrs = 86400000, 14400000 = 4hrs
	});
}




























var mStreamBoundsStart = [];
mStreamBoundsStart[0] = -76;//-73.994401
mStreamBoundsStart[1] = 39;//40.717371

var mStreamBoundsEnd = [];
mStreamBoundsEnd[0] = -70;//-73.991482
mStreamBoundsEnd[1] = 42;//40.725795

var mStreamBoundsString = mStreamBoundsStart.join(',') + ',' + mStreamBoundsEnd.join(',');
console.log("streamBoundsString: "+ mStreamBoundsString);

var temp = 0;



var bowBlocks = new Array(block1,block2,block3);

//add hashtags to beginning of each value
for(var i = 0; i < bowBlocks.length; i++){
	bowBlocks[i] = '#' + bowBlocks[i];
}

var bowBlocksString = bowBlocks.join(',');




exports.streamMovements = function(){
	twit.stream('statuses/filter', {'track': bowBlocksString, 'locations': mStreamBoundsString }, function(stream) {//{'locations':'-73.994401,40.717371,-73.991482,40.725795'}
		console.log('starting to stream');
		stream.on('data', function (data) {

			//console.log('');
			

			var outside = false;

				if( data.geo == null ){
					outside = true;
				}else{
					if( mStreamBoundsStart[1] > parseFloat(data.geo.coordinates[0])){
						//console.log(streamBoundsStart[1] + ' > ' + data.geo.coordinates[0] + ' therefore outside 1');
						outside = true;
					}
					if( parseFloat(data.geo.coordinates[0]) > mStreamBoundsEnd[1]){
						//console.log(data.geo.coordinates[0] + ' > ' + streamBoundsEnd[1] + ' therefore outside 2');
						outside = true;
					}
					if(mStreamBoundsEnd[0] < parseFloat(data.geo.coordinates[1])){
						//console.log(streamBoundsEnd[0] + ' < ' + data.geo.coordinates[1] + ' therefore outside 3');
						outside = true;
					}
					if(parseFloat(data.geo.coordinates[1]) < mStreamBoundsStart[0]){
						//console.log(data.geo.coordinates[1] + ' < ' + streamBoundsStart[0] + ' therefore outside 4');
						outside = true;
					}


				}
				
			//console.log('streaming a tweet with outside: ' + outside);

			if(!outside){
				var timestamp = new Date(data.created_at);
				data.timestamp = timestamp.getTime();

				console.log('*******outside was false, adding to movements collection with geo: ');
				console.dir(data.geo);


				db.collection('movements', function(err, collection) {
			        collection.insert(data, {safe:true}, function(err, result) {
			        	if (err) {
			                console.log('Stream error: An error has occurred in trying to insert into the DB movements collection');
			                console.log(err);
			            } else {
			                //console.log('Stream success: added ' + data.length + ' tweets to the DB movements collection');
			                //res.send(result[0]);
			            }
			        });
		    	});
			}


		});
		
		//setTimeout(stream.destroy, 14400000);//24hrs = 86400000, 14400000 = 4hrs
	});
}






















/*
 *	fetch()
 *
 *	Fetches tweets from the Twitter search API and puts them in the Mongo db collection 'tweets'
 *
*/
exports.fetch = function(){

	var searchterms = hashtags.join(' OR ');//create search terms out of the hashtag array

	//console.log('****FETCHING FROM TWITTER REST API WITH SEARCH TERMS: '+ searchterms);

	twit.verifyCredentials(function (err, data) {
			//console.log(data);
		});


	twit.search(searchterms, {'geocode':'40.722337,-73.992844,1km'}, function(err, data) {
			//console.log(data);
			//console.log('FETCH RETURNED '+data.results.length+ ' TWEETS');

			MAX_ID = data.max_id;
			MAX_ID_STRING = data.max_id_str;
			NEXT_PAGE = data.next_page;
			PAGE = data.page;
			RESULTS_PER_PAGE = data.results_per_page;
			SINCE_ID = data.since_id;
			SINCE_ID_STRING = data.since_id_str;

			//results_pruned = prune(data.results);

			results_pruned = data.results;
			
			for(var i = 0; i < data.results.length; i++){
				//@todo: only copy over the fields we need
				//results_pruned[i]._id = results_pruned[i].id;//set the mongo primary key, _id, to the tweet id for easy retreival
				
				//console.log('adding to db collection results_pruned['+i+'] with tweet id: '+ results_pruned[i].id_str);

				var timestamp = new Date(results_pruned[i].created_at);

				results_pruned[i].timestamp = timestamp.getTime();


				/*
				 *	SPECIFICALLY FOR GROUP 2 ONLY : adds the hashtag clearly
				 *
				*/
				results_pruned[i].hashtags = [];
				for(var k = 0; k < hashtags.length; k++){
					if(results_pruned[i].text.toLowerCase().indexOf( hashtags[k].toLowerCase() ) >= 0){
						results_pruned[i].hashtags.push( hashtags[k] );
					}
				}


				var sb = '';
				for(var j = 0; j < (24 - results_pruned[i].id_str.length); j++){
					sb = sb + '0';
				}

				results_pruned[i].id_bson = sb + results_pruned[i].id_str;

				//console.log('results_pruned[i].id_bson now: ' + results_pruned[i].id_bson + ' with length: '+results_pruned[i].id_bson.length);


				db.collection('tweets', function(err, collection) {
			        collection.update({_id:new BSON.ObjectID(results_pruned[i].id_bson)}, {"$set": results_pruned[i]}, {safe:true, upsert:true}, function(err, result) {
			        	if (err) {
			                console.log('error: An error has occurred in trying to upsert into the DB tweets collection');
			                console.log(err);
			            } else {
			                //console.log('Success: ' + JSON.stringify(result[0]));
			                //res.send(result[0]);
			            }
			        });
		    	});
			}
				

		});

};



 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var tweets = [
	    {
	      "created_at": "Mon Feb 25 23:59:55 +0000 2013",
	      "id": 306191831249600500,
	      "id_str": "306191831249600513",
	      "text": "Without the architect presenting challenging design, the manufact industry would tend towards generic/ homogenous solutions. #wood022513",
	      "source": "<a href=\"http://www.twitter.com\" rel=\"nofollow\">Twitter for Windows Phone</a>",
	      "user": {
	        "id": 216424663,
	        "id_str": "216424663",
	        "name": "Jeffrey Montes",
	        "screen_name": "jetportal",
	        "location": "New York, NY",
	        "description": "designer // photographer\r\nMaster of Architecture Candidate at the Graduate School of Architecture, Planning and Preservation at Columbia University, NY, NY",
	        "created_at": "Tue Nov 16 17:55:37 +0000 2010",
	        "utc_offset": -18000,
	        "time_zone": "Eastern Time (US & Canada)",
	        "geo_enabled": false,
	      },
	      "geo": null,
	      "coordinates": null,
	      "place": null,
	      "entities": {
	        "hashtags": [
	          {
	            "text": "wood022513",
	            "indices": [
	              125,
	              136
	            ]
	          }
	        ],
	        "urls": [],
	        "user_mentions": []
	      },
	      "retweeted": false
	    },
	    {
	      "created_at": "Mon Feb 25 18:52:09 +0000 2013",
	      "id": 306114377717780500,
	      "id_str": "306114377717780480",
	      "text": "Flow in Wood Aud tonight. Launching \"Digital Workflows in Architecture: Desgin—Asembly—Industry\" #wood022513 http://t.co/OQ5HtWQUgc",
	      "source": "web",
	      "user": {
	        "id": 38674242,
	        "id_str": "38674242",
	        "name": "GSAPP",
	        "screen_name": "GSAPPonline",
	        "location": "New York, NY",
	        "description": "Columbia University Graduate School of Architecture, Planning and Preservation",
	        "created_at": "Fri May 08 14:22:26 +0000 2009",
	        "utc_offset": -18000,
	        "time_zone": "Eastern Time (US & Canada)",
	        "geo_enabled": true,
	      },
	      "geo": null,
	      "coordinates": null,
	      "place": null,
	      "entities": {
	        "hashtags": [
	          {
	            "text": "wood022513",
	            "indices": [
	              97,
	              108
	            ]
	          }
	        ],
	        "urls": [
	          {
	            "url": "http://t.co/OQ5HtWQUgc",
	            "expanded_url": "http://events.gsapp.org/event/flow-digital-workflows-in-architecture-design%E2%80%94assembly%E2%80%94industry",
	            "display_url": "events.gsapp.org/event/flow-dig…",
	            "indices": [
	              109,
	              131
	            ]
	          }
	        ],
	        "user_mentions": []
	      },
	      "retweeted": false,
	    }
    ];
 
    db.collection('tweets', function(err, collection) {
        collection.insert(tweets, {safe:true}, function(err, result) {});
    });
 
};