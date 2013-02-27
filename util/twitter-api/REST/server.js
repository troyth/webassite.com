var express = require('express'),
    tweets = require('./routes/tweets');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/tweets', tweets.findAll);
app.get('/tweets/:id', tweets.findById);

app.listen(3000);

tweets.showAll();

console.log('Listening on port 3000...');