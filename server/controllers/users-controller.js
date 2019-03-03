const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')
const Tweet = require('mongoose').model('Tweet')
const errorHandler = require('../utilities/error-handler')
const userValidation = require('../utilities/user-validation')
let tweetsHelper = require('../utilities/render-tweets')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },
  registerPost: (req, res) => {
    let reqUser = req.body

    let errors = userValidation.validate(reqUser)
    if (errors !== '') {
      res.locals.globalError = errors
      res.render('users/register', reqUser)
      return
    }

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
      .catch(err => {
        let message = errorHandler.handleMongooseError(err)
        res.locals.globalError = message
        res.render('users/register', reqUser)
      })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },
  loginPost: (req, res) => {
    let reqUser = req.body
    User
      .findOne({ username: reqUser.username }).then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = err
            res.render('users/login')
          }

          res.redirect('/')
        })
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  listByUser: (req, res) => {
    let username = req.params.username
    User.findOne({username: username}).then(user => {
      Tweet
        .find({$or: [{'author': user._id}, {'handles': username}]})
        .populate('author').then(tweets => {
          tweetsHelper(tweets, req)
          res.render('home/index', {tweets})
        })
    })
  },
  list: (req, res) => {
    User.find({ 'roles': {'$ne': 'Admin'} }).then(users => {
      res.render('users/list', {users: users})
    })
  },
  addAdmin: (req, res) => {
    let id = req.params.id
    User.findById(id).then(user => {
      user.roles.push('Admin')
      user.save().then(() => {
        res.redirect('/')
      })
    })
  }
}
