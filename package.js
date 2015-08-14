Package.describe({
	name: 'krstffr:instagram-fetcher',
	version: '0.0.2',
	summary: 'Fetching images from the Instagram API. Very early version.',
	git: 'https://github.com/krstffr/meteor-instagram-fetcher'
});

Package.onUse(function ( api ) {

	// Set versions from.
  api.versionsFrom('METEOR@0.9.0');

	api.use(['http']);

	api.addFiles([
		'instagram-fetcher.js',
		], 'server');

	api.export('InstagramFetcher');

});