var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile("views/index.html");
});

router.get('/photo', function(req, res, next) {
  res.sendfile("views/photoutil.html");
});

module.exports = router;
