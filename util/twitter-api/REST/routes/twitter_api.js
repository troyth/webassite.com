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

//var testBlock = new Array('art', 'bowery', 'museum', 'basketball');

var block1 = new Array('273bowery', '269bowery', '267bowery', '265bowery', '263bowery', '261bowery', '259bowery', '257bowery', '255bowery', '2stanton');
var block2 = new Array('245bowery', '243bowery', '241bowery', '239bowery', '235bowery', '231bowery', '229bowery', '227bowery', '225bowery', '223bowery', '221bowery', '219bowery', '217bowery', '215bowery', '4rivington', '6rivington', '8rivington', '12rivington', '16rivington', '181chrystie', '183chrystie', '187chrystie', '189chrystie', '191chrystie', '195chrystie', '199chrystie', '201chrystie', '203chrystie', '205chrystie');

//var block2 = new Array('245bowery', '243bowery', '241bowery', '239bowery', '235bowery', '231bowery', '229bowery', '227bowery', '225bowery', '223bowery', '221bowery', '219bowery', '217bowery', '215bowery', '4rivington', '6rivington', '8rivington', '12rivington', '16rivington', '181chrystie', '183chrystie', '187chrystie', '189chrystie', '191chrystie', '195chrystie', '199chrystie', '201chrystie', '203chrystie', '205chrystie', '9stanton', '11stanton', '13stanton', '15stanton', '17stanton');
var block3 = new Array('213bowery','209bowery','207bowery','199bowery','197bowery','195bowery','193bowery','191bowery','189bowery','187bowery','185bowery','183bowery','6delancey','10delancey','12delancey','14delancey','16delancey','18delancey','155chrystie','157chrystie','159chrystie','163chrystie','165chrystie','167chrystie','169chrystie','173chrystie','17rivington','15rivington','11rivington','7rivington','5rivington');


var fetchBlock1 = new Array('273bowery', '269bowery', '267bowery', '265bowery', '263bowery', '261bowery', '259bowery', '257bowery', '255bowery', '2stanton', '9stanton', '11stanton', '13stanton', '15stanton', '17stanton');
var fetchBlock2 = new Array('245bowery', '243bowery', '241bowery', '239bowery', '235bowery', '231bowery', '229bowery', '227bowery', '225bowery', '223bowery', '221bowery', '219bowery', '217bowery', '215bowery', '4rivington', '6rivington', '8rivington', '12rivington', '16rivington', '181chrystie', '183chrystie', '187chrystie', '189chrystie', '191chrystie', '195chrystie', '199chrystie', '201chrystie', '203chrystie', '205chrystie');
var fetchBlock3 = new Array('213bowery','209bowery','207bowery','199bowery','197bowery','195bowery','193bowery','191bowery','189bowery','187bowery','185bowery','183bowery','6delancey','10delancey','12delancey','14delancey','16delancey','18delancey','155chrystie','157chrystie','159chrystie','163chrystie','165chrystie','167chrystie','169chrystie','173chrystie','17rivington','15rivington','11rivington','7rivington','5rivington');

var boweryBlocks = block1.concat(block2, block3);//a block of all the blocks
boweryBlocks = prependHash(boweryBlocks);

var block1Hashed = prependHash(fetchBlock1);
var block2Hashed = prependHash(fetchBlock2);
var block3Hashed = prependHash(fetchBlock3);

//var testBlockStr = prependHash(testBlock);


var boweryBlocksQueryString = boweryBlocks.join(',');

var boweryBlocksRESTqueryStr = [];
boweryBlocksRESTqueryStr[1] = block1Hashed.join(' OR ');
boweryBlocksRESTqueryStr[2] = block2Hashed.join(' OR ');//testBlockStr.join(' OR ')
boweryBlocksRESTqueryStr[3] = block3Hashed.join(' OR ');

var streamBoundsStart = [];
streamBoundsStart['movements'] = [];
streamBoundsStart['streetcache'] = [];

<<<<<<< HEAD
streamBoundsStart['streetcache'][0] = -73.998609;//-73.995076;//-73.994401
streamBoundsStart['streetcache'][1] = 40.717073;//40.720136;//40.717371
=======
streamBoundsStart['streetcache'][0] = -73.995076;//-73.994401
streamBoundsStart['streetcache'][1] = 40.720136;//40.717371
>>>>>>> sync

streamBoundsStart['movements'][0] = -180;//-73.994401
streamBoundsStart['movements'][1] = -90;//40.717371

var streamBoundsEnd = [];
streamBoundsEnd['movements'] = [];
streamBoundsEnd['streetcache'] = [];

<<<<<<< HEAD
streamBoundsEnd['streetcache'][0] = -73.986817;//-73.9900;//-73.991482
streamBoundsEnd['streetcache'][1] = 40.729753;//40.723254;//40.725795
=======
streamBoundsEnd['streetcache'][0] = -73.9900;//-73.991482
streamBoundsEnd['streetcache'][1] = 40.723254;//40.725795
>>>>>>> sync

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


var streetcacheTwit = new twitter({
  consumer_key: '7K7jC8lI9tQzJfcyReTxA',
  consumer_secret: 'PqlONZjcrPAcpJzFn7v3wEm4VlvZI4MjVRPwM4MvCes',
  access_token_key: '1228783244-ytN5ilwLfePgBUyzw6u2NDPpRSn7rEpXBVlSjGS',
  access_token_secret: '3ij0V7ZpGJA7J8QrMWwnKkASfKvvVeh5cDsj0E5CQ'
});



exports.sendTweet = function(req, res){
    console.log('');
    console.log('**** TESTING POST REQUEST ***');

    var tweettext = req.body.tweettext;
    var default1text = req.body.default1;
    var default2text = req.body.default2;

    var status = default1text+ tweettext + default2text;

<<<<<<< HEAD
=======
    console.log( status );
    console.log('default1text: '+ default1text);
    console.log('');console.log('');
>>>>>>> sync

    streetcacheTwit.verifyCredentials(function (err, data) {
        console.log(data);
      })
      .updateStatus(status,
        function (err, data) {
            if(err){
                console.log("Error: trying to tweet from @streetcache with : "+ status);
                console.log(err);
            }else{
                console.log('SUCCESS: tweeted from @streetcache with: '+ status);
                console.log(data);
            }
         
        }
  );

}


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

function prependHash(arr){
    for(var i = 0; i < arr.length; i++){
        arr[i] = '#' + arr[i];
    }

    return arr;
}

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
 *  count(col)
 *
 *  Returns the total number of documents in the col collection
 *
*/
exports.countAll = function(req, res){
    var col = req.params.collection;
    db.collection(col, function(err, collection) {
        var total = collection.count(function(err, total) {
            if(err){
                console.log('Error: error trying to count total documents in ' + col + ' collection');
                console.log(err);
            }else{
                console.log('####### TOTAL TWEETS in ' + col + ' collection: '+ total + ' #######');
                res.jsonp(total);
            }
        });
    });
}


/*
 *	findByHashtagLimited(req, res)
 *
 *	Returns (up to) the :limit most recent tweets in reverse chronological order that have 
 *	come from the Bowery region with the hashtag of :hashtag
 *
*/
exports.findByHashtagLimited = function(req, res) {
    var col = req.params.collection;
    var hashtag = req.params.hashtag;//prepend #
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
 *  findByUsernameLimited(req, res)
 *
 *  Returns (up to) the :limit most recent tweets in reverse chronological order that have 
 *  come from the Bowery region with the hashtag of :hashtag
 *
*/
exports.findByUsernameLimited = function(req, res) {
    var col = req.params.collection;
    var username = req.params.username;
    var limit = req.params.limit;
    limit = parseInt(limit);

    console.log('findByUsernameLimited called on ' + col + ' collection with username: '+ username);
  
    db.collection(col, function(err, collection) {
        collection.find({"user.screen_name": username}).sort({"timestamp":-1}).limit(limit).toArray(function(err, item) {
            if(err) {
                console.log('error: An error has occurred in trying to find a tweets with username: '+ username);
                console.log(err);
            } else {
                console.log('Success: Tweets have been found and returned with username: '+ username);
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
    var hashtag = req.params.hashtag;//prepend #
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
 *  countByHashtagLimited(req, res)
 *
 *  Returns the number of tweets for a given :hashtag within the last :seconds
*/
exports.countByHashtagTimeWindow = function(req, res) {
    var col = req.params.collection;
    var hashtag = req.params.hashtag;//prepend #
    var time_window = req.params.timewindow * 1000;//multiply seconds to milliseconds
    console.log('countByHashtagTimeWindow() called on '+ col +' collection with hashtag: '+ hashtag);

    var d = new Date();
    var current_time = d.getTime();
    //current_time = current_time - (d.getTimezoneOffset() * 60 * 1000);//add the offset to convert server time to UTC
    var min_time = current_time - time_window;

    var m = new Date(min_time);

    //console.log("calling findStreamRecentTimeWindow() with min_time: "+ m.toString() );
  
    db.collection(col, function(err, collection) {
        collection.find({'hashtags': hashtag,  "timestamp": { $gt: min_time } }).limit(RESPONSE_LIMIT).toArray(function(err, total) {
            if(err) {
                console.log('error: An error has occurred in trying to return the tweets with hashtag: '+ hashtag + ' within timewindow: '+time_window);
                console.log(err);
            } else {
                console.log('Success: Returned '+ total +' tweets with hashtag: '+ hashtag + ' within timewindow: '+ time_window);
                res.jsonp(total);
            }
            
        });
    });
};




/*
 *  findByHashtagTimeWindow(req, res)
 *
 *  Returns the number of tweets for a given :hashtag within the last :seconds
*/
exports.findByHashtagTimeWindow = function(req, res) {
    var col = req.params.collection;
    var hashtag = req.params.hashtag;//prepend #
    var time_window = req.params.timewindow * 1000;//multiply seconds to milliseconds
    console.log('findByHashtag() called on '+ col +' collection with hashtag: '+ hashtag);

    var d = new Date();
    var current_time = d.getTime();
    //current_time = current_time - (d.getTimezoneOffset() * 60 * 1000);//add the offset to convert server time to UTC
    var min_time = current_time - time_window;

    var m = new Date(min_time);

    //console.log("calling findStreamRecentTimeWindow() with min_time: "+ m.toString() );
  
    db.collection(col, function(err, collection) {
        collection.find({'hashtags': hashtag,  "timestamp": { $gt: min_time } }).limit(RESPONSE_LIMIT).toArray(function(err, items) {
            if(err) {
                console.log('error: An error has occurred in trying to count the tweets with hashtag: '+ hashtag + ' within timewindow: '+time_window);
                console.log(err);
            } else {
                console.log('Success: returned tweets with hashtag: '+ hashtag + ' within timewindow: '+ time_window);
                res.jsonp(items);
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
    var blockNumber = req.params.block;//prepend #
    var time_window = req.params.timewindow * 1000;//multiply seconds to milliseconds
<<<<<<< HEAD
    console.log('findByHashtag called on ' + col + ' collection from block number: '+ blockNumber);
=======
    console.log('countByBlockLimited called on ' + col + ' collection with block: '+ block);
>>>>>>> sync

    var d = new Date();
    var current_time = d.getTime();
    //current_time = current_time - (d.getTimezoneOffset() * 60 * 1000);//add the offset to convert server time to UTC
    var min_time = current_time - time_window;

    var m = new Date(min_time);

    //console.log("calling findStreamRecentTimeWindow() with min_time: "+ m.toString() );

    var errorThrow = false;
    var block;

    switch(blockNumber){
    	case '1':
<<<<<<< HEAD
    		db.collection(col, function(err, collection) {
                collection.find({'hashtags': { $in : [ '273bowery', '269bowery', '267bowery', '265bowery', '263bowery', '261bowery', '259bowery', '257bowery', '255bowery', '2stanton' ]},  "timestamp": { $gt: min_time } }).count(function(err, total) {
                    if(err) {
                        console.log('error: An error has occurred in trying to count the tweets on block: '+ block + ' within timewindow: '+time_window);
                        console.log(err);
                    } else {
                        console.log('Success: Counted '+ total +' tweets on block: '+ block + ' within timewindow: '+ time_window);
                        res.jsonp(total);
                    }
                    
                });
            });
    		break;
    	case '2':
    		db.collection(col, function(err, collection) {
                collection.find({'hashtags': { $in : [ '245bowery', '243bowery', '241bowery', '239bowery', '235bowery', '231bowery', '229bowery', '227bowery', '225bowery', '223bowery', '221bowery', '219bowery', '217bowery', '215bowery', '4rivington', '6rivington', '8rivington', '12rivington', '16rivington', '181chrystie', '183chrystie', '187chrystie', '189chrystie', '191chrystie', '195chrystie', '199chrystie', '201chrystie', '203chrystie', '205chrystie' ]},  "timestamp": { $gt: min_time } }).count(function(err, total) {
=======
    		//block = new Array(block2);

            db.collection(col, function(err, collection) {
                collection.find({'hashtags': { $in : [ '273bowery', '269bowery', '267bowery', '265bowery', '263bowery', '261bowery', '259bowery', '257bowery', '255bowery', '2stanton' ] },  "timestamp": { $gt: min_time } }).count(function(err, total) {
>>>>>>> sync
                    if(err) {
                        console.log('error: An error has occurred in trying to count the tweets on block: '+ block + ' within timewindow: '+time_window);
                        console.log(err);
                    } else {
                        console.log('Success: Counted '+ total +' tweets on block: '+ block + ' within timewindow: '+ time_window);
                        res.jsonp(total);
                    }
                    
                });
            });
<<<<<<< HEAD
    		break;
    	case '3':
    		db.collection(col, function(err, collection) {
                collection.find({'hashtags': { $in : [ '213bowery','209bowery','207bowery','199bowery','197bowery','195bowery','193bowery','191bowery','189bowery','187bowery','185bowery','183bowery','6delancey','10delancey','12delancey','14delancey','16delancey','18delancey','155chrystie','157chrystie','159chrystie','163chrystie','165chrystie','167chrystie','169chrystie','173chrystie','17rivington','15rivington','11rivington','7rivington','5rivington' ]},  "timestamp": { $gt: min_time } }).count(function(err, total) {
=======

    		break;
    	case '2':
    		//block = new Array(block3);

            db.collection(col, function(err, collection) {
                collection.find({'hashtags': { $in : [ '245bowery', '243bowery', '241bowery', '239bowery', '235bowery', '231bowery', '229bowery', '227bowery', '225bowery', '223bowery', '221bowery', '219bowery', '217bowery', '215bowery', '4rivington', '6rivington', '8rivington', '12rivington', '16rivington', '181chrystie', '183chrystie', '187chrystie', '189chrystie', '191chrystie', '195chrystie', '199chrystie', '201chrystie', '203chrystie', '205chrystie' ] },  "timestamp": { $gt: min_time } }).count(function(err, total) {
>>>>>>> sync
                    if(err) {
                        console.log('error: An error has occurred in trying to count the tweets on block: '+ block + ' within timewindow: '+time_window);
                        console.log(err);
                    } else {
                        console.log('Success: Counted '+ total +' tweets on block: '+ block + ' within timewindow: '+ time_window);
                        res.jsonp(total);
                    }
                    
                });
            });
<<<<<<< HEAD
=======

>>>>>>> sync
    		break;
        case '3':
            //block = new Array(block1);
            db.collection(col, function(err, collection) {
                collection.find({'hashtags': { $in : [ '213bowery','209bowery','207bowery','199bowery','197bowery','195bowery','193bowery','191bowery','189bowery','187bowery','185bowery','183bowery','6delancey','10delancey','12delancey','14delancey','16delancey','18delancey','155chrystie','157chrystie','159chrystie','163chrystie','165chrystie','167chrystie','169chrystie','173chrystie','17rivington','15rivington','11rivington','7rivington','5rivington' ] },  "timestamp": { $gt: min_time } }).count(function(err, total) {
                    if(err) {
                        console.log('error: An error has occurred in trying to count the tweets on block: '+ block + ' within timewindow: '+time_window);
                        console.log(err);
                    } else {
                        console.log('Success: Counted '+ total +' tweets on block: '+ block + ' within timewindow: '+ time_window);
                        res.jsonp(total);
                    }
                    
                });
            });


            break;
    	default:
<<<<<<< HEAD
    		console.log('countByBlockLimited(): improper block specified;');
    		break;
    }


=======
            console.log('error! block is not 1, 2 or 3');
    		errorThrow = true;
    		break;
    }

    console.log('block is array with: ');
    console.dir(block);

    if( !errorThrow && false){

    	for(var i = 0; i < block.length; i++){
    		block[i] = block[i];
    	}

  
	    db.collection(col, function(err, collection) {
	        collection.find({'hashtags': { $in : block },  "timestamp": { $gt: min_time } }).count(function(err, total) {
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
>>>>>>> sync
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





















/*
 *  fetch()
 *
 *  Fetches tweets from the Twitter search API and puts them in the Mongo db collection 'tweets'
 *
*/
exports.fetch = function(col, block){

    switch(block){
        case 1:
            var blockArray = block1;
            break;
        case 2:
            var blockArray = block2;
            break;
        default:
            var blockArray = block3;
            break;
    }

    console.log('');console.log('');console.log('');
    console.log('fetching tweets with query: ');
    console.log(boweryBlocksRESTqueryStr[ block ]);

    //console.log('****FETCHING FROM TWITTER REST API WITH SEARCH TERMS: '+ searchterms);

    twit.verifyCredentials(function (err, data) {
            //console.log(data);
        });

    //twit.search(boweryBlocksRESTqueryStr[ block ], {'geocode':'40.722337,-73.992844,20km'}, function(err, data) {
    twit.search(boweryBlocksRESTqueryStr[ block ], {}, function(err, data) {

        if(err){
            console.log('Error called in twit.search of .fetch():');
            console.log(err);
        }else{
            var results_pruned = data.results;
            
            for(var i = 0; i < data.results.length; i++){
                //@todo: only copy over the fields we need
                //results_pruned[i]._id = results_pruned[i].id;//set the mongo primary key, _id, to the tweet id for easy retreival
                
                //console.log('adding to db collection results_pruned['+i+'] with tweet id: '+ results_pruned[i].id_str);

                var timestamp = new Date(results_pruned[i].created_at);

                results_pruned[i].timestamp = timestamp.getTime();


                /*
                 *  SPECIFICALLY FOR GROUP 2 ONLY : adds the hashtag clearly
                 *
                */
                results_pruned[i].hashtags = [];
                for(var k = 0; k < blockArray.length; k++){
                    if(results_pruned[i].text.toLowerCase().indexOf( blockArray[k].toLowerCase() ) >= 0){
                        results_pruned[i].hashtags.push( blockArray[k] );
                    }
                }


                var sb = '';
                for(var j = 0; j < (24 - results_pruned[i].id_str.length); j++){
                    sb = sb + '0';
                }

                results_pruned[i].id_bson = sb + results_pruned[i].id_str;

                //console.log('results_pruned[i].id_bson now: ' + results_pruned[i].id_bson + ' with length: '+results_pruned[i].id_bson.length);


                db.collection(col, function(err, collection) {
                    collection.update({_id:new BSON.ObjectID(results_pruned[i].id_bson)}, {"$set": results_pruned[i]}, {safe:true, upsert:true}, function(err, result) {
                        if (err) {
                            console.log('error: An error has occurred in trying to upsert into the DB tweets collection');
                            console.log(err);
                        } else {
                            //console.log('Success: added tweet to ' + col + ' collection');
                            //res.send(result[0]);
                        }
                    });
                });
            }
        }        

    });

<<<<<<< HEAD
};// end fetch


exports.fetchAtStreetcache = function(){

    twit.verifyCredentials(function (err, data) {
            //console.log(data);
        });

    //twit.search(boweryBlocksRESTqueryStr[ block ], {'geocode':'40.722337,-73.992844,20km'}, function(err, data) {
    twit.search('@streetcache', {}, function(err, data) {

        if(err){
            console.log('Error called in twit.search of fetchAtStreetcache():');
            console.log(err);
        }else{
            var results_pruned = data.results;
            
            for(var i = 0; i < data.results.length; i++){
                var timestamp = new Date(results_pruned[i].created_at);

                results_pruned[i].timestamp = timestamp.getTime();

                //create a string to with the right length to convert tweet id to mongo db _id in BSON ID format
                var sb = '';
                for(var j = 0; j < (24 - results_pruned[i].id_str.length); j++){
                    sb = sb + '0';
                }

                results_pruned[i].id_bson = sb + results_pruned[i].id_str;

                //console.log('results_pruned[i].id_bson now: ' + results_pruned[i].id_bson + ' with length: '+results_pruned[i].id_bson.length);


                db.collection('atstreetcache', function(err, collection) {
                    collection.update({_id:new BSON.ObjectID(results_pruned[i].id_bson)}, {"$set": results_pruned[i]}, {safe:true, upsert:true}, function(err, result) {
                        if (err) {
                            console.log('error: An error has occurred in trying to upsert into the DB atstreetcache collection');
                            console.log(err);
                        } else {
                            //console.log('Success: added tweet to ' + col + ' collection');
                            //res.send(result[0]);
                        }
                    });
                });
            }
        }        

    });

};// end fetchAtStreetcache
=======
};
>>>>>>> sync















