
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , config = require('./config/config');

var app = express();

app.configure(function(){
  app.use(express.compress());
  // HTTP Basic Authentication
  //app.use(express.basicAuth(config.username, config.password));
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/list', routes.list);
app.get('/transcode/:extension/:fileID', routes.transcode);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
