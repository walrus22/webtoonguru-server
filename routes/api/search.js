const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Webtoon = require('../../models/webtoon')
const Genre = require('../../models/genre')
const ObjectId = require("mongodb").ObjectId;

router.post('/', (req, res) => {
    console.log(req.body)

    keywordCaseInsensitive = new RegExp(req.body.word, 'i')
    // pipeline = [{$match : {$or : [{'title': {$regex : keywordCaseInsensitive}}, {"artist.name": {$regex : keywordCaseInsensitive}}]}}, {$limit: 10}]

    Webtoon.aggregate([{$match : {$or : [{'title': {$regex : keywordCaseInsensitive}}, {"artist.name": {$regex : keywordCaseInsensitive}}]}}, {$limit: 10}])
    .then(w_temp => res.json(w_temp))
    .catch(err => res.status(404).json(err));

})

module.exports = router;
