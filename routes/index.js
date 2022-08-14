var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.redirect('')
  res.send(process.env.MONGO_DB_URL);
});

router.post('/', function(req, res, next) {
  // res.redirect('')
  res.send('index');
});


module.exports = router;
