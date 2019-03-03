module.exports = (tweets, req) => {
  for (let tweet of tweets) {
    tweet.views += 1
    tweet.save().then(tweet => {
      if (tweet.tags && tweet.tags.length > 0) {
        tweet.tweet = tweet.tweet.replace(/#(\w*)/g, '<a href="/tag/$1">#$1</a>')
      }
      if (tweet.handles && tweet.handles.length > 0) {
        tweet.tweet = tweet.tweet.replace(/@(\w*)/g, '<a href="/profile/$1">@$1</a>')
      }
      if (req.user && tweet.likedBy.indexOf(req.user._id) >= 0) {
        tweet.likeAllowed = false
      } else {
        tweet.likeAllowed = true
      }
    })
  }
  return tweets
}
