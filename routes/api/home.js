const express = require('express');
const router = express.Router();
const Platform = require('../../models/platform')

let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
let today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
let yesterday = (new Date(Date.now() - tzoffset - 60000*60*24*119)).toISOString().slice(0, -1); // *119지워
var cacheDataHomePage = []; 

Platform.find({$and : [
  {update_time : {
    "$lte" : today, 
    "$gte" : yesterday,
  }},
  {rank: 1}]})
.populate('webtoon._id')
.then(webtoons => cacheDataHomePage = webtoons)
.catch(err => res.status(404).json({ nobooksfound: 'No Webtoons found' }));

router.post('/', (req,res)=>{
  res.json(cacheDataHomePage)
})

module.exports = router;


