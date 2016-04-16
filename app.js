var express = require('express');
var path = require('path'); 
var swig = require('swig');
var app = express();

app.set('views', path.join(__dirname, '/views')); // where to find the views
app.set('view engine', 'html'); // what file extension do our templates have
app.engine('html', swig.renderFile); // how to render html templates
swig.setDefaults({ cache: false });

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
    res.render('index', {});
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('Node.js listening on the port ' + port);
});
