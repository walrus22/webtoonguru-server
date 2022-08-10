const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Webtoon = require('../../models/webtoon')
const Platform = require('../../models/platform')
const ObjectId = require("mongodb").ObjectId;

let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
let today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
let yesterday = (new Date(Date.now() - tzoffset - 60000*60*24*5)).toISOString().slice(0, -1); // *%5지워


router.get('/home', (req,res)=>{
  // console.log(today)
  // console.log(yesterday)
  Platform.find({$and : [
    {update_time : {
      "$lte" : today, 
      "$gte" : yesterday,
    }},
    {rank: 1}]})
  .populate('webtoon._id')
  .then(webtoons => res.json(webtoons))
  .catch(err => res.status(404).json({ nobooksfound: 'No Webtoons found' }));
})





module.exports = router;


