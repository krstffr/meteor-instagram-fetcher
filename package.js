Package.describe({
	name: 'krstffr:instagram-fetcher',
	version: '0.0.1',
	summary: 'Fetching images from the Instagram API. Very early version.',
	git: 'https://github.com/krstffr/meteor-instagram-fetcher'
});

Package.onUse(function ( api ) {

	api.use(['http']);

	api.addFiles([
		'instagram-fetcher.js',
		], 'server');

	api.export('InstagramFetcher');

});