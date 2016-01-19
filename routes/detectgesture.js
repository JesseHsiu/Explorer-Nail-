var express = require('express');
var router = express.Router();
var predictMgr = require('./../predictMgr.js');


router.get('/', function(req, res, next) {
	predictMgr.init();//req.app.locals.sp
	res.render('detectgesture', { title: 'Detect Gesture' });
});


router.get('/predict', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
});

router.get('/start', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
  req.app.locals.sp.on('data',recording);
});

router.get('/end', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();

  // req.app.locals.sp.removeListener("data", recording);
  predictMgr.predict();

});

function recording (msg) {
  predictMgr.storeNeedToPredictData(msg);
}

module.exports = router;
