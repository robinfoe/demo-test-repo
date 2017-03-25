var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.send("123");
  //res.send({'svc2':'hello'});
  res.json({response:"svc2"});
});
router.get('/test', function(req, res, next) {
  res.send("test");
  //res.send({'svc2':'hello'});
});
router.post('/', function(req, res, next) {
  res.send({svc2:"hello"});
});


router.get('/say/hello/:h', function(req, res, next) {
  res.send({svc2:req.params.h});
});

module.exports = router;
