const mongoose = require('mongoose');
const Schema = require('mongoose').Schema

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true },
})

// webtoonSchema.virtual('url').get(function(){
//     return '/webtoon/' + this._id;
// })

const Genre = mongoose.model('Genre', genreSchema, 'genre');

module.exports = Genre;
