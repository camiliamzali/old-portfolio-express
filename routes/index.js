var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Camilia\'s page' });
});

/* GET Twitch API page */
router.get('/twitch_api', function(req, res, next) {
  res.render('twitch_api', { title: 'Twitch API Example' });
});


module.exports = router;
