var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nail+ Project' });
});

router.get('/record', function(req, res, next) {
  res.render('record', { title: 'record' });
});

router.get('/showData', function(req, res, next) {
  res.render('showdata', { title: 'showdata' });
});


module.exports = router;
