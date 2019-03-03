let mongoose = require('mongoose')
let Tweet = mongoose.model('Tweet')
let User = mongoose.model('User')
let tweetsHelper = require('../utilities/render-tweets')

function getHashTags (inputText) {
  var regex = /(#[a-z0-9][a-z0-9\-_]*)/ig
  var matches = []
  var match

  while ((match = regex.exec(inputText))) {
    match[1] = match[1].substr(1)
    matches.push(match[1])
  }

  return matches
}
function getHandles (inputText) {
  var regex = /(@[a-z0-9][a-z0-9\-_]*)/ig
  var matches = []
  var match

  while ((match = regex.exec(inputText))) {
    match[1] = match[1].substr(1)
    matches.push(match[1])
  }

  return matches
}

module.exports = {
  addGet: (req, res) => {
    res.render('tweets/add')
  },
  addPost: (req, res) => {
    let tweetReq = req.body
    tweetReq.author = req.user._id
    tweetReq.tags = getHashTags(tweetReq.tweet)
    tweetReq.handles = getHandles(tweetReq.tweet)
    Tweet.create(tweetReq).then((tweet) => {
      res.redirect('/')
    })
  },
  listByTag: (req, res) => {
    let tag = req.params.tagName
    Tweet.find({tags: tag}).populate('author').then((tweets) => {
      tweetsHelper(tweets, req)
      res.render('home/index', {tweets})
    })
  },
  editGet: (req, res) => {
    let id = req.params.id
    Tweet.findById(id).then(tweet => {
      res.render('tweets/edit', tweet)
    })
  },
  editPost: (req, res) => {
    let id = req.params.id
    let updatedTweet = req.body.tweet
    let newTags = getHashTags(updatedTweet)
    let newHandles = getHandles(updatedTweet)
    Tweet.findByIdAndUpdate(id, {tweet: updatedTweet, tags: newTags, handles: newHandles}).then((tweet) => {
      res.redirect('/')
    })
  },
  deletePost: (req, res) => {
    let id = req.params.id
    Tweet.findByIdAndRemove(id).then(tweet => {
      res.redirect('/')
    })
  },
  like: (req, res) => {
    let id = req.params.id
    Tweet.update({_id: id}, {'$push': { 'likedBy': req.user._id }}).then(() => {
      res.redirect('/')
    })
  },
  unlike: (req, res) => {
    let id = req.params.id
    Tweet.update({_id: id}, {'$pull': { 'likedBy': req.user._id }}).then(() => {
      res.redirect('/')
    })
  }
}
