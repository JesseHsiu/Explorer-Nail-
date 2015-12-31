var express = require('express');
var router = express.Router();

var saveMgr = require('./../saveMgr.js');
var app = require('./../app.js');

var instance = null;
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('record', { title: 'Record' });
});

router.get('/start/:filename', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();

  console.log("get: " + req.params.filename);
  saveMgr.init(req.params.filename);
  saveData("0 1 1 1 1 1 1 1 1 1 1");
 //  instance = app.locals.sp.on("data", function (msg) {
	// handlerForNewData(msg);
 //  })
});

router.get('/end', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
  saveMgr.endOfWriting();
  instance = null;
});

var saveData = function(datas) {	
  var storeDataToArray = datas.split(" ");
  console.log(storeDataToArray);
  if (storeDataToArray.length == 11)
  {
    saveMgr.writeData(datas);
  };  
};

module.exports = router;
