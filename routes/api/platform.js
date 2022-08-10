const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Platform = require('../../models/platform')
const ObjectId = require("mongodb").ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.redirect('')
    res.send('platforms');
  });

router.get('/list', (req,res)=>{
    Platform.find()
    .then(platforms => res.json(platforms))
    .catch(err => res.status(404).json({ noplatformsfound: 'No platforms found' }));
});

router.get('/details/:id', (req,res)=>{
    console.log(req.params.id)
    Platform.findOne({_id : ObjectId(req.params.id)})
    .then(platforms => res.json(platforms))
    .catch(err => res.status(404).json({ noplatformsfound: 'No platforms found' }));
  });
  

module.exports = router;