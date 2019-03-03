let mongoose = require('mongoose')
let Tweet = mongoose.model('Tweet')
let User = mongoose.model('User')
let tweetsHelper = require('../utilities/render-tweets')

module.exports = {
  index: (req, res) => {
    Tweet.find().populate('author').limit(100).then(tweets => {
      tweetsHelper(tweets, req)
      res.render('home/index', {tweets})
    })
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
