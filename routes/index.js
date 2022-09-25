const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.redirect('')
  res.send('hello');
});

router.post('/', function(req, res, next) {
  // res.redirect('')
  res.send('index');
});


module.exports = router;
