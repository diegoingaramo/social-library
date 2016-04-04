// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Trade', new Schema({
    requester:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookID: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    status: Number
}));