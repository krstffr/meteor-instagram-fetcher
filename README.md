### Setup / setttings.json

For this package to work you'll need to add your Instagram Client ID and Client Secret to your settings.json file like this:

```JSON
{
	"InstagramAPI": {
		"CLIENT_ID": "xxx",
		"CLIENT_SECRET": "xxx"
	}
}
```

(You can sign up, create a client and obtain these values from the [Instagram Developers page](https://instagram.com/developer/).)

### Basic usage

So far, all you can do using this package is get images by tag or locationId. Do this on your server:

```javascript
var options = { tagName: 'cool dude' };
InstagramFetcher.fetchImages.fromTag(options, function ( images, pagination ) {
	// images is a collection of the found images
	console.log( images );
	// The pagination object contains id's used for pagination. See below!
	console.log( pagination );
});
```

```javascript
var options = { locationId: '281167589' };
InstagramFetcher.fetchImages.fromLocation(options, function ( images, pagination ) {
	// images is a collection of the found images
	console.log( images );
	// The pagination object contains id's used for pagination. See below!
	console.log( pagination );
});
```

### The pagination object

In your callback you not only recieve the images, but also a pagination object containing id's for pagination. The pagination object can look something like this:

```javascript
{
  next_max_tag_id: '1413787976057320',
  next_min_id: '1415209810240985',
  min_tag_id: '1415209810240985',
  next_url: 'URL HERE'
}
```

You can use these id's in your requests, to avoid fetching the same images over and over again. Like this:
```javascript
var options = { tagName: 'cool dude', minTagId: '1415209810240985' };
InstagramFetcher.fetchImages.fromTag(options, function ( images, pagination ) {
	// now you'll only get the images which have been added since your last request
	console.log( images );
});
```
