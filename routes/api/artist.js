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
  // pipeline.push({$lookup: {
  //   localField: "work_list.platform._id",
  //   from: "platform",
  //   foreignField: "_id",
  //   as: "work_list.platform._id"
  // }})

  
  
  // Artist.aggregate(pipeline)
  Artist.findOne({_id : ObjectId(req.params.id)})
  .populate([{path: 'work_list._id', populate:{path: 'platform._id'}}])
  .then(artists => res.json(artists))
  .catch(err => res.status(404).json({ noartistsfound: 'No Artists found' }));
});  

module.exports = router;

// {
//   "_id": "62f368d9cbc8404c68a0b476",
//   "name": "고지애",
//   "work_list": [
//     {
//       "_id": "62f368d9cbc8404c68a0b475",
//       "name": "11me"
//     },
//     {
//       "_id": "62f36c3acbc8404c68a0bd9c",
//       "name": "리프로듀싱"
//     }
//   ]
// }