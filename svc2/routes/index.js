var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("123");
  //res.send({'svc2':'hello'});
});

router.post('/', function(req, res, next) {
  res.send({svc2:"hello"});
});


module.exports = router;
