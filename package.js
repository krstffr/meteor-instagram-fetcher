Package.describe({
	name: 'krstffr:instagram-fetcher',
	version: '0.0.1',
	summary: 'Schedulke fetching of stuff from the Instagram API.'
});

Package.onUse(function ( api ) {

	api.use(['http']);

	api.addFiles([
		'instagram-fetcher.js',
		], 'server');

	api.export('InstagramFetcher');

});