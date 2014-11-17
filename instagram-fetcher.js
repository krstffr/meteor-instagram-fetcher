InstagramFetcherHandler = function() {

	var that = this;

	// Instead of using console.log() directly, here we have a 
	// "global" option to turn loggin off
	that.hideLog = false;
	that.log = function ( msg ) {
		if (that.hideLog)
			return true;
		return console.log( msg );
	};

 	// All handling of fetching of remote images
 	that.fetchImages = {};

	// The defaulty way of getting images, called by most other methods
	that.fetchImages.defaultCb = function ( url, cb ) {

		check( cb, Function );

		var options = {
			params: { client_id: Meteor.settings.InstagramAPI.CLIENT_ID }
		};

		Meteor.http.call(
			'GET',
			url,
			options, function(err, res) {
				
				if (err)
					throw new Error( err );
				
				// The images are stored in the data.data object…
				var images = res.data.data;
				// …which should be an array…
				check( images, Array );
				// …pass the array to the callback!
				cb(images);

			});
		
	};

	// Get image by userId
	that.fetchImages.fromUser = function ( uesrId, cb ) {

		var url = 'https://api.instagram.com/v1/users/'+uesrId+'/media/recent?callback=?';

		that.log('--> --> fetching images from user: ' + uesrId + '…');

		return that.fetchImages.defaultCb( url, cb );
		
	};

	// Get image by tag (hashtag)
	that.fetchImages.fromTag = function ( tag, cb ) {

		var url = 'https://api.instagram.com/v1/tags/'+tag+'/media/recent?callback=?';

		that.log('--> --> fetching images with tag: ' + tag + '…');

		return that.fetchImages.defaultCb( url, cb );

	};

	that.checkAuth = function () {

		that.log('--> --> InstagramFetcher.checkAuth()');
		
		// Make sure there is a InstagramAPI object in settings
		if (!Meteor.settings.InstagramAPI)
			throw new Error('No "InstagramAPI" in settings.');
		
		// Make sure user has provided client id and secret
		if (!Meteor.settings.InstagramAPI.CLIENT_ID)
			throw new Error('No "InstagramAPI.CLIENT_ID" in settings.');

		if (!Meteor.settings.InstagramAPI.CLIENT_SECRET)
			throw new Error('No "InstagramAPI.CLIENT_SECRET" in settings.');

		// If all is cool, return true
		return true;

	};

	that.init = function () {
		that.log('--> init InstagramFetcher…');
		// Make sure user has provided AUTH
		that.checkAuth();
	};

	that.init();

};

InstagramFetcher = new InstagramFetcherHandler();