var express = require('express');
var router = express.Router();
var predictMgr = require('./../predictMgr.js');


router.get('/', function(req, res, next) {
	res.render('detectgesture', { title: 'Detect Gesture' });
});


router.get('/predict', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
  
  predictMgr.init();
  
  
});

module.exports = router;
