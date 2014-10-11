/**
 * Module dependencies.
 */

//change your template engine and hostname here ('ejs' or 'dust')
var template_engine = 'dust',
    domain = 'localhost';

var express = require('express'),
    engine = require('ejs-locals'),
    routes = require('./routes'),
    http = require('http'),
    store = new express.session.MemoryStore,
    path = require('path');

var app = express();

if (template_engine == 'dust') {
    var dust = require('dustjs-linkedin'),
        cons = require('consolidate');

    app.engine('dust', cons.dust);

} else if (template_engine == 'ejs') {
    app.engine('ejs', engine);
} else if (template_engine == 'swig') {
    var swig = require('swig'),
        cons = require('consolidate');

    app.engine('swig', cons.swig);
    //app.set('view engine', 'html');
}

app.configure(function() {

    if (template_engine == 'swig') {
        app.set('view engine', 'swig');
        app.set('view options', {
            layout: false
        });
    }

    app.set('template_engine', template_engine);
    app.set('domain', domain);
    app.set('port', process.env.PORT || 8080);
    app.set('views', __dirname + '/views');
    app.set('view engine', template_engine);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('wigglybits'));
    app.use(express.session({
        secret: 'whatever',
        store: store
    }));
    app.use(express.session());
    app.use(app.router);
    app.use(require('less-middleware')(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));

    //middleware
    app.use(function(req, res, next) {
        if (req.session.user) {
            req.session.logged_in = true;
        }
        res.locals.message = req.flash();
        res.locals.session = req.session;
        res.locals.q = req.body;
        res.locals.err = false;
        next();
    });

});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.locals.inspect = require('util').inspect;
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
