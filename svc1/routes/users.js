var express = require('express');
var router = express.Router();
var userDB={};
userDB['ws']=    {
      'id': 'ws',
      'name': 'Woh Shon',
      'age': 25,
       'remarks': 'works in red hat' 
    };

userDB['dy']=    {
      'id': 'dy',
      'name': 'Donnie Yen',
      'age': 35,
       'remarks': 'good fighter'
    };


/* GET users listing. */
router.get('/:uid', function(req, res, next) {
  var result=null;
  if (req.params.uid) {
    console.log(req.params.uid);
  result=userDB[req.params.uid] || '{"status":"failed", "message": "no such user"}';
  }	
    res.send(result);
});

module.exports = router;
