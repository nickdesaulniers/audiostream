var express = require('express');
var http = require('http');
var routes = require('./routes');
var config = require('./config/config');
var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.disable('x-powered-by');
  app.use(express.logger('dev'));
  app.use(express.compress());
  // HTTP Basic Authentication
  //app.use(express.basicAuth(config.username, config.password));
  app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.get('/list', routes.list);
app.get('/transcode/:extension/:fileID', routes.transcode);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

