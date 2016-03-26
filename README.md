#image search microservice built on node.js with bing api
##this is built for a freecodecamp project
[freecodecamp](https://www.freecodecamp.com)

##project discription
Returns JSON data with 10 image search results on the query, an offset can be added to the results. Another page shows the last 10 searches and when they were queried.

##endpoints
####url/api/imagesearch/query-goes-here?offset=10
the offset should be a number.

####url/api/latest/imagesearch/
last 10 searches.

##server launch instructions
The environment varialbe BING_KEY needs to be set to your bing search key for authentication to work.

From the console run:

    node server.js

Or on Heroku the package.json should launch the server automatically

##dependencies
* node.js
* uses built in node modules:
 * http
 * https
 * url

##Example output:

    [{"url":"url of photo","snippet":"description of photo","thumbnail":"url of thumbnail of image","context":"url of page image appears on"},...]