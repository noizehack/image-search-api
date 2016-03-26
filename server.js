var https = require('https');
var http = require('http');
var url = require('url');

var latest = [];

var server = http.createServer(function (req, res) {
  var parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname.indexOf('/api/imagesearch/') === 0) {
    var query = parsedUrl.pathname.slice(17);
    latest.unshift({term: decodeURI(query), when: new Date(Date.now()).toISOString()});
    if (latest.length > 10) {
      latest = latest.slice(0, 9);
    }
    var offset = (parsedUrl.query.offset !== null && (/^[0-9]*$/.test(parsedUrl.query.offset))) ? parsedUrl.query.offset : 0;
    var auth = 'Basic ' + (new Buffer(process.env.BING_KEY + ':' + process.env.BING_KEY).toString('base64'));
    var path = '/Bing/Search/Image?$top=10&$skip=' + offset + '&$format=json&Query=%27' + query + '%27';
    var options = {
      host: 'api.datamarket.azure.com',
      path: path,
      headers: {Authorization: auth}
    };
    https.get(options, function (searchRes) {//do image search
      var body ='';
      searchRes.on('data', function (chunk) {
        body += chunk;
      });
      searchRes.on('end', function() {
        body = JSON.parse(body);
        var imgResults = body.d.results;
        imgResults = imgResults.map(function (img) {
          return {
            url: img.MediaUrl,
            snippet: img.Title,
            thumbnail: img.Thumbnail.MediaUrl,
            context: img.SourceUrl
          };
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(imgResults));
      });
    });
  } else if (parsedUrl.pathname.indexOf('/api/latest/imagesearch/') === 0) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(latest));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var apiUrl = 'https://' + req.headers.host + '/api/imagesearch/';
    res.end('<!doctype html><html lang="en"><body><h1>go to <a href="' + apiUrl + '">' + apiUrl + '</a>query?offset=0 for JSON response</h1></body></html>');
  }
});

var port = process.env.PORT || 3000;
server.listen(port);
console.log('server listening on port:' + port);