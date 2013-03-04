var mongo = require('mongodb');
var twitter = require('ntwitter');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 

 
/*
 *******************************************************************************************************
 *******************************************************************************************************
 *  GLOBALS
 *******************************************************************************************************
 *******************************************************************************************************
*/
var RESPONSE_LIMIT = 300;

var block1 = new Array('273bowery', '269bowery', '267bowery', '265bowery', '263bowery', '261bowery', '259bowery', '257bowery', '255bowery', '2stanton');
var block2 = new Array('245bowery', '243bowery', '241bowery', '239bowery', '235bowery', '231bowery', '229bowery', '227bowery', '225bowery', '223bowery', '221bowery', '219bowery', '217bowery', '215bowery', '4rivington', '6rivington', '8rivington', '12rivington', '16rivington', '181chrystie', '183chrystie', '187chrystie', '189chrystie', '191chrystie', '195chrystie', '199chrystie', '201chrystie', '203chrystie', '205chrystie', '9stanton', '11stanton', '13stanton', '15stanton', '17stanton');
var block3 = new Array('213bowery','209bowery','207bowery','199bowery','197bowery','195bowery','193bowery','191bowery','189bowery','187bowery','185bowery','183bowery','6delancey','10delancey','12delancey','14delancey','16delancey','18delancey','155chrystie','157chrystie','159chrystie','163chrystie','165chrystie','167chrystie','169chrystie','173chrystie','17rivington','15rivington','11rivington','7rivington','5rivington');

var boweryBlocks = block1.concat(block2, block3);//a block of all the blocks

for(var i = 0; i < boweryBlocks.length; i++){
    boweryBlocks[i] = '#' + boweryBlocks[i];
}

var boweryBlocksQueryString = boweryBlocks.join(',');

var streamBoundsStart = [];
streamBoundsStart['movements'] = [];
streamBoundsStart['streetcache'] = [];

streamBoundsStart['streetcache'][0] = -73.995;//-73.994401
streamBoundsStart['streetcache'][1] = 40.717;//40.717371

streamBoundsStart['movements'][0] = -180;//-73.994401
streamBoundsStart['movements'][1] = -90;//40.717371

var streamBoundsEnd = [];
streamBoundsEnd['movements'] = [];
streamBoundsEnd['streetcache'] = [];

streamBoundsEnd['streetcache'][0] = -73.991;//-73.991482
streamBoundsEnd['streetcache'][1] = 40.726;//40.725795

streamBoundsEnd['movements'][0] = 180;//-73.991482
streamBoundsEnd['movements'][1] = 90;//40.725795


var streamBoundsString = [];
streamBoundsString['movements'] = streamBoundsStart['movements'].join(',') + ',' + streamBoundsEnd['movements'].join(',');
streamBoundsString['streetcache'] = streamBoundsStart['streetcache'].join(',') + ',' + streamBoundsEnd['streetcache'].join(',');



/*
 *******************************************************************************************************
 *******************************************************************************************************
 *  INIT
 *******************************************************************************************************
 *******************************************************************************************************
*/

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('group2_2013_tweetsdb', server, {safe:false});

var twit = new twitter({
  consumer_key: '53H5ThqX93SE3576cNbLRA',
  consumer_secret: 'a5XZVQ0TopZ8gZmcp0dhoMXnFuMtpzop6JRdTsFg00',
  access_token_key: '1223207689-0QVomPx6LdfgbHRXSlmY8GcU4j6xnQHw7ZNxYVK',
  access_token_secret: 'PLszYQorIl0ooEAITXsrIhj9WMyKniCIBG6FNXLJVQ'
});


db.open(function(err, db) {
    if(err) {
       console.log("Error opening 'group2_2013_tweetsdb' database:");
       console.log(err); 
    }else{
        console.log("Connected to 'group2_2013_tweetsdb' database");
    }
});







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

/*
 *  count(col)
 *
 *  Returns the total number of documents in the col collection
 *
*/
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
 *	TWITTER API MIRROR RESTful ACCESS FUNCTIONS
 *******************************************************************************************************
 *******************************************************************************************************
*/


/*
 *	findAll(req, res)
 *
 *	Returns (up to) the RESPONSE_LIMIT most recent tweets in reverse chronological order 
 *  from the :collection collection that have come from the Bowery region
 *
*/
exports.findAll = function(req, res) {
    var col = req.params.collection;
	console.log('findAll() in ' + col + ' collection');

    db.collection(col, function(err, collection) {
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
    var col = req.params.collection;
	var limit = req.params.limit;
	console.log('findAllLimited() in ' + col + ' collection with limit: '+ limit);

	limit = parseInt(limit);

    db.collection(col, function(err, collection) {
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
 *  findRecent(req, res)
 *
 *  Returns (up to) RESPONSE_LIMIT tweets in reverse chronological order that have been tweeted 
 *  since :timewindow from collection :collection that have come from the Bowery region
 *
*/
exports.findRecent = function(req, res) {
    var col = req.params.collection;
    var time_window = req.params.timewindow * 1000;//convert from seconds to ms
    console.log('findRecent() in ' + col + ' collection with time_window in ms: '+ time_window);

    var d = new Date();
    var current_time = d.getTime();
    //current_time = current_time - (d.getTimezoneOffset() * 60 * 1000);//add the offset to convert server time to UTC
    var min_time = current_time - time_window;

    var m = new Date(min_time);

    //console.log("calling findStreamRecentTimeWindow() with min_time: "+ m.toString() );
    
    db.collection(col, function(err, collection) {
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
 *	findById(req, res)
 *
 *	Returns single tweet with _id of :id
 *
*/
exports.findById = function(req, res) {
    var col = req.params.collection;
    var id = req.params.id;
    console.log('findById() in ' + col + ' collection with id: ' + id);

    db.collection(col, function(err, collection) {
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
    var col = req.params.collection;
    var hashtag = '#' + req.params.hashtag;//prepend #
    var limit = req.params.limit;
    limit = parseInt(limit);

    console.log('findByHashtag called on ' + col + ' collection with hashtag: '+ hashtag);
  
    db.collection(col, function(err, collection) {
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
    var col = req.params.collection;
    var hashtag = '#' + req.params.hashtag;//prepend #
    var time_window = req.params.timewindow * 1000;//multiply seconds to milliseconds
    console.log('findByHashtag() called on '+ col +' collection with hashtag: '+ hashtag);

    var d = new Date();
    var current_time = d.getTime();
    //current_time = current_time - (d.getTimezoneOffset() * 60 * 1000);//add the offset to convert server time to UTC
    var min_time = current_time - time_window;

    var m = new Date(min_time);

    //console.log("calling findStreamRecentTimeWindow() with min_time: "+ m.toString() );
  
    db.collection(col, function(err, collection) {
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
    var col = req.params.collection;
    var block = req.params.block;//prepend #
    var time_window = req.params.timewindow * 1000;//multiply seconds to milliseconds
    console.log('findByHashtag called on ' + col + ' collection with hashtag: '+ hashtag);

    var d = new Date();
    var current_time = d.getTime();
    //current_time = current_time - (d.getTimezoneOffset() * 60 * 1000);//add the offset to convert server time to UTC
    var min_time = current_time - time_window;

    var m = new Date(min_time);

    //console.log("calling findStreamRecentTimeWindow() with min_time: "+ m.toString() );

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
  
	    db.collection(col, function(err, collection) {
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
 *	stream(col)
 *
 *	Streams the twitter API into the col collection if tweet has a geo location and is within streamBoundsString[ col ] area
 *
*/
exports.stream = function(col){

    switch(col){
        case 'movements':
            var queryObject = {
                "track" : boweryBlocksQueryString
            };
            break;
        case 'streetcache':
            var queryObject = {
                "locations" : streamBoundsString[ col ]
            };
            break;
        default:
            var queryObject = {
                "locations" : streamBoundsString[ col ]
            };
            break;
    }


    twit.stream('statuses/filter', queryObject, function(stream) {//{'locations':'-73.994401,40.717371,-73.991482,40.725795'}
        console.log('');
        console.log('starting to stream tweets into collection ' + col);
        console.log('with location: ');
        console.dir(queryObject.locations);
        console.log('and tracking: ');
        console.dir(queryObject.track);

        stream.on('data', function (data) {
            //console.log('data ping for collection: '+ col);
            //set outside flag to true if the tweet is not in the area defined by streamBoundsString['streetcache']
            var outside = false;

            if( data.geo == null ){
                outside = true;
            }else{
                if( streamBoundsStart[ col ][1] > parseFloat(data.geo.coordinates[0])){
                    //console.log(streamBoundsStart[1] + ' > ' + data.geo.coordinates[0] + ' therefore outside 1');
                    outside = true;
                }
                if( parseFloat(data.geo.coordinates[0]) > streamBoundsEnd[ col ][1]){
                    //console.log(data.geo.coordinates[0] + ' > ' + streamBoundsEnd[1] + ' therefore outside 2');
                    outside = true;
                }
                if(streamBoundsEnd[ col ][0] < parseFloat(data.geo.coordinates[1])){
                    //console.log(streamBoundsEnd[0] + ' < ' + data.geo.coordinates[1] + ' therefore outside 3');
                    outside = true;
                }
                if(parseFloat(data.geo.coordinates[1]) < streamBoundsStart[ col ][0]){
                    //console.log(data.geo.coordinates[1] + ' < ' + streamBoundsStart[0] + ' therefore outside 4');
                    outside = true;
                }
            }

            //console.log('outside: '+ outside);
            
            //if a valid tweet, upsert into the streetcache collection
            if(!outside){
                //add a unix timestamp to the tweet
                var timestamp = new Date(data.created_at);
                data.timestamp = timestamp.getTime();

                db.collection(col, function(err, collection) {
                    collection.insert(data, {safe:true}, function(err, result) {
                        if (err) {
                            console.log('Stream error: An error has occurred in trying to insert into the collection ' + col);
                            console.log(err);
                        } else {
                            console.log('Stream success: added a tweet to the collection ' + col);
                            //res.send(result[0]);
                        }
                    });
                });
            }
        });
    });
}//end .stream(col)
