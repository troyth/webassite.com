var mongo = require('mongodb');
var ig = require('instagram-node').instagram();
 
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

var kinneLocations = [];
kinneLocations['kinneamman'] = 'Amman';
kinneLocations['kinneatacama'] = 'Atacama';
kinneLocations['kinneathens'] = 'Athens';
kinneLocations['kinnebangalore'] = 'Bangalore';
kinneLocations['kinnebeijing'] = 'Beijing';
kinneLocations['kinnebordeaux'] = 'Bordeaux';
kinneLocations['kinnecannes'] = 'Cannes';
kinneLocations['kinnechandigarh'] = 'Chandigarh';
kinneLocations['kinnecopenhagen'] = 'Copenhagen';
kinneLocations['kinnegeneva'] = 'Geneva';
kinneLocations['kinnehyderabad'] = 'Hyderabad';
kinneLocations['kinneistanbul'] = 'Istanbul';
kinneLocations['kinnejohannesburg'] = 'Johannesburg';
kinneLocations['kinnekochi'] = 'Kochi';
kinneLocations['kinnekumasi'] = 'Kumasi';
kinneLocations['kinnekyoto'] = 'Kyoto';
kinneLocations['kinnelondon'] = 'London';
kinneLocations['kinnemedellin'] = 'Medellin';
kinneLocations['kinnemumbai'] = 'Mumbai';
kinneLocations['kinnenewdelhi'] = 'New Delhi';
kinneLocations['kinneparis'] = 'Paris';
kinneLocations['kinnerio'] = 'Rio de Janeiro';
kinneLocations['kinnerotterdam'] = 'Rotterdam';
kinneLocations['kinnesanfrancisco'] = 'San Francisco';
kinneLocations['kinnesaopaulo'] = 'Sao Paulo';
kinneLocations['kinneshanghai'] = 'Shanghai';
kinneLocations['kinnetokyo'] = 'Tokyo';
kinneLocations['kinnevenice'] = 'Venice';
kinneLocations['kinnevienna'] = 'Vienna';

var region = [];

region['kinneamman'] = 'middle-east';
region['kinneatacama'] = 'latin-america';
region['kinneathens'] = 'europe';
region['kinnebangalore'] = 'south-asia';
region['kinnebeijing'] = 'east-asia';
region['kinnebordeaux'] = 'europe';
region['kinnecannes'] = 'europe';
region['kinnechandigarh'] = 'south-asia';
region['kinnecopenhagen'] = 'europe';
region['kinnegeneva'] = 'europe';
region['kinnehyderabad'] = 'south-asia';
region['kinneistanbul'] = 'middle-east';
region['kinnejohannesburg'] = 'africa';
region['kinnekochi'] = 'south-asia';
region['kinnekumasi'] = 'africa';
region['kinnekyoto'] = 'east-asia';
region['kinnelondon'] = 'europe';
region['kinnemedellin'] = 'latin-america';
region['kinnemumbai'] = 'south-asia';
region['kinnenewdelhi'] = 'south-asia';
region['kinneparis'] = 'europe';
region['kinnerio'] = 'latin-america';
region['kinnerotterdam'] = 'europe';
region['kinnesanfrancisco'] = 'north-america';
region['kinnesaopaulo'] = 'latin-america';
region['kinneshanghai'] = 'east-asia';
region['kinnetokyo'] = 'east-asia';
region['kinnevenice'] = 'europe';
region['kinnevienna'] = 'europe';



/*
 *******************************************************************************************************
 *******************************************************************************************************
 *  INIT
 *******************************************************************************************************
 *******************************************************************************************************
*/

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('kinne2013_instagram', server, {safe:false});

db.open(function(err, db) {
    if(err) {
       console.log("Error opening 'kinne2013_instagram' database:");
       console.log(err); 
    }else{
        console.log("Connected to 'kinne2013_instagram' database");
    }
});

//GSAPPwidget client application
//ig.use({ access_token: 'YOUR_ACCESS_TOKEN' });
ig.use({ client_id: 'c590ebe3eda04afebe925e4c4d056fa5',
         client_secret: 'f4344c2e20ba4822b646e5ed50202282' });


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
				console.log('####### TOTAL INSTAGRAM PHOTOS in ' + col + ' collection is: '+ total + ' #######');
			}
		});
    });
}

/*
 *  countByTag(col, tag)
 *
 *  Returns the total number of documents in the col collection
 *
*/
exports.countByTag = function(col, tag){
    db.collection(col, function(err, collection) {
        var total = collection.find({ tags: tag }).count(function(err, total) {
            if(err){
                console.log('Error: error trying to count total documents in ' + col + ' collection with tag: '+ tag);
            }else{
                console.log('####### TOTAL INSTAGRAM PHOTOS in ' + col + ' collection with tag ' + tag + ' is: '+ total + ' #######');
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
        collection.find().sort({"created_time":-1}).limit(RESPONSE_LIMIT).toArray(function(err, items) {
            res.jsonp(items);
        });
    });
};

/*
 *  findLimit(req, res)
 *
 *  Returns (up to) RESPONSE_LIMIT tweets in reverse chronological order that have been tweeted 
 *  since :timewindow from collection :collection that have come from the Bowery region
 *
*/
exports.findLimit = function(req, res) {
    var col = req.params.collection;
    var limit = parseInt( req.params.limit );
    console.log('findRecent() in ' + col + ' collection with limit: '+ limit);


    db.collection(col, function(err, collection) {
        collection.find().sort({"created_time":-1}).limit(limit).toArray(function(err, items) {
            if(err){
                console.log('Error: with findLimit(), error: ' + err);
                console.dir(err);
            }else{
                console.log('Success: findLimit() returning ' + items.length + ' intagram photos');
                res.jsonp(items);
            }
        });
    });
};



/*
 *  findLimit(req, res)
 *
 *  Returns (up to) RESPONSE_LIMIT tweets in reverse chronological order that have been tweeted 
 *  since :timewindow from collection :collection that have come from the Bowery region
 *
*/
exports.findVariety= function(req, res) {
    var col = req.params.collection;
    var limit = parseInt( req.params.limit );
    console.log('');console.log('');console.log('');
    console.log('findVariety() in ' + col + ' collection with limit: '+ limit);

    var maxItems = 30;

    db.collection(col, function(err, collection) {
        collection.find().sort({"created_time":-1}).limit(maxItems).toArray(function(err, items) {
            if(err){
                console.log('Error: with findVariety(), error: ' + err);
                console.dir(err);
            }else{
                var locations = [];
                var returnItems = [];
                var j = 1;
                locations[0] = items[0].kinne_location;

                loop1:
                    for(var i = 1; i < maxItems; i++){
                        console.log('for with i: '+ i + ' and locations: ');
                        console.dir(locations);
                        if( locations.indexOf( items[i].kinne_location )  == -1){//if not already registered
                            locations[j] = items[i].kinne_location;
                            returnItems.push( items[i] );
                            j++;
                        }else{
                            console.log('already in locations array');
                        }
                        if( j > 3){
                            console.log('breaking loop');
                            break loop1;
                        }
                    }

                console.log('Success: findLimit() returning ' + returnItems.length + ' instagram photos');
                res.jsonp(returnItems);
            }
        });
    });
};










/*
 *  fetch()
 *
 *  Fetches tweets from the Twitter search API and puts them in the Mongo db collection 'tweets'
 *
*/
exports.fetch = function(tag){
    ig.tag_media_recent(tag, function(err, medias, pagination, limit) {
        //console.log('got a return from #kinnecopenhagen:');
        //console.dir(medias);

        if(err){
            console.log('Error called in ig.tag_media_recent of instagram.fetch():');
            console.log(err);
        }else{
            
            for(var i = 0; i < medias.length; i++){

                medias[i].kinne_location = kinneLocations[tag];
                medias[i].region = region[tag];

                db.collection('kinneinstagram', function(err, collection) {
                    collection.update({id: medias[i].id}, {"$set": medias[i]}, {safe:true, upsert:true}, function(err, result) {
                        if (err) {
                            console.log('error: An error has occurred in trying to upsert into the kinneinstagram collection');
                            console.log(err);
                        } else {
                            console.log('Success: upserted instragram photo to kinneinstagram collection');
                            console.dir(result);
                            //res.send(result[0]);
                        }
                    });
                });
            }
        }

    });
    
};// end fetch
















