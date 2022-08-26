const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Genre = require('../../models/genre')
const Platform = require('../../models/platform')
const Webtoon = require('../../models/webtoon')
const ObjectId = require("mongodb").ObjectId;

let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
let today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

// 5 지워

let yesterday = (new Date(Date.now() - tzoffset - 60000*60*24*5)).toISOString().slice(0, -1);
var cacheDataByGenre = {}; 
const cachingGenrePage = async () => {
  const genre_list = ["romance", "bl", "gl", "drama", "daily", "action", "gag", "fantasy", 
  "thrill/horror", "historical", "sports", "sensibility", "school", "erotic"];
  
  let pipeline = [
    {$lookup: {
      localField: "webtoon._id",
      from: "webtoon",
      foreignField: "_id",
      as: "webtoon_extend"
    }}, 
  ];

  for(genre of genre_list){
    await pipeline.push({$match: {"genre.name": genre, "rank" : {"$lte": 10}}});
    cacheDataByGenre[genre] = await Platform.aggregate(pipeline);
    await pipeline.pop();
  }
  // await console.log(cacheDataByGenre);
}

cachingGenrePage()


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.header('Host'));
  res.send("hello")
});


router.get('/:name', (req,res)=>{ 
  // let reg = new RegExp(process.env.VALID_REFERER_URL, 'i')
  // console.log(process.env.A);
  // console.log(reg.test(req.headers.referer))
  
  // console.log(req);

  res.json(cacheDataByGenre[req.params.name])
  
  // if(req.hostname === "webtoon.guru"){
  // } else {
  //   res.json({"message" : "access denied"})
  // }

  // let pipeline = [];
  
  // if(cacheDataByGenre[req.params.name]){
  //   console.log("you are in if")
  //   res.json(cacheDataByGenre[req.params.name]);
  // } else {
  //   console.log("you are in else")
  //   pipeline.push({$lookup: {
  //     localField: "webtoon._id",
  //     from: "webtoon",
  //     foreignField: "_id",
  //     as: "webtoon_extend"
  //   }});
  
  //   pipeline.push({$match: {"genre.name": req.params.name, "rank" : {"$lte": 10}}});
  //   // pipeline.push({$sort: {'rank' : 1}})
  //   // pipeline.push({$limit: 70})
  
  //   Platform.aggregate(pipeline)
  //   .then(webtoons => {
  //     cacheDataByGenre[req.params.name] = webtoons;
  //   })
  //   .catch(err => res.status(404).json({ nobooksfound: 'No Webtoons found' }));
  // }
});


// router.post('/list', (req,res) =>{
//   Genre.find()
//   .sort({'name':1})
//   .then(genres => {
//     res.json(genres);

//   })
//   .catch(err => res.status(404).json({ nogenresfound: 'No genres found' }));
// })

  
module.exports = router;


// // before indexing
// router.get('/:name', (req,res)=>{ 
//   let pipeline = [];

//   pipeline.push({$lookup: {
//     localField: "genre",
//     from: "genre",
//     foreignField: "_id",
//     as: "genre_extend"
//   }});

//   pipeline.push({$lookup: {
//     localField: "webtoon",
//     from: "webtoon",
//     foreignField: "_id",
//     as: "webtoon_extend"
//   }});

//   pipeline.push({$match: {"genre_extend.name": req.params.name, "rank" : {"$lte": 10}}});
//   pipeline.push({$sort: {'rank' : 1}})
//   pipeline.push({$limit: 70})

//   Platform.aggregate(pipeline)
//   .then(webtoons => res.json(webtoons))
//   .catch(err => res.status(404).json({ nobooksfound: 'No Webtoons found' }));
// });


// router.post('/list', (req,res) =>{
//   Genre.find()
//   .sort({'name':1})
//   .then(genres => res.json(genres))
//   .catch(err => res.status(404).json({ nogenresfound: 'No genres found' }));
// })

// import React from "react";
 
// // We use Route in order to define the different routes of our application
// import { Route, Routes } from "react-router-dom";
 
// // We import all the components we need in our app
// import Navbar from "./components/navbar";
// import RecordList from "./components/recordList";
// import Edit from "./components/edit";
// import Create from "./components/create";
 
// const App = () => {
//  return (
//    <div>
//      <Navbar />
//      <Routes>
//        <Route exact path="/" element={<RecordList />} />
//        <Route path="/edit/:id" element={<Edit />} />
//        <Route path="/create" element={<Create />} />
//      </Routes>
//    </div>
//  );
// };
 
// export default App;