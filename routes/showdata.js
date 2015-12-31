var express = require('express');
var router = express.Router();

var shell = require('shelljs');

router.get('/', function(req, res, next) {
	res.render('showdata', { title: 'Show Data' });

	
});

router.get('/datalist', function(req, res, next) {
	
	shell.cd('public');
	shell.cd('data');

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('_datalist(\''+ shell.ls('./*.csv').toString() + '\')');	

	shell.cd('..');
	shell.cd('..');

});


module.exports = router;
