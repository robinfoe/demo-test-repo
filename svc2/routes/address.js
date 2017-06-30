var express = require('express');
var router = express.Router();
var request = require('request');
var addressDB= [];
/* GET users listing. */
router.post('/', function(req, res, next) {
  var result="haha";
  console.log("address "+Object.keys(req.body));
  console.log("lat "+req.body.lat);
  console.log("lng "+req.body.lng);
  var url='http://maps.googleapis.com/maps/api/geocode/json?latlng='+req.body.lat+','+req.body.lng+'&sensor=false';
  var key=req.body.lat+''+req.body.lng;
  console.log(key);
  if (addressDB[key]) {
    console.log("FOUND IN CACHE");
    res.json(addressDB[key]);
  }
 else {
  console.log("CALL google");
  request(url, function (error, response, body) {
    //console.log('error:', error); // Print the error if one occurred
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log(body); // Print the HTML for the Google homepage.
    result=JSON.parse(body);
    //console.log(Object.keys(result.results));
    console.log(result.results[0].formatted_address);
    addressDB[key]=result.results[0];
    res.json(result.results[0]);
  });  
}
});

module.exports = router;