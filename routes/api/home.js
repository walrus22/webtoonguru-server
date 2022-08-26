const express = require('express');
const router = express.Router();
const Platform = require('../../models/platform')
const mongoose = require('mongoose')
// const Webtoon = require('../../models/webtoon')
// const ObjectId = require("mongodb").ObjectId;

let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
let today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
let yesterday = (new Date(Date.now() - tzoffset - 60000*60*24*10)).toISOString().slice(0, -1); // *119지워
var cacheDataHomePage = []; 

const cachingHomePage = async () => {
  cacheDataHomePage = await Platform.aggregate([
    // {$match: {$and : [{'update_time': {"$lte": today, "$gte": yesterday}}, {rank: 1}]}},
    {$match: {$and : [{rank: 1}]}},
    {$lookup: {
      localField: "webtoon._id",
      from: "webtoon",
      foreignField: "_id",
      as: "webtoon",
    }}]);
}

cachingHomePage()
console.log(cacheDataHomePage)

router.post('/', (req,res)=>{
  res.json(cacheDataHomePage)
})

module.exports = router;


