const mongoose = require('mongoose');
const Schema = require('mongoose').Schema

const webtoonSchema = new mongoose.Schema({
    // item_id: { type: String, required: true },
    title : { type: String, required: true },
    thumbnail: { type: String, required: true },
    synopsis : { type: String, required: true },
    finish_status : {type : String, required: true},
    adult : { type: Boolean, required: true },
    date : [{
        _id: {type: Schema.Types.ObjectId, ref: 'Date'},
        name: { type: String, required: true },
    }],
    genre: [{
        _id: {type: Schema.Types.ObjectId, ref: 'Genre'},
        name: { type: String, required: true },
    }],
    platform : [{
        _id: {type: Schema.Types.ObjectId, ref: 'Platform'},
        name: { type: String, required: true },
    }], 
    artist: [{
        _id: {type: Schema.Types.ObjectId, ref: 'Artist'},
        name: { type: String, required: true },
    }],
})

// webtoonSchema.virtual('url').get(function(){
//     return '/webtoon/' + this._id;
// })

const Webtoon = mongoose.model('Webtoon', webtoonSchema, 'webtoon');

module.exports = Webtoon;

