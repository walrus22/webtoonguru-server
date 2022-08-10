const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Artist = require('../../models/artist')
const ObjectId = require("mongodb").ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.redirect('')
    res.send('artist');
  });

router.get('/list', (req,res)=>{
    Artist.find()
    .then(artists => res.json(artists))
    .catch(err => res.status(404).json({ noartistsfound: 'No Artists found' }));
});

router.get('/details/:id', (req,res)=>{
  let pipeline = [];

  pipeline.push({$match: {_id : ObjectId(req.params.id)}})
  pipeline.push({$lookup: {
    localField: "work_list._id",
    from: "webtoon",
    foreignField: "_id",
    as: "work_list"
  }})

  
  
  // Artist.findOne({_id : ObjectId(req.params.id)})
  // .populate([{path: 'work_list._id', populate:{path: 'artist date genre platform'}}])
  Artist.aggregate(pipeline)
  .then(artists => res.json(artists))
  .catch(err => res.status(404).json({ noartistsfound: 'No Artists found' }));
});  

module.exports = router;

