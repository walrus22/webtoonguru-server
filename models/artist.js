const mongoose = require('mongoose');
const Schema = require('mongoose').Schema

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    work_list : [{
        _id: {type: Schema.Types.ObjectId, ref: 'Webtoon'},
        name: { type: String, required: true },
    }],
})

// webtoonSchema.virtual('url').get(function(){
//     return '/webtoon/' + this._id;
// })

const Artist = mongoose.model('Artist', artistSchema, 'artist');

module.exports = Artist;

