var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  var output='hello';
  console.log(1);
  var url= process.env.REMOTE_URL || 'http://192.168.223.130:3001';
  request.post({
      url: url
    },
    function(error, response, body){
      console.log(2);
      if(error) {
        console.log( "ERROR: " + error);
	output=error;
      } else {
        console.log(response.statusCode, body);
        res.json(body);
	//res.send(body);
      }
  });
//  res.send(output);
});

module.exports = router;
