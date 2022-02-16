const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');

// #######################################
// #######################################
// -> Zwei geschachtelte PRoxys! der erste nur https auf zweiten,
// der zweite nur http auf services
// #######################################
// #######################################

// Create a proxy server with custom application logic
var sslProxy = httpProxy.createProxyServer({
  ssl: {
    key: fs.readFileSync('/etc/letsencrypt/live/rohrandi.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/rohrandi.com/fullchain.pem', 'utf8')
  },
  target: 'http://h2947445.stratoserver.net:9000'
})
.listen(443)
.on('open', function (proxySocket) {
  console.log('open');
})
.on('error', function (err, req, res) {
  console.log('ERR');
  console.log(err);
});
console.log('ssl proxy listening on port 443');


var proxy = httpProxy.createProxyServer({})

// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  const application = req.url.split('/')[1]
  console.log(application);

  const trimUrl = (req, level = 1) => {
    req.url = '/' + req.url.split('/').slice(1 + level).join('/')
    return req
  }

  switch (application) {
    case 'weekly-mix':
    req = trimUrl(req)
    proxy.web(req, res, {
      target: {
        host: 'h2947445.stratoserver.net',
        port: 5678
      }
    });
    break;
    case 'yt-sauger':
    req = trimUrl(req)
    proxy.web(req, res, {
      target: {
        host: 'h2947445.stratoserver.net',
        port: 3001
      }
    });
    break
    case 'owncloud':
    console.log(req);
    req = trimUrl(req)
    console.log(res);
    proxy.web(req, res, {
      target: {
        host: 'h2947445.stratoserver.net',
        port: 9900
      }
    });
    break
  }

});

console.log('proxy listening on port 9000');
server.listen(9000);
