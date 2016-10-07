var express = require('express');
var webpack = require('webpack');
var path = require('path');
var dns = require('dns');

var wpDevMiddleware = require("webpack-dev-middleware");
var wpHotMiddleware = require("webpack-hot-middleware");
var wpConfig = require('./webpack.config');

var app = express();

var compiler = webpack(wpConfig);
app.use(wpDevMiddleware(compiler, { noInfo: true, publicPath: wpConfig.output.publicPath }));
app.use(wpHotMiddleware(compiler));
app.use(express.static('src'));

dns.lookup(require('os').hostname(), function (err, add, fam) {
    var port = Number(process.env.PORT || 7070);
    app.listen(7070, '0.0.0.0',function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('Listening at http://' + add + ':' + port);
    });
});
