const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server with custom application logic
var proxy = httpProxy.createProxyServer({});

// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  const application = req.url.split('/')[1]
  console.log(application);

  switch (application) {
    case 'weekly':
      req.url = '/' + req.url.split('/').slice(2).join('/')
      proxy.web(req, res, { target: 'http://rohrandi.com:5678' });
      break;
    case 'sauger':
      req.url = '/' + req.url.split('/').slice(2).join('/')
      proxy.web(req, res, { target: 'http://rohrandi.com:3001' });
      break
    default:
      proxy.web(req, res, { target: 'http://rohrandi.com:5678' });

  }

});

console.log("listening on port 7070")
server.listen(7070);
