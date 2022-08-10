const mongoose = require('mongoose');
const Schema = require('mongoose').Schema

const dateSchema = new mongoose.Schema({
    name: { type: String, required: true },
})

// webtoonSchema.virtual('url').get(function(){
//     return '/webtoon/' + this._id;
// })

const Date = mongoose.model('Date', dateSchema, 'date');

module.exports = Date;
