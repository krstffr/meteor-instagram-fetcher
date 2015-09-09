// Set some settings
Meteor.settings = {
	InstagramAPI: {
		CLIENT_ID: 'TESTclientId',
		CLIENT_SECRET: 'TESTsecret'
	}
};

Meteor.startup(function() {
	InstagramFetcher.setLogging( false );
	InstagramFetcher.setupTesting( true );
});

Tinytest.add('fetchImages - fromTag(), sync', function( test ) {
	
	var result = InstagramFetcher.fetchImages.fromTag({ tagName: 'test' });

	test.equal( result.url, 'https://api.instagram.com/v1/tags/test/media/recent?callback=?' );
	test.equal( result.cb, undefined );
	test.equal( result.passedOptions, { tagName: 'test' } );

	test.throws(function() {
		InstagramFetcher.fetchImages.fromTag();
	});

	test.throws(function() {
		InstagramFetcher.fetchImages.fromTag('asdf');
	});

	test.throws(function() {
		InstagramFetcher.fetchImages.fromTag({ wrongKey: '12345' });
	});

});

Tinytest.add('fetchImages - fromTag(), async', function( test ) {

	var result = InstagramFetcher.fetchImages.fromTag({ tagName: 'test' }, function() {});

	test.equal( typeof result.cb, 'function' );

	test.throws(function() {
		InstagramFetcher.fetchImages.fromTag('asdf', function() {});
	});

	test.throws(function() {
		InstagramFetcher.fetchImages.fromTag({ wrongKey: '12345' }, function() {});
	});

});

Tinytest.add('fetchImages - fromLocation()', function( test ) {

	var result = InstagramFetcher.fetchImages.fromLocation({ locationId: '123445' });

	test.equal( result.url, 'https://api.instagram.com/v1/locations/123445/media/recent?callback=?' );
	test.equal( result.cb, undefined );
	test.equal( result.passedOptions, { locationId: '123445' } );

	test.throws(function() {
		InstagramFetcher.fetchImages.fromLocation();
	});

	test.throws(function() {
		InstagramFetcher.fetchImages.fromLocation('asdf');
	});

	test.throws(function() {
		InstagramFetcher.fetchImages.fromLocation({ wrongKey: '12345' });
	});

});

Tinytest.add('auth user - getAuthUserURI()', function( test ) {

	var result = InstagramFetcher.getAuthUserURI('http://callback.url');

	test.equal( result, 'https://api.instagram.com/oauth/authorize/?client_id=TESTclientId&redirect_uri=http://callback.url&response_type=code' );

	test.throws(function() {
		InstagramFetcher.getAuthUserURI();
	});

	test.throws(function() {
		InstagramFetcher.getAuthUserURI(123);
	});

});

Tinytest.add('auth user - getUserAccessToken()', function( test ) {

	var result = InstagramFetcher.getUserAccessToken('CODE', 'http://callback.url');

	test.equal( result.accessTokenURL, 'https://api.instagram.com/oauth/access_token/' );
	test.equal( result.options.params.client_id, 'TESTclientId' );
	test.equal( result.options.params.client_secret, 'TESTsecret' );
	test.equal( result.options.params.grant_type, 'authorization_code' );
	test.equal( result.options.params.redirect_uri, 'http://callback.url' );
	test.equal( result.options.params.code, 'CODE' );

	test.throws(function() {
		InstagramFetcher.getUserAccessToken(123);
	});

	test.throws(function() {
		InstagramFetcher.getUserAccessToken(123, '123');
	});

	test.throws(function() {
		InstagramFetcher.getUserAccessToken('123', 123);
	});

});

Tinytest.add('user endpoint - fetchUserInfo()', function( test ) {

	var result1 = InstagramFetcher.fetchUserInfo({
		self: true,
		accessToken: 'Access token'
	});
	test.equal( result1.url, 'https://api.instagram.com/v1/users/self/feed?access_token=Access token');

	var result2 = InstagramFetcher.fetchUserInfo({
		self: true,
		liked: true,
		accessToken: 'Access token'
	});
	test.equal( result2.url, 'https://api.instagram.com/v1/users/self/media/liked?access_token=Access token');

	var result3 = InstagramFetcher.fetchUserInfo({
		userId: '1234'
	});
	test.equal( result3.url, 'https://api.instagram.com/v1/users/1234/media/recent');

	var result4 = InstagramFetcher.fetchUserInfo({
		userId: '1234',
		getUserInfo: true
	});
	test.equal( result4.url, 'https://api.instagram.com/v1/users/1234');

	var result5 = InstagramFetcher.fetchUserInfo({
		searchQuery: 'kkklintberg'
	});
	test.equal( result5.url, 'https://api.instagram.com/v1/users/search?q=kkklintberg');

	var result6 = InstagramFetcher.fetchUserInfo({
		searchQuery: 'kkklintberg',
		accessToken: 'token'
	});
	test.equal( result6.url, 'https://api.instagram.com/v1/users/search?q=kkklintberg&access_token=token');

	test.throws(function(){
		InstagramFetcher.fetchUserInfo({ self: true });
	});
	
	test.throws(function(){
		InstagramFetcher.fetchUserInfo({ self: 'asdfg' });
	});
	
	test.throws(function(){
		InstagramFetcher.fetchUserInfo();
	});

	test.throws(function(){
		InstagramFetcher.fetchUserInfo({ searchQuery: 12345 });
	});

	test.throws(function(){
		InstagramFetcher.fetchUserInfo({ getUserInfo: '123' });
	});
	

});