var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nail+ Project' });
});

router.get('/backdoor', function(req, res, next) {
  res.render('backdoor', { title: 'Nail+ BackDoor' });
});

// router.get('/', function(req, res, next) {
// 	console.log(req.app);
// 	res.render('showdata', { title: 'Show Data' });
// });


module.exports = router;
