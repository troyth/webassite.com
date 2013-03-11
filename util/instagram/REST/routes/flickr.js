var fs = require('fs');
var Flickr = require('flickr-with-uploads').Flickr;




exports.saveToFlickr = function(oauth_token, oauth_token_secret){


	// constructor arguments: new Flickr(consumer_key, consumer_secret, oauth_token, oauth_token_secret, base_url)
	var client = new Flickr('cc1016c94120232d41c0748f68f0d76a', 'ebe17ffcaa2445f9', oauth_token, oauth_token_secret);

	function api(method_name, data, callback) {
		// overloaded as (method_name, data, callback)
		return client.createRequest(method_name, data, true, callback).send();
	}

	var fullpath = '/srv/www/webassite.com/public_html/util/instagram/REST/images/d30db8f48a5311e28d6622000a1fbc43_6.jpg';
	var params = {
	  title: 'Submitted through instagram by sepidehkhazaee',
	  description: "#kinnekochi",
	  is_public: 1,
	  is_friend: 0,
	  is_family: 0,
	  hidden: 2,
	  content_type: 1,
	  tags: "sepidehkhazaee kinnekochi kochi",
	  photo: fs.createReadStream(fullpath, {flags: 'r'})
	};

	// the method_name gets the special value of "upload" for uploads.
	api('upload', params, function(err, response) {
	  if (err) {
	    console.error("Could not upload photo: ", err.toString() + ". Error message:");
	    console.error();
	  }
	  else {
	    // usually, the method name is precisely the name of the API method, as they are here:
	    api('flickr.photos.getInfo', {photo_id: response.photoid}, function(err, response) {
	      api('flickr.photosets.addPhoto', {photoset_id: 72157632970276717, photo_id: response.photo.id}, function(err) {
	        console.log("Full photo info:", response.photo);
	      });
	    });
	  }
	});
}