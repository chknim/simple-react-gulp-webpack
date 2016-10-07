var express = require('express');
var dns = require('dns');
var app = express();

app.use(express.static('production'));

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'production', 'index.html'));
});

dns.lookup(require('os').hostname(), function (err, add, fam) {
    var port = Number(process.env.PORT || 7070);
    app.listen(7070, '0.0.0.0',function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('Listening at http://' + add + ':' + port);
    });
});
