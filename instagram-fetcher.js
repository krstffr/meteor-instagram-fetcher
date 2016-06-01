InstagramFetcherHandler = function() {

	var that = this;

	// If this var is set to true, then the callEndpoint method
	// will return the passed URL instead of calling it.
	var isTest = false;
	// Method for setting the above var to setIsTest (Boolean)
	that.setupTesting = function( setIsTest ) {
		check( setIsTest, Boolean );
		that.log('--> --> Setting isTest = ' + setIsTest );
		isTest = setIsTest;
	};

	// Instead of using console.log() directly, here we have a
	// "global" option to turn logging off
	var showLoggin = true;
	// Method for logging stuff
	that.log = function ( msg ) {
		if (!showLoggin)
			return true;
		return console.log( msg );
	};
	that.setLogging = function( setLogging ) {
		check( setLogging, Boolean );
		showLoggin = setLogging;
	};

	// Method for actually calling the Instagram endpoint
	// Not "public", only called by other methods defined in this constructor.
	// HAS TEST (indirectly)
	var callEndpoint = function( url, cb, passedOptions ) {

		// Check passed arguments
		check( url, String );
		if (cb)            check( cb, Function );
		if (passedOptions) check( passedOptions, Object );

		var options = {
			params: { client_id: Meteor.settings.InstagramAPI.CLIENT_ID }
		};

		if (passedOptions && passedOptions.minTagId)
			options.params.min_tag_id = passedOptions.minTagId;

		if (passedOptions && passedOptions.maxTagId)
			options.params.max_tag_id = passedOptions.maxTagId;

		that.log('\n--> --> calling Instagram endpoint using these params:');
		that.log('--> --> endpoint:' + url );
		that.log( options, '\n');

		// Are we just testing this method? The just return all the vars used!
		if (isTest)
			return { url: url, cb: cb, passedOptions: passedOptions };

		// If no callback is passed, call synchronously.
		if (!cb)
			return HTTP.call('GET', url, options );

		return HTTP.call('GET', url, options, function( err, res ) {

			if (err)
				throw new Error( err );

			// Get the pagination
			var pagination = res.data.pagination;
			check( pagination, Object );

			// The images are stored in the data.data object
			// should be an array…
			var images = res.data.data;
			check( images, Array );

			that.log('--> --> --> returning: ' + images.length + ' images.');

			// …pass the array to the callback (if one is passed!)
			cb( images, pagination );

		});

	};

	// All handling of fetching of remote images
	that.fetchImages = {};

	// Get image by tag (hashtag)
	// HAS TEST
	that.fetchImages.fromTag = function ( options, cb ) {

		// Make sure we got a tagName!
		check( options.tagName, String );
		check( options.token, String );

		var url = 'https://api.instagram.com/v1/tags/'+options.tagName+'/media/recent?access_token='+options.token;

		that.log('--> --> fetching images with tag: ' + options.tagName );

		return callEndpoint( url, cb, options );

	};

	// Get image by location (locationId)
	// HAS TEST
	that.fetchImages.fromLocation = function ( options, cb ) {

		// Make sure we got a locationId!
		check( options.locationId, String );
		check( options.token, String );

		var url = 'https://api.instagram.com/v1/locations/'+options.locationId+'/?access_token=?'+options.token;

		that.log('--> --> fetching images with location id: ' + options.locationId );

		return callEndpoint( url, cb, options );
	};


	// Method for getting user info
	// (see: https://instagram.com/developer/endpoints/users/#get_users_feed)
	// HAS TEST
	that.fetchUserInfo = function( options, cb ) {

		check( options, Object );

		if ( options.accessToken ) check( options.accessToken, String  );
		if ( options.userId )      check( options.userId,      String  );
		if ( options.getUserInfo ) check( options.getUserInfo, Boolean );
		if ( options.liked )       check( options.liked,       Boolean );
		if ( options.self )        check( options.self,        Boolean );
		if ( options.searchQuery ) check( options.searchQuery, String  );

		// Make sure there is an accessToken set where needed!
		if ( (options.self && !options.accessToken ) )
			throw new Error('You need to pass an accessToken for this query!');

		var url = '';

		// If the user has provided a self boolean, get the self feed!
		if (options.self){
			// Get the "liked" enpoint if "liked" is set to true
			if (options.liked)
				url = 'https://api.instagram.com/v1/users/self/media/liked';
			// Else just get the users latest images
			else
				url = 'https://api.instagram.com/v1/users/self/feed';
		}

		// Get the passed userId's user info
		if ( options.userId && options.getUserInfo )
			url = 'https://api.instagram.com/v1/users/' + options.userId;

		// Get the passed userId's latest images
		if ( options.userId && !options.getUserInfo )
			url = 'https://api.instagram.com/v1/users/' + options.userId + '/media/recent';

		// Return the serarch result
		if ( options.searchQuery ){
			url = 'https://api.instagram.com/v1/users/search?q=' + options.searchQuery;
		}

		if (options.accessToken) {
			var joiner = url.indexOf('?') != -1 ? '&' : '?';
			url = url + joiner + 'access_token=' + options.accessToken;
		}

		that.log('--> --> fetching user data at endtpoint: ' + url );

		return callEndpoint( url, cb );

	};

	// Method for returning a URL which your app can use to auth
	// the logged in Instagram user. Redirect your user to the passed URL
	// and let him/her accept or deny the request.
	// HAS TEST
	that.getAuthUserURI = function( redirectURI ) {

		check( redirectURI, String );

		var authUrl = 'https://api.instagram.com/oauth/authorize/';
		authUrl += '?client_id=' + Meteor.settings.InstagramAPI.CLIENT_ID;
		authUrl += '&redirect_uri=' + redirectURI;
		authUrl += '&response_type=code';
		authUrl += '&scope=basic+public_content+follower_list+comments+relationships+likes';

		return authUrl;

	};

	// Method for retrieving an access_token for the user.
	// Requires a code which you get when the user grants access
	// using the URL returned from the getAuthUserURI method.
	// You need to provide the same redirectURI here as the one
	// you used when you called the getAuthUserURI method!
	// HAS TEST
	that.getUserAccessToken = function( code, redirectURI ) {

		check( code, String );
		check( redirectURI, String );

		var accessTokenURL = 'https://api.instagram.com/oauth/access_token/';

		var options = {
			params: {
				client_id: Meteor.settings.InstagramAPI.CLIENT_ID,
				client_secret: Meteor.settings.InstagramAPI.CLIENT_SECRET,
				grant_type: 'authorization_code',
				redirect_uri: redirectURI,
				code: code
			}
		};

		if (isTest)
			return { accessTokenURL: accessTokenURL, options: options };

		return HTTP.call('POST', accessTokenURL, options );

	};


	// Make sure user has provided all the Instagram API keys needed.
	// Won't check if the keys are actually valid though!
	that.checkInstagramAPIkeysAreSet = function () {

		return Meteor.startup(function() {

			that.log('--> InstagramFetcher.checkInstagramAPIkeysAreSet()…');

			// Make sure there is a InstagramAPI object in settings
			if (!Meteor.settings.InstagramAPI)
				throw new Error('No "InstagramAPI" in settings.');

			// Make sure user has provided client id and secret
			if (!Meteor.settings.InstagramAPI.CLIENT_ID)
				throw new Error('No "InstagramAPI.CLIENT_ID" in settings.');

			if (!Meteor.settings.InstagramAPI.CLIENT_SECRET)
				throw new Error('No "InstagramAPI.CLIENT_SECRET" in settings.');

			that.log('--> InstagramFetcher.checkInstagramAPIkeysAreSet() DONE!');

			// If all is cool, return true
			return true;

		});

	};

	that.init = function () {
		that.log('\n--> init InstagramFetcher…');
		// Make sure user has provided AUTH
		that.checkInstagramAPIkeysAreSet();
	};

	that.init();

};

InstagramFetcher = new InstagramFetcherHandler();
