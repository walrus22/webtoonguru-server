const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Webtoon = require('../../models/webtoon')
const Genre = require('../../models/genre')
const ObjectId = require("mongodb").ObjectId;

function arrayEquals(a, b) {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
}

function pipelinePushToggleGroup(filters, filterName, filterOperator, pipeline) {
  let matchList=[];

  // console.log(filters)
  // console.log(filter)
  // console.log(filterOperator)
  // console.log(pipeline)
  //filters : req.body.filters.date
  //filterName : "date" , "genre" ...
  
  filterOrName = filterName + ".name"

  if(arrayEquals(filters,['all'])){
    pipeline.push({$match: {[filterName]: {$exists: "true"}}});
  }else{
    if(filterOperator === "and"){
      filters.map((value) => {
        matchList.push({$elemMatch: {'name' : value}})
      });
      pipeline.push({$match: {[filterName] : {$all: matchList}}});
    } else { // or
      filters.map((value) => {
        matchList.push({[filterOrName] : value})
      });
      pipeline.push({$match: {$or: matchList}});
    }
  }
}

/* 
전체보기 페이지에서 reload 없이 search하는 것은 보장하면서,
query문이 있는 url을 load 했을 (새로고침 등) 경우에는, query -> parameter
*/

router.post('/list', (req,res)=>{
  let pipeline = [];
  // console.log(req.body.filters.order);
  // console.log(req.body.filters);
  // console.log(req.body.filters.genreOperator[0]);
  
  pipelinePushToggleGroup(req.body.filters.date, "date", req.body.filters.dateOperator[0], pipeline)
  pipelinePushToggleGroup(req.body.filters.genre, "genre", req.body.filters.genreOperator[0], pipeline)
  pipelinePushToggleGroup(req.body.filters.platform, "platform", req.body.filters.platformOperator[0], pipeline)

  // 작가 두명 이상 콤마 줬을 경우 if()
  if(req.body.filters.artist.indexOf(",") !== -1){
    const artist_list = [];
    const artist_list_temp = req.body.filters.artist.split(",");
    console.log(artist_list_temp)
    artist_list_temp.filter(n => n).map((value) => {
      console.log(value)
      artistCaseInsensitive = new RegExp(value, 'i')
      artist_list.push({"$elemMatch": {"name" : artistCaseInsensitive}})
      // artist_list.push({"$elemMatch": {"name" : value}})
    });
    console.log(artist_list)
    pipeline.push({$match: {"artist": {"$all":artist_list}}})
  }
  else{
    // pipeline.push({$match: {"artist.name": {$regex : req.body.filters.artist}}})
    artistCaseInsensitive = new RegExp(req.body.filters.artist, 'i')
    pipeline.push({$match: {"artist.name": {$regex : artistCaseInsensitive}}})
  }

  // let reg = new RegExp(process.env.VALID_REFERER_URL, 'i')
  // artist_exist = db["artist"].find_one({'name': {'$regex' : '^{}$'.format(artist_temp), "$options" : "i"}})


  // order 만약 있으면 push하고, 없으면 push안하고
  // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
  // if(req.body.filters.order)

  // 제목 일치 
  titleCaseInsensitive = new RegExp(req.body.filters.title, 'i')
  pipeline.push({$match: {'title': {$regex : titleCaseInsensitive}}})
  // 성인물 on/off 
  // console.log(req.body.filters.adult === "all" ? {$exists: true} : req.body.filters.adult)
  pipeline.push({$match: {'adult' : (req.body.filters.adult === "all" ? {$exists: true} : req.body.filters.adult)}})
  pipeline.push({$sort: req.body.filters.order})

  // pipeline.push({$setWindowFields: {output: {totalCount: {$count: {}}}}})
  pipeline.push({$facet: {
    count:  [{ $count: "count" }],
    sample: [
              { $skip: (req.body.page-1) * req.body.limit},
              { $limit: req.body.limit },
            ]
  }})

  Webtoon.aggregate(pipeline)
  .then(w_temp => res.json(w_temp))
  .catch(err => res.status(404).json(err));

})

router.post('/details/:id', (req,res)=>{
  Webtoon.findOne({_id : ObjectId(req.params.id)})
  .populate('platform._id')
  .then(webtoons => res.json(webtoons))
  .catch(err => res.status(404).json({ nobooksfound: 'No Webtoons found' }));
});


module.exports = router;


// // 전체보기 page // before indexing //
// router.post('/before_list', (req,res)=>{
//   console.log(req.body.filters.order);
//   console.log(req.body.filters.genre);
  
//   let pipeline = [];
//   let date_match=[];
//   let genre_match=[]; 
//   let platform_match=[];

//   pipeline.push({$lookup: {
//     localField: "genre",
//     from: "genre",
//     foreignField: "_id",
//     as: "genre_extend"
//   }});
//   pipeline.push({$lookup: {
//     localField: "date",
//     from: "date",
//     foreignField: "_id",
//     as: "date_extend"
//   }});
//   pipeline.push({$lookup: {
//     localField: "platform",
//     from: "platform",
//     foreignField: "_id",
//     as: "platform_extend"
//   }});
//   pipeline.push({$lookup: {
//     localField: "artist",
//     from: "artist",
//     foreignField: "_id",
//     as: "artist_extend"
//   }});

//   // date
//   if(arrayEquals(req.body.filters.date,['all'])){
//     pipeline.push({$match: {"date_extend": {$exists: true}}});
//   }else{
//     // console.log(req.body.filters.date);
//     req.body.filters.date.map((value) => {
//       date_match.push({"$elemMatch": {_id : ObjectId(value)}})
//     });
//     pipeline.push({$match: {"date_extend": {"$all":date_match}}});
//   }

//   // genre
//   if(arrayEquals(req.body.filters.genre,['all'])){
//     pipeline.push({$match: {"genre_extend": {$exists: true}}});
//   } else {
//     // console.log(req.body.filters.genre);
//     req.body.filters.genre.map((value) => {
//       genre_match.push({"$elemMatch": {_id : ObjectId(value)}})
//     });
//     pipeline.push({$match: {"genre_extend": {"$all":genre_match}}});
//   }

//   //platform
//   if(arrayEquals(req.body.filters.platform,['all'])){
//     pipeline.push({$match: {"platform_extend": {$exists: true}}});
//   } else {
//     req.body.filters.platform.map((value) => {
//       platform_match.push({"$elemMatch": {"name" : value}}) 
//     });
//     pipeline.push({$match: {"platform_extend": {"$all":platform_match}}});
//   }

  

//   // 작가 두명 이상 콤마 줬을 경우 if()
//   if(req.body.filters.artist.indexOf(",") !== -1){
//     const artist_list = [];
//     const artist_list_temp = req.body.filters.artist.split(",");
//     console.log(artist_list_temp)
//     artist_list_temp.filter(n => n).map((value) => {
//       console.log(value)
//       artist_list.push({"$elemMatch": {"name" : value}})
//     });
//     console.log(artist_list)
//     pipeline.push({$match: {"artist_extend": {"$all":artist_list}}})
//   }
//   else{
//     pipeline.push({$match: {"artist_extend.name": {$regex : req.body.filters.artist}}})
//   }

//   // order 만약 있으면 push하고, 없으면 push안하고
//   // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
//   // if(req.body.filters.order)



//   // 제목 일치
//   pipeline.push({$match: {'title': {$regex : req.body.filters.title}}})
//   // 성인물 on/off
//   pipeline.push({$match: {'adult' : req.body.filters.adult}})
//   pipeline.push({$sort: req.body.filters.order})

//   pipeline.push({$setWindowFields: {output: {totalCount: {$count: {}}}}})
//   pipeline.push({$facet: {
//     count:  [{ $count: "count" }],
//     sample: [{ $skip : (req.body.page-1) * req.body.limit},
//              { $limit: req.body.limit },
//             ]
//   }})

//   // pipeline.push({$facet: {
//   //   count:  [{ $count: "count" }],
//   //   sample: [{ $skip : 0},]
//   // }})


//   Webtoon.aggregate(pipeline)
//   .then(w_temp => res.json(w_temp))
//   .catch(err => res.status(404).json(err));
// })

/* 안돼 
// Webtoon.find().populate([{path:'genre'},{path:'artist', match: {"name":{$regex: ""}}}]).limit(10) //.elemMatch('artist', {"name":"오늘만 사는 형제"})
// .find({
//   $and: [
//        {'genre': {'$elemMatch': {'name': 'romance'} } },
//        {'genre': {'$elemMatch': {'name': 'school'} } }
//   ]
// })

// Webtoon.find({"genre" : {$all : [ObjectId("62e205aa0ed48169804490c8"),ObjectId("62e205aa0ed4816980449153")]}})
// Webtoon.find({'genre.1': {$exists: 'true'}})
// .populate({path:'genre', match : {'name' : {$all :['romance', 'daily']}}}) //
// .populate({path:'genre', match : {$and:[{'name':'romance'}, {'name':'daily'}]}}) //
// .then(webtoons => w_temp = webtoons.filter(function (webtoon) {return webtoon.genre.length !== 0}))    
// .then(console.log(w_temp))
  // .populate({path:'genre', match:{$and : [{"name": "romance"}, {"name": "daily"},]}})
// .populate({path:'genre', match:{name : {$in: ["romance", "daily"]}}})
// .populate({path:'genre', match:{name : {$in: ["romance", "daily"]}}})
// {$and: [{'name':'romance'}]}}
  // {'$elemMatch': {'name': 'romance'} },
  // {'$elemMatch': {'name': 'school'} } ]}} )
// .elemMatch("genre", {"name" : "bl"})
// .find({$all:[{'genre': {$elemMatch: {'name': 'gl'}}}]})
// .find({"genre" : {"$elemMatch" : {'name' : 'bl'}}})
// .find({"genre.name" : "bl"})


// // router.get('/:title', function(req, res, next) {
// //     let title = req.params
// //     res.send(title)
// // //   res.render('webtoon', { title: 'Express' });
// // });

// // // GET request for creating webtoon. NOTE This must come before route for id (i.e. display webtoon).
// // router.get('/detail/create', webtoon_controller.webtoon_create_get);

// // // POST request for creating webtoon.
// // router.post('/detail/create', webtoon_controller.webtoon_create_post);

// // // GET request to delete webtoon.
// // router.get('/detail/:id/delete', webtoon_controller.webtoon_delete_get);

// // // POST request to delete webtoon.
// // router.post('/detail/:id/delete', webtoon_controller.webtoon_delete_post);

// // // GET request to update webtoon.
// // router.get('/detail/:id/update', webtoon_controller.webtoon_update_get);

// // // POST request to update webtoon.
// // router.post('/detail/:id/update', webtoon_controller.webtoon_update_post);


// // GET request for weekday page.
// router.get('/weekday', webtoon_controller.webtoon_weekday);

// // // GET request for by genre.
// // router.get('/genre', webtoon_controller.webtoon_genre);

// // // GET request for one webtoon.
// // router.get('/detail/:title', webtoon_controller.webtoon_detail);

// // // GET request for list of all webtoons.
// // router.get('/all', webtoon_controller.webtoon_list);

// router.get('/listt', (req,res)=>{
//   let limit = req.body.limit ? parseInt(req.body.limit) : 50;
//   let page = parseInt(req.body.page);
//   console.log(req.body)
    
//   let findArgs = {};
//   // let findArgs = {"genre" : ObjectId("62e205aa0ed48169804490c8"),"genre" : ObjectId("62e205aa0ed4816980449153") };
  
//   // Webtoon.find()
//   // Webtoon.find({"genre" : {$all : [ObjectId("62e205aa0ed48169804490c8"),ObjectId("62e205aa0ed4816980449153")]}})
//   Webtoon.find({'genre.1': {$exists: 'true'}})
//   .populate('genre')
//   // .populate({path:'genre', match : {'name' : {$all :['romance', 'daily']}}}) //
//   // .populate({path:'genre', match : {$and:[{'name':'romance'}, {'name':'daily'}]}}) //
//   // .then(webtoons => w_temp = webtoons.filter(function (webtoon) {return webtoon.genre.length !== 0}))    
//   // .then(console.log(w_temp))
//   .then(w_temp => res.json(w_temp))
//   .catch(err => res.status(404).json({ nowebtoonsfound: 'No Webtoons found' }));
// });

router.post('/list', (req,res)=>{

  let limit = req.body.limit ? parseInt(req.body.limit) : 50;
  let page = parseInt(req.body.page);
    
  let findArgs = {'title':"", 'artist':"", 'date':"", 'genre' :[], 'adult': Boolean};

  if(arrayEquals(req.body.filters.genres,['all'])){
    Webtoon.find({'title':{$regex : req.body.filters.title}})
    .limit(50)
    .populate('genre')
    .sort({title:1})
    .then(w_temp => res.json(w_temp))
    .catch(err => res.status(404).json({ nowebtoonsfound: 'No Webtoons found' }));
  } else {
    console.log("you are in else")
    for(let a of req.body.filters.genres){
      findArgs['genre'].push(ObjectId(a))
    }
    Webtoon.find({$and: [{'title':{$regex : req.body.filters.title}}, {"genre" : {$all : findArgs['genre']}}]})
    .limit(50)
    .populate('genre')
    .sort({title:1})
    .then(w_temp => res.json(w_temp))
    .catch(err => res.status(404).json({ nowebtoonsfound: 'No Webtoons found' }));
  }
});

*/


