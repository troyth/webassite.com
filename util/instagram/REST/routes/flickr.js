var mongo = require('mongodb');
var fs = require('fs');
var Flickr = require('flickr-with-uploads').Flickr;
//var Magic = require('mmmagic').Magic;

//var magic = new Magic(mmm.MAGIC_MIME_TYPE);


var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

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




var consumer_key = '1361ce967daf59821bc493392809c8e8';
var consumer_secret = '82a41cbf24541227';
var oauth_token = '72157632975405302-c06fccc501805e34';
var oauth_token_secret = '0e10ea84f7e19ae4';

// constructor arguments: new Flickr(consumer_key, consumer_secret, oauth_token, oauth_token_secret, base_url)
var client = new Flickr(consumer_key, consumer_secret, oauth_token, oauth_token_secret);

function api(method_name, data, callback) {
	// overloaded as (method_name, data, callback)
	return client.createRequest(method_name, data, true, callback).send();
}

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// USED TO UPLOAD DB PHOTOS TO A FLICKR SET /////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


var max = 949;

var item,
	res,
	latitude,
	longitude;

var returnFlag = false;

var uploaded = 0;

exports.callUploadToFlickr = function(){

	uploadToFlickr();
}

function uploadToFlickr(){
    var path = __dirname + '/images/';

    db.collection('kinneinstagram', function(err, collection) {
        collection.find( { uploaded: false } ).sort({"created_time":-1}).limit(1).toArray(function(err, items) {

        	/*
        	[ { _id: 514ed05d7c45ad38f0372c53,
			    attribution: null,
			    caption: 
			     { created_time: '1363950016',
			       text: '#kinnemumbai',
			       from: [Object],
			       id: '417165428867474018' },
			    comments: { count: 2, data: [Object] },
			    created_time: '1363950015',
			    filter: 'Willow',
			    id: '417165422685069625_329613591',
			    images: 
			     { low_resolution: [Object],
			       thumbnail: [Object],
			       standard_resolution: [Object] },
			    kinne_location: 'Mumbai',
			    likes: { count: 1, data: [Object] },
			    link: 'http://instagram.com/p/XKEb3fuCE5/',
			    location: null,
			    region: 'south-asia',
			    tags: [ 'kinnemumbai' ],
			    type: 'image',
			    uploaded: false,
			    user: 
			     { username: 'davidmaxinran',
			       website: '',
			       profile_picture: 'http://images.instagram.com/profiles/profile_329613591_75sq_1363710799.jpg',
			       full_name: 'Xinran Ma',
			       bio: '',
			       id: '329613591' } } ]
			*/

			item = items[0];

            var filename = item.images.standard_resolution.url;
            filename = filename.split('/').pop();
            var fullpath = path + filename;

            console.log('file to upload: '+ filename);

            if(filename == '2637177e8d0011e2a74822000a9e2993_7.jpg'){
            	//removeFromDB();//DANGEROUS!!
            }

            /* USE TO DETECT IF PROPER IMAGE FILE OR NOT - NOT BUILDING!
            magic.detectFile(fullpath, function(err, result) {
			  if (err) throw err;
			  console.log(result);
			  // output on Windows with 32-bit node:
			  //    PE32 executable (DLL) (GUI) Intel 80386, for MS Windows
			});
*/

            var tags = item.tags;
            tags.push( item.kinne_location.split(' ').join('-') );//replace spaces with dashes
            tags.push( item.user.username );
            tags.push( 'instagram' );
            tags.push( 'kinne2013' );
            tags.push( 'Studio-X' );
            tags.push( 'GSAPP' );
            tagsString = tags.join(' ');

            //console.log('created: '+results[i].caption.created_time);

            var unixTime = parseInt( item.created_time ) * 1000;
            var d = new Date(unixTime);

            if(item.caption != null){
                var desc = item.caption.text + ' -- submitted ' + days[ d.getDay() ] + ', ' + months[ d.getMonth() ] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + d.getHours() + ':' + d.getMinutes();
            }else{
                console.log('photo has blank caption');
                var desc = '-- submitted ' + days[ d.getDay() ] + ', ' + months[ d.getMonth() ] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + d.getHours() + ':' + d.getMinutes();
            }

            var params = {
                title: 'Submitted through instagram by '+ item.user.full_name,
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
                }else{
                    console.log('SUCCESS: uploaded photo with response:');
                    console.dir(response);
                    console.log('');

                    res = response;

                    db.collection('kinneinstagram', function(err, collection) {
						collection.update( { _id: item._id }, {"$set": { uploaded: true, flickr_id: response.photoid }}, {safe:true, upsert: true}, function(err, result) {
					    	if(err){
					    		console.log("ERROR: trying to update database photo with _id: "+ item._id + " with flickr_id: "+ response.photoid);
					    		console.log(err);
					    	}else{
					    		console.log("SUCCESS: updated database photo with _id: "+ item._id + " with flickr_id: "+ response.photoid);
					    		console.log(result);
					    		console.log('');

								api('flickr.photosets.addPhoto', {photoset_id: "72157632988912392", photo_id: response.photoid}, function(err, response2) {
				                	if(err){
				                		console.log('ERROR: Could not migrate photo with id '+ response.photoid + ' to photoset with id 72157632988912392');
				                		console.log(err);
				                	}else{
				                		console.log('SUCCESS: migrated photo with id '+ response.photoid + ' to photoset with id 72157632988912392');
				                		console.log(response2);

				                		if(item.location != null){
					                		api('flickr.photos.geo.setLocation', {photo_id: response.photoid, lat: item.location.latitude, lon: item.location.longitude}, function(err, response3) {
					                				if(err){
					                					console.log("ERROR: trying to set geolocation of photo with id "+ response.photoid + ' with lat: '+ item.location.latitude + ' and lon: '+ item.location.longitude);
					                					console.log(err);
					                					iterate();
					                				}else{
					                					console.log("SUCCESS: set geolocation of photo with id "+ response.photoid + ' with lat: '+ item.location.latitude + ' and lon: '+ item.location.longitude);
					                					console.log(response3);

					                					///////*******
					                					iterate();
					                				}
					                		});
					                	}else{

					                		///////*******
					                		iterate();
					                	}
				                	}
				                });
					    	}
					    });
					});
                   
                }
            });



        });

    });
}






function iterate(){
	console.log('iterate()');

	db.collection('kinneinstagram', function(err, collection) {
        collection.find( { uploaded: true } ).count(function(err, number) {
        	if(err){
        		console.log("ERROR: in trying to count uploaded elements");
        		console.log(err);
        	}else{
        		console.log("SUCCESS: counted total number of uploaded photos at "+ number);
				if(number < max){
					console.log('ITERATING!');
					console.log('');
					uploadToFlickr();
				}
			}
		});
    });
}

















//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// USED TO DELETE ALL FLICKR PHOTOS IN A SET ////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

var grandTotal = 0;
var totalPhotos = 0;
var photoIDs = [];
var counter = 0;

exports.clenseFlickrSet = function(){

	api('flickr.photosets.getPhotos', {photoset_id: "72157632988912392", per_page: 74}, function(err, response) {
	    console.log("All photos in some set");
	    console.dir(response);
	    console.log('');console.log('');

	    /*
	    { photoset: 
		   { id: '72157633086370649',
		     primary: '8589454331',
		     owner: '37067043@N02',
		     ownername: 'Studio-X Global Network',
		     photo: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
		     page: 1,
		     per_page: 500,
		     perpage: 500,
		     pages: 1,
		     total: '6' },
		  stat: 'ok' }
		 */

		grandTotal = response.photoset.total;

	    totalPhotos = response.photoset.perpage;
	    photoIDs = response.photoset.photo;

	    removePhotosFromPhotoset();


	});

}

function removePhotosFromPhotoset(){
	/*
		{ id: '8590711154',
		  secret: '9d2543f78d',
		  server: '8509',
		  farm: 9,
		  title: 'Submitted through instagram by Iris Wang',
		  isprimary: '0' }
	*/	

	api('flickr.photos.delete', {photo_id: photoIDs[counter].id}, function(err, response) {
		if(err){
			console.log('ERROR: trying to delete photo with id: '+ photoIDs[counter].id);
			console.log(err);
		}else{
			console.log('SUCCESS: deleted photo with id: '+ photoIDs[counter].id + ' with counter: '+ counter + ' of total photos to delete: '+ totalPhotos+ ' of a grand total of: '+grandTotal);
			console.log(response);

			counter++;
			if(photoIDs[counter] != undefined){
				removePhotosFromPhotoset();
			}
		}
	});


}

/*
function removeFromDB(){

	db.collection('kinneinstagram', function(err, collection) {
        collection.find( { uploaded: false } ).sort({"created_time":-1}).limit(1).toArray(function(err, items) {

        	item = items[0];

            var filename = item.images.standard_resolution.url;
            filename = filename.split('/').pop();
          

            console.log('file to upload: '+ filename);

            if(filename == '2637177e8d0011e2a74822000a9e2993_7.jpg'){
            	collection.remove( { _id: item._id }, 1 );
            	process.exit(1);
            }

        });
    });
}

*/

