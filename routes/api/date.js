const express = require('express');
const router = express.Router();
const Date = require('../../models/date')
const Platform = require('../../models/platform')
// const mongoose = require('mongoose')
// const Webtoon = require('../../models/webtoon')
// const ObjectId = require("mongodb").ObjectId;

var cacheDataByDate = {}; 
const day_list = ["월","화","수","목","금","토","일","연재","완결","열흘", "비정기"]
const platform_list = ['naver', 'lezhin', 'bomtoon', 'ktoon', 'mrblue'];

const cachingDatePage = async () => {
  for(date of day_list){
    let pipeline = await [
      {$lookup: {
        localField: "webtoon._id",
        from: "webtoon",
        foreignField: "_id",
        as: "webtoon"
      }},
      {$match: {"webtoon" : {"$elemMatch": {"date.name" : date}}}},
      {$sort: {'rank' : 1}},
      {$limit: 10}
    ];
    let mergeObject = await [];
    for(platform of platform_list) {
      if(platform_list.indexOf(platform) === 0){
        await pipeline.splice(0, 0, {$match: {'name' : `${platform}`}});
      } else {
        await pipeline.splice(0, 1, {$match: {'name' : `${platform}`}});
      }
      let webtoons = await Platform.aggregate(pipeline);
      await Array.prototype.push.apply(mergeObject,webtoons);
    }
    cacheDataByDate[date] = await mergeObject;
  }
}
cachingDatePage()

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.redirect('')
  res.send('genres');
});

router.get('/:date', (req,res)=>{ 
  res.json(cacheDataByDate[req.params.date])
});


  // pipeline.push({'$addFields' : { date :"$webtoon.date"}})
  // pipeline.push({$unwind: '$date'})

  // pipeline.push({$lookup: {
  //   localField: "date",
  //   from: "date",
  //   foreignField: "_id",
  //   as: "date"
  // }});

  //  platform_list.map((platform) => {
  //   Platform.aggregate(pipeline)
  //   .then(webtoons => {
  //     // Array.prototype.push.apply(mergeObject,webtoons)
  //     mergeObject = mergeObject.concat([2])
  //     console.log(pipeline)
  //   })
  //   .then(() => pipeline.splice(-3, 1, {$match: {'name' : `${platform}`}}))
  //   .then(() => console.log(mergeObject))
  //   .catch(err => res.status(404).json({ nobooksfound: 'No Webtoons found' }));
  // })
  // res.json(mergeObject)
 

  // Platform.aggregate(pipeline)
  // .then(webtoons => res.json(webtoons))
  // .catch(err => res.status(404).json({ nobooksfound: 'No Webtoons found' }));




router.post('/list', (req,res) =>{
  Date.find()
  // .sort({'name':1})
  .then(dates => res.json(dates))
  .catch(err => res.status(404).json({ nogenresfound: 'No genres found' }));
})


module.exports = router;