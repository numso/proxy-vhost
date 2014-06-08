/* jshint node:true */
'use strict';

// TODO:: Check for body and cookie passing in

var express = require('express');
var request = require('request');
var      fs = require('fs');
var       _ = require('underscore');

var port = process.env.PORT || 4000;

var domains = [
  'lanaosmunmusic.com',
  'osmun.net',
  'antherion.com'
];

var subs = {
  'lanaosmunmusic.com': {
    'www': 'localhost:3000'
  },
  'osmun.net': {
    'www': 'localhost:3010'
  },
  'antherion.com': {
    'www': 'localhost:3020'
  },
  'idbcreative.com': {
    'www': 'localhost:3030'
  }
};

var app = express();
app.use(express.logger('dev'));
app.use(express.methodOverride());

_.each(domains, function (domain) {
  var fn = proxy(domain);
  app.use(express.vhost(domain, fn));
  app.use(express.vhost('*.' + domain, fn));
});

app.use(show404);
app.use(express.errorHandler());
app.listen(port);

function proxy(domain) {
  return function (req, res, next) {
    var sub = req.subdomains || [];
    sub = sub.reverse().join('.');

    if (!subs[domain][sub] && sub === '') sub = 'www';

    if (!subs[domain][sub]) return next();

    var url = 'http://' + subs[domain][sub] + req.url;
    var newUrl = request(url);
    req.pipe(newUrl).pipe(res);
    newUrl.on('error', function (err) {
      console.error(err);
      next();
    });
  };
}

function show404(req, res) {
  fs.createReadStream('404.html').pipe(res);
}
