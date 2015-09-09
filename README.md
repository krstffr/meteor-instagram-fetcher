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

Below are two examples of how to get images based on tag or locationId.

```javascript
// On server…
var options = { tagName: 'cool dude' };
InstagramFetcher.fetchImages.fromTag(options, function ( images, pagination ) {
	// images is a collection of the found images
	console.log( images );
	// The pagination object contains id's used for pagination. See below!
	console.log( pagination );
});
```

```javascript
// On server…
var options = { locationId: '281167589' };
InstagramFetcher.fetchImages.fromLocation(options, function ( images, pagination ) {
	// images is a collection of the found images
	console.log( images );
	// The pagination object contains id's used for pagination. See below!
	console.log( pagination );
});
```

### Sync calls (instead of async)

If you don't provide a callback to your InstagramFetcher calls, they will be called synchronously.

One of the examples above but called synchronously:

```javascript
var options = { locationId: '281167589' };
var result = InstagramFetcher.fetchImages.fromLocation( options );
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

### Getting user info

To get user info (using the /users/ endpoints) you can use the ```.fetchUserInfo( options )``` method. See [instagram.com/developer/endpoints/users/](https://instagram.com/developer/endpoints/users/) for more info.

The method takes an options object with the following supported keys:

```
accessToken (String)
If you call an endpoint which requires an access token, set it here.

self        (Boolean)
(Requires accessToken) If you want to get the authorized users
feed of images (or liked images, see below), set self to true.
(Endpoint: /users/self/feed)

liked       (Boolean)
(Used together with self + accessToken) If you want to get the
authorized users latest likes, set liked to true.
(Endpoint: /users/self/media/liked)

userId      (String)
If you want to get a specific users feed or info, pass the userId
(Endpoint: /users/user-id/media/recent)

getUserInfo (Boolean)
(Used together with userId) If you only want to get the users info, not feed,
set getUserInfo to true.
(Endpoint: /users/user-id)

searchQuery (String)
(Optional: accessToken) To search for a user, set searchQuery.
If you pass the accessToken, the authorized user will be used for the result
(Endpoint: /users/search)
```

#### Examples for getting user info *(without user authentication)*

You can get some user info without requiring your user to first grant permission to do so.

(Note that you can also provide a callback to all methods to call them asynchronously!)

```javascript
// Returns a users latest images
var result = InstagramFetcher.fetchUserInfo({ userId: '176895862' });
```

```javascript
// Returns a users info
var result = InstagramFetcher.fetchUserInfo({ userId: '176895862', getUserInfo: true });
```

```javascript
// Returns a search result for users with name "klintberg"
// If you also pass an authorized users accessToken that user
// will be used as a "base" for the search result.
var result = InstagramFetcher.fetchUserInfo({ searchQuery: 'klintberg' });
```

#### Examples for getting user info *(WITH user authentication)*

To authorize a user, you can do the following (on the server):

1. Call the InstagramFetcher.getAuthUserURI( redirectURI ) method with your apps redirectURI as only argument.
1. The getAuthUserURI will return a full URL which you need to redirect your user to.
1. If the user accepts the authorisation, he/she will be redirected to the redirectURI you passed along with a ?code=XXX query string.
1. Now call InstagramFetcher.getUserAccessToken( code, redirectURI ) with the code you got from the previous step (and with the sam redirectURI ). The result from calling InstagramFetcher.getUserAccessToken will be an object containing the access_token you need.
1. Store the access_token wherever you see fit and use it whenever you need it! See some examples below.
1. (If you need more info on how to authenticate the user, [read more here](https://instagram.com/developer/authentication/).)

(Note that you can also provide a callback to all methods to call them asynchronously!)

```javascript
// Returns an authorized users latest images
var result = InstagramFetcher.fetchUserInfo({ self: true, accessToken: 'X' });
```

```javascript
// Returns an authorized users last liked images
var result = InstagramFetcher.fetchUserInfo({ self: true, liked: true, accessToken: 'X' });
```

```javascript
// Returns a search result for 'klintberg' for the currently logged in user
var result = InstagramFetcher.fetchUserInfo({ searchQuery: 'klintberg', accessToken: 'X' });
```

## Running tests

There are a couple of tinytests written for this package. To run them, just run ```meteor test-packages ./``` when you're in the package directory.
