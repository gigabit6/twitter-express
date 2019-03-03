const mongoose = require('mongoose')
const mongooseTypes = mongoose.SchemaTypes
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

const MAXLEGTH = [140, 'The tweet should not be more than 140 characters']

let tweetSchema = new mongoose.Schema({
  tweet: {type: mongooseTypes.String, maxlength: MAXLEGTH, required: REQUIRED_VALIDATION_MESSAGE},
  creationDate: {type: mongooseTypes.Date, default: Date.now},
  author: {type: mongooseTypes.ObjectId, ref: 'User'},
  tags: [{type: mongooseTypes.String}],
  handles: [{type: mongooseTypes.String}],
  views: {type: Number, default: 0},
  likedBy: [{type: mongooseTypes.ObjectId, ref: 'User'}]
})

let Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet
