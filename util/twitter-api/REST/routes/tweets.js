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

exports.findByHashtagLimited = function(req, res) {
    var hashtag = '#' + req.params.hashtag;//prepend #
    var limit = req.params.limit;
    limit = parseInt(limit);

    console.log('findByHashtag called with hashtag: '+ hashtag);
  
    db.collection('tweets', function(err, collection) {
        collection.find({'hashtags': hashtag}).sort({"timestamp":-1}).limit(limit).toArray(function(err, item) {
        	if(err) {
                console.log('error: An error has occurred in trying to find a tweets with hashtag: '+ hashtag);
                console.log(err);
            } else {
                console.log('Success: Tweets have been found and returned with hashtag: '+ hashtag);
                res.send(item);
            }
            
        });
    });
};

exports.findByHashtag = function(req, res) {
    var hashtag = '#' + req.params.hashtag;//prepend #
    console.log('findByHashtag called with hashtag: '+ hashtag);
  
    db.collection('tweets', function(err, collection) {
        collection.find({'hashtags': hashtag}).sort({"timestamp":-1}).limit(RESPONSE_LIMIT).toArray(function(err, item) {
        	if(err) {
                console.log('error: An error has occurred in trying to find a tweets with hashtag: '+ hashtag);
                console.log(err);
            } else {
                console.log('Success: Tweets have been found and returned with hashtag: '+ hashtag);
                res.send(item);
            }
            
        });
    });
};
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById called');
    console.log('Retrieving tweet: ' + id);
    db.collection('tweets', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
        	if(err) {
                console.log('error: An error has occurred in trying to find a tweet document by id with _id: '+ id);
                console.log(err);
            } else {
                console.log('Success: A tweet has been found and returned with _id: '+ id);
                res.send(item);
            }
            
        });
    });
};
 
exports.findAll = function(req, res) {
	console.log('trying to findAll');

    db.collection('tweets', function(err, collection) {
        collection.find().sort({"timestamp":-1}).limit(RESPONSE_LIMIT).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAllLimited = function(req, res) {
	var limit = req.params.limit;
	console.log('trying to findRecent with limit: '+ limit);

	limit = parseInt(limit);

    db.collection('tweets', function(err, collection) {
        collection.find().sort({"timestamp":-1}).limit(limit).toArray(function(err, items) {
            res.jsonp(items);
        });
    });
};

exports.showAll = function(){
	console.log('trying to showAll');
	db.collection('tweets', function(err, collection) {
        collection.find().toArray(function(err, items) {
        	//@todo: error handling
            console.log(items);
        });
    });

}


/*
 *	clear()
 *
 *	Deletes all documents in the Mongo db collection 'tweets'
 *
*/
exports.clear = function(){
	db.collection('tweets', function(err, collection) {
        collection.remove();
    });

    console.log('cleared all documents in tweets collection');
}


function createSearchterms(){

	return hashtags.join(' OR ');
}



exports.countStream = function(){
	db.collection('tweetstream', function(err, collection) {
		var total = collection.count(function(err, total) {
			if(err){
				console.log('Error: error trying to count total documents in tweetstream db');
			}else{
				console.log('####### TOTAL STREAM TWEETS IN DB: '+ total + ' #######');
			}
		});
    });

    db.collection('tweetstream', function(err, collection) {
		var total = collection.find({"geo": null}).count(function(err, total) {
			if(err){
				console.log('Error: error trying to count total documents in tweetstream db');
			}else{
				console.log('####### TOTAL STREAM TWEETS IN DB WITHOUT GEO: '+ total + ' #######');
			}
		});
    });
}

exports.findAllStream = function(req, res) {
	console.log('trying to findAllStream');
    
    db.collection('tweetstream', function(err, collection) {
        collection.find().limit(RESPONSE_LIMIT).toArray(function(err, items) {
            res.jsonp(items);
        });
    });
};

/*
 *	stream()
 *
 *	Streams the twitter API storing all tweets from the Bowery in the last day
 *
*/
exports.stream = function(){
	twit.stream('statuses/filter', {'locations':'-73.994401,40.717371,-73.991482,40.725795'}, function(stream) {
		console.log('starting to stream');
		stream.on('data', function (data) {
			//console.log(data);
			db.collection('tweetstream', function(err, collection) {
		        collection.insert(data, {safe:true}, function(err, result) {
		        	if (err) {
		                console.log('error: An error has occurred in trying to insert into the DB tweetstream collection');
		                console.log(err);
		            } else {
		                //console.log('Success: ' + JSON.stringify(result[0]));
		                //res.send(result[0]);
		            }
		        });
	    	});


		});
		
		setTimeout(stream.destroy, 14400000);//24hrs = 86400000, 14400000 = 4hrs
	});
}


/*
 *	fetch()
 *
 *	Fetches tweets from the Twitter search API and puts them in the Mongo db collection 'tweets'
 *
*/
exports.fetch = function(){

	var searchterms = createSearchterms();//create search terms out of the hashtag array

	console.log('****FETCHING FROM TWITTER REST API WITH SEARCH TERMS: '+ searchterms);

	twit.verifyCredentials(function (err, data) {
			//console.log(data);
		});


	twit.search(searchterms, {'geocode':'40.722337,-73.992844,1km'}, function(err, data) {
			//console.log(data);
			console.log('FETCH RETURNED '+data.results.length+ ' TWEETS');

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