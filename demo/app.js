
/**
 * Module dependencies.
 */

//change your template engine and hostname here ('ejs' or 'dust')
var template_engine = 'ejs'
	, domain = 'spring';

var express = require('express')
	, engine = require('ejs-locals')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

if ( template_engine == 'dust' ) {
	var dust = require('dustjs-linkedin')
	, cons = require('consolidate');

	app.engine('dust', cons.dust);

} else if ( template_engine == 'ejs' ) {
	app.engine('ejs', engine);
}

app.configure(function(){
  app.set('template_engine', template_engine);
  app.set('domain', domain);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', template_engine);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('wigglybits'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
