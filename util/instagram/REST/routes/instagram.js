var mongo = require('mongodb');
var ig = require('instagram-node').instagram();

var fs = require('fs');
var Flickr = require('flickr-with-uploads').Flickr;

var request = require('request');
 
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
kinneLocations['kinneahmedabad'] = 'Ahmedabad';
kinneLocations['kinneagra'] = 'Agra';
kinneLocations['kinnedelhi'] = 'Delhi';
kinneLocations['kinneginza'] = 'Ginza';
kinneLocations['kinnehongkong'] = 'Hong Kong';



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
region['kinneahmedabad'] = 'south-asia';
region['kinneagra'] = 'south-asia';
region['kinnedelhi'] = 'south-asia';

region['kinneginza'] = 'east-asia';
region['kinnehongkong'] = 'east-asia';




//Flickr - assumes the tokens don't ever expire (or won't during the 2 weeks of Kinne travel)
var consumer_key = '1361ce967daf59821bc493392809c8e8';
var consumer_secret = '82a41cbf24541227';
var oauth_token = '72157632975405302-c06fccc501805e34';
var oauth_token_secret = '0e10ea84f7e19ae4';

// constructor arguments: new Flickr(consumer_key, consumer_secret, oauth_token, oauth_token_secret, base_url)
var client = new Flickr(consumer_key, consumer_secret, oauth_token, oauth_token_secret);

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
 *  HELPER FUNCTIONS
 *******************************************************************************************************
 *******************************************************************************************************
*/

//for Flickr
function api(method_name, data, callback) {
    // overloaded as (method_name, data, callback)
    return client.createRequest(method_name, data, true, callback).send();
}


function prependHash(arr){
    for(var i = 0; i < arr.length; i++){
        arr[i] = '#' + arr[i];
    }

    return arr;
}

/*
 *  showAll(col)
 *
 *  logs all tweets in collection col to the console
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
 *  clear(col)
 *
 *  Deletes all documents in the col collection
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
 *  INSTAGRAM API MIRROR RESTful ACCESS FUNCTIONS
 *******************************************************************************************************
 *******************************************************************************************************
*/

/*
 *  findAll(req, res)
 *
 *  Returns (up to) the RESPONSE_LIMIT most recent tweets in reverse chronological order 
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

exports.countAll = function(req, res) {
    var col = req.params.collection;
    console.log('countAll() in ' + col + ' collection');

    db.collection(col, function(err, collection) {
        collection.find().count(function(err, number) {
            res.jsonp(number);
        });
    });
};

exports.findUndefined = function(req, res) {
    var col = req.params.collection;
    console.log('findAll() in ' + col + ' collection');

    db.collection(col, function(err, collection) {
        collection.find({caption: undefined}).limit(RESPONSE_LIMIT).toArray(function(err, items) {
            var rtn = [];
            rtn.push('total' + items.length);
            rtn.push(items);
            res.jsonp(rtn);
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

    var maxItems = 30;
    var totalItems = 3;

    db.collection(col, function(err, collection) {
        collection.find().sort({"created_time":-1}).limit(maxItems).toArray(function(err, items) {
            if(err){
                console.log('Error: with findVariety(), error: ' + err);
                console.dir(err);
            }else{
                //choose 3 pics from 3 different locations from within the most recent 30 pics
                var returnItems = [];
                var locations = [];
                var idx = [];
                var j = 0;

                for(var i = 0; i < totalItems; i++){

                    var x = Math.floor(Math.random()*maxItems);
                    //try another random idx if already selected or if the location is already represented
                    while( (idx.indexOf(x) > -1) || (locations.indexOf( items[ x ].kinne_location ) > -1) ){
                        x = Math.floor(Math.random()*maxItems);
                    }
                    locations[ i ] = items[ x ].kinne_location;
                    idx[ i ] = x;
                    returnItems[ i ] = items[ x ];
                }
           
                res.jsonp(returnItems);
            }
        });
    });
};


exports.findUploaded = function(req, res) {
    var col = req.params.collection;
    console.log('findAll() in ' + col + ' collection that have been uploaded');

    var number;

    db.collection(col, function(err, collection) {
        collection.find({ uploaded: true }).count(function(err, result) {
            number = 'number of uploaded images: ' + result;
        });

        collection.find({ uploaded: true }).sort({"created_time":-1}).limit(RESPONSE_LIMIT).toArray(function(err, items) {
            /*
            for(var i = 0; i < items.length; i++){
                collection.update({ id: items[i].id }, {"$set": { uploaded: false }}, {safe:true}, function(err, result) {
                    if (err) {
                        console.log('error: An error has occurred in trying to upsert into the DB kinneinstagram collection');
                        console.log(err);
                    } else {
                        //console.log('Success: added tweet to ' + col + ' collection');
                        //res.send(result[0]);
                        console.log('set to uploaded false');
                    }
                });     
            }   
            */    

            items.push( number );
            res.jsonp(items);
        });
    });
};

exports.findNotUploaded = function(req, res) {
    var col = req.params.collection;
    console.log('findAll() in ' + col + ' collection that have been uploaded');

    var number;

    db.collection(col, function(err, collection) {
        collection.find({ uploaded: false }).count(function(err, result) {
            number = 'number of images not uploaded: ' + result;
        });

        collection.find({ uploaded: false }).sort({"created_time":-1}).limit(RESPONSE_LIMIT).toArray(function(err, items) {
            items.push( number );
            res.jsonp(items);
        });
    });
};


exports.findError = function(){
    db.collection('kinneinstagram', function(err, collection) {
                    collection.find({id: 22}).count(function(err, number){
                        if(err){
                            console.log('^^^^^^^^ findError() got an error, error:');
                            console.log(err);
                            console.dir(err);
                        }else{
                            console.log('^^^^^^^^ findError() got NO!!! error, number:');
                            console.log(number);
                        }
                    });


                    
                });

}


/*
 *  fetch()
 *
 *  Fetches tweets from the Twitter search API and puts them in the Mongo db collection 'tweets'
 *
*/
exports.fetch = function(tag){

    var loopFetch = function(err, medias, pagination, limit) {
        //console.log('got a return from #kinnecopenhagen:');
        //console.dir(medias);

        if(err){
            console.log('Error called in ig.tag_media_recent of instagram.fetch():');
            console.log(err);
        }else{

            var media;

            console.log('fetch() found ' + medias.length + ' photos for ' + tag);
            
            for(var i = 0; i < medias.length; i++){

                console.log('');
                console.log('');
                console.log('');
                console.dir(medias[i]);

                media = medias[i];

                if(media != undefined){
                    if( (kinneLocations[tag] != undefined) && (region[tag] != undefined)){
                        media.kinne_location = kinneLocations[tag];
                        media.region = region[tag];
                    }else{
                        console.log('region[tag] or kinneLocations[tag] undefined for tag: '+ tag);
                    }
                    
                    media.uploaded = false;

                    db.collection('kinneinstagram', function(err, collection) {
                        //only upsert (and make uploaded = false) if not already logged
                        collection.find({id: media.id}).count(function(err, number){
                            if(number < 1){
                                collection.update({id: media.id}, {"$set": media}, {safe:true, upsert:true}, function(err, result) {
                                    if (err) {
                                        console.log('error: An error has occurred in trying to upsert into the kinneinstagram collection');
                                        console.log(err);
                                    } else {
                                        console.log('Success: upserted instragram photo to kinneinstagram collection');
                                        //console.dir(result);
                                        //res.send(result[0]);
                                    }
                                });
                            }
                        });
                    });
                }else{
                    console.log('loopFetch: media is undefined');
                }
            }
        }

        if(pagination.next) {
            pagination.next(loopFetch); // Will get second page results
        }
    };

    ig.tag_media_recent(tag, loopFetch);


    
};// end fetch




/*
 *******************************************************************************************************
 *******************************************************************************************************
 *  FLICKR
 *******************************************************************************************************
 *******************************************************************************************************
*/

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


exports.saveToFlickr = function(){

    var path = __dirname + '/images/';
    var results = [];
    var filenames = [];
    var totalFiles = 0;
    var uploaded = 0;

    var timeoutId;

    var uploadToFlickr = function(){
       
        for(var i = 0; i < uploaded; i++){
            console.log('  ' + i + ' * uploading a photo to flickr');

            var fullpath = path + filenames[i];

            var tags = results[i].tags;
            tags.push( results[i].kinne_location.split(' ').join('-') );//replace spaces with dashes
            tags.push( results[i].user.username );
            tags.push( 'instagram' );
            tags.push( 'kinne2013' );
            tags.push( 'studio-x' );
            tags.push( 'GSAPP' );
            tagsString = tags.join(' ');

            //console.log('created: '+results[i].caption.created_time);

            var unixTime = parseInt( results[i].created_time ) * 1000;
            var d = new Date(unixTime);

            if(results[i].caption != null){
                var desc = results[i].caption.text + ' -- submitted ' + days[ d.getDay() ] + ', ' + months[ d.getMonth() ] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + d.getHours() + ':' + d.getMinutes();
            }else{
                console.log('photo has blank caption');
                var desc = '-- submitted ' + days[ d.getDay() ] + ', ' + months[ d.getMonth() ] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + d.getHours() + ':' + d.getMinutes();
            }

            
            var params = {
                title: 'Submitted through instagram by '+ results[i].user.full_name,
                description: desc,
                is_public: 1,
                is_friend: 0,
                is_family: 0,
                hidden: 2,
                content_type: 1,
                tags: tagsString,
                photo: fs.createReadStream(fullpath, {flags: 'r'})
            };

            // the method_name gets the special value of "upload" for uploads.
            api('upload', params, function(err, response) {
                if(err){
                    console.error("Could not upload photo. Error message:");
                    console.error(err.toString());
                    console.log('response: '+ response);
                }else{
                    console.log('successfully uploaded photo with id '+ results[i].id + ' to flickr');

                    db.collection('kinneinstagram', function(err, collection) {
                        collection.update({ id: results[i].id }, {"$set": { uploaded: true }}, {safe:true, upsert: true}, function(err, result) {
                            if (err) {
                                console.log('error: An error has occurred trying to set uploaded flag for photo with id: '+ results[i].id);
                                console.log(err);
                            } else {
                                console.log('set uploaded flag for photo with id '+ results[i].id);
                            }
                        });
                    });

                    // usually, the method name is precisely the name of the API method, as they are here:
                    api('flickr.photos.getInfo', {photo_id: response.photoid}, function(err, response) {
                        if(err){
                            console.log('Error getting info for photo on flickr');
                            console.log(err);
                        }else{

                            api('flickr.photosets.addPhoto', {photoset_id: "72157633086370649", photo_id: response.photo.id}, function(err) {
                                if(err){
                                    console.log('Error: attempting to migrate to photoset with id 72157633086370649');
                                    console.log(err);
                                }else{
                                    console.log('Successfully migrated flickr photo to set with id 72157633086370649');
                                    console.log('');console.log('');
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    //gets called each time an image is downloaded
    var downloadCallback = function(param1, param2, param3){
        uploaded++;

        if(uploaded >= totalFiles){
            console.log('all photos have been downloaded, attempting to upload to flickr');
            clearTimeout(timeoutId);
            uploadToFlickr();
        }
    }

    db.collection('kinneinstagram', function(err, collection) {
        collection.find({ uploaded: false }).sort({"created_time":-1}).limit(1).toArray(function(err, items) {
            console.log('');
            console.log('attempting to download ' + items.length + ' photos from instagram');
            totalFiles = items.length;
            results = items;

            if(items.length > 0 ){
                for(var i = 0; i < totalFiles; i++){
                    var filename = items[i].images.standard_resolution.url;
                    filename = filename.split('/').pop();
                    var pathname = path + filename;
                    filenames.push(filename);
                    //pipe the image to the pathname then trigger the downloadCallback callback
                    request( items[i].images.standard_resolution.url, downloadCallback ).pipe(fs.createWriteStream( pathname ));
                }
                return true;
            }else{
                return false;//no more items
            }

            //call uploadToFlickr after 60 seconds even if not all have been downloaded
            timeoutId = setTimeout( uploadToFlickr, 29000);
        });
    });
}


exports.resetUploadedFlag = function(){
    db.collection('kinneinstagram', function(err, collection) {
        collection.update({ uploaded: true }, {"$set": { uploaded: false }}, {safe:true, multi:true}, function(err, result) {
            if (err) {
                console.log('error: An error has occurred in trying to upsert into the DB kinneinstagram collection');
                console.log(err);
            } else {
                //console.log('Success: added tweet to ' + col + ' collection');
                //res.send(result[0]);
                console.log('');
                console.log('reset all photos to not yet uploaded');
                console.dir(result);
                console.log(result);
                console.log('');
            }
        });
    });
}

exports.setUploadedFlag = function(req, res){
    db.collection('kinneinstagram', function(err, collection) {
        collection.update({ type: 'image' }, {"$set": { uploaded: true }}, {safe:true, multi:true}, function(err, result) {
            if (err) {
                console.log('error: An error has occurred in trying to setUploadedFlag()');
                console.log(err);
            } else {
                //console.log('Success: added tweet to ' + col + ' collection');
                //res.send(result[0]);
                console.log('set ' + result.length + ' photos to uploaded');
                console.dir(result);
                console.log(result);
                res.jsonp('reset');
            }
        });
    });
}


exports.setKinneLocation = function(req, res){
    var tag = req.params.tags[0];

    if(tag != undefined){
        db.collection('kinneinstagram', function(err, collection) {
            collection.update({ type: 'image' }, {"$set": { uploaded: true }}, {safe:true, multi:true}, function(err, result) {
                if (err) {
                    console.log('error: An error has occurred in trying to setUploadedFlag()');
                    console.log(err);
                } else {
                    //console.log('Success: added tweet to ' + col + ' collection');
                    //res.send(result[0]);
                    console.log('set ' + result.length + ' photos to uploaded');
                    console.dir(result);
                    console.log(result);
                    res.jsonp('reset');
                }
            });
        });

    }

    
}



