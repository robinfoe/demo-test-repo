var express = require('express');
var router = express.Router();
var userDB={};
userDB['ws']=    {
      'id': 'ws',
      'name': 'Woh Shon',
      'age': 25,
       'occupation': 'Red Hat' ,
       'remarks': 'works in red hat' 
    };

userDB['dy']=    {
      'id': 'dy',
      'name': 'Donnie Yen',
      'age': 35,
       'occupation': 'Actor' ,
       'remarks': 'good fighter'
    };

userDB['dt']=    {
      'id': 'dt',
      'name': 'Donald Trump',
      'age': 65,
       'occupation': 'POTUS' ,
       'remarks': 'VIP'
    };

userDB['ew']=    {
      'id': 'ew',
      'name': 'Emma Watson',
      'age': 30,
       'occupation': 'Actress' ,
       'remarks': 'Beauty and the Beast'
    };

userDB['failed']=    {
      'id': 'no info',
      'name': 'no info',
      'age': 'no info',
       'occupation': 'no info' ,
       'remarks': 'no info'
    };

/* GET users listing. */
router.get('/:uid', function(req, res, next) {
  var result=null;
  if (req.params.uid) {
    console.log(req.params.uid);
    //var u=req.params.uid;

  result=userDB[req.params.uid] || userDB['failed'];
  }	
    res.send(result);
});

module.exports = router;
