var mongo = require('mongodb');

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


/*
 *******************************************************************************************************
 *******************************************************************************************************
 *	HELPER FUNCTIONS
 *******************************************************************************************************
 *******************************************************************************************************
*/

//for Flickr
function api(method_name, data, callback) {
    // overloaded as (method_name, data, callback)
    return client.createRequest(method_name, data, true, callback).send();
}


/*
 *******************************************************************************************************
 *******************************************************************************************************
 *  FLICKR
 *******************************************************************************************************
 *******************************************************************************************************
*/

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


var downloaded = 0;
var totalFiles;

function downloadRequestCallback(){
    downloaded++;
    if(downloaded >= totalFiles){
        console.log('total files downloaded: '+ totalFiles);
    }
}

var _items;

exports.downloadFromInstagram = function(){
    var path = __dirname + '/images/';


    db.collection('kinneinstagram', function(err, collection) {
        collection.find({ uploaded: false }).sort({"created_time":-1}).limit(100).toArray(function(err, items) {
            if(err){
                console.log('error in trying to find all uploaded photos');
                console.log(err);
            }else{
                console.log('');
                console.log('attempting to download ' + items.length + ' photos from instagram');
                totalFiles = items.length;
                _items = items;
                console.log('_items.length: '+ _items.length);

                if(items.length > 0 ){
                    for(var i = 0; i < totalFiles; i++){
                        var filename = items[i].images.standard_resolution.url;
                        filename = filename.split('/').pop();
                        var pathname = path + filename;
                        //pipe the image to the pathname then trigger the downloadCallback callback
                        request( items[i].images.standard_resolution.url, downloadRequestCallback ).pipe(fs.createWriteStream( pathname ));

                        collection.update({ id: _items[i].id }, {"$set": { uploaded: true }}, {safe:true, upsert: true}, function(err, result) {
                            if (err) {
                                console.log('error: An error has occurred trying to set uploaded flag for photo with id: '+ _items[i].id);
                                console.log(err);
                            } else {
                                console.log('set uploaded flag for photo');
                            }
                        });


                    }
                    return true;
                }else{
                    return false;//no more items
                }
            }
        });
    });
}


exports.countUploaded = function(req, res){
    db.collection('kinneinstagram', function(err, collection) {
        collection.find({ uploaded: true }).count(function(err, number) {
            console.log('countUploaded: '+ number);
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


exports.uploadToFlickr = function(lim){
       var path = __dirname + '/images/';

    db.collection('kinneinstagram', function(err, collection) {
        collection.find({ uploaded: false }).sort({"created_time":-1}).limit(lim).toArray(function(err, items) {

            for(var i = 0; i < lim; i++){
                console.log('  ' + i + ' * uploading a photo to flickr');

                var filename = items[i].images.standard_resolution.url;
                filename = filename.split('/').pop();
                var fullpath = path + filename;

                var tags = items[i].tags;
                tags.push( items[i].kinne_location.split(' ').join('-') );//replace spaces with dashes
                tags.push( items[i].user.username );
                tags.push( 'instagram' );
                tags.push( 'kinne2013' );
                tags.push( 'Studio-X' );
                tags.push( 'GSAPP' );
                tagsString = tags.join(' ');

                //console.log('created: '+results[i].caption.created_time);

                var unixTime = parseInt( items[i].created_time ) * 1000;
                var d = new Date(unixTime);

                if(items[i].caption != null){
                    var desc = items[i].caption.text + ' -- submitted ' + days[ d.getDay() ] + ', ' + months[ d.getMonth() ] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + d.getHours() + ':' + d.getMinutes();
                }else{
                    console.log('photo has blank caption');
                    var desc = '-- submitted ' + days[ d.getDay() ] + ', ' + months[ d.getMonth() ] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + d.getHours() + ':' + d.getMinutes();
                }

                var params = {
                    title: 'Submitted through instagram by '+ items[i].user.full_name,
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
            }//end for items



//
        });

    });
}



















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




