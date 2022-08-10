const mongoose = require('mongoose');
const Schema = require('mongoose').Schema

const platformSchema = new mongoose.Schema({
    name : {type: String, required: true },
    webtoon : { 
        _id: {type: Schema.Types.ObjectId, ref: 'Webtoon'},
        name: { type: String, required: true },
    },
    genre: [{
        _id: {type: Schema.Types.ObjectId, ref: 'Genre'},
        name: { type: String, required: true },
    }],
    rank : {type: Number, required: false },
    address: {type: String, required: true},
    update_time : {type: String, required: true},
})

// webtoonSchema.virtual('url').get(function(){
//     return '/webtoon/' + this._id;
// })

const Platform = mongoose.model('Platform', platformSchema, 'platform');

module.exports = Platform;