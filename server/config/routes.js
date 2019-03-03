const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', auth.isAuthenticated, controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  app.get('/admins/all', auth.isInRole('Admin'), controllers.users.list)
  app.post('/admins/add/:id', auth.isInRole('Admin'), controllers.users.addAdmin)

  app.get('/tweet', auth.isAuthenticated, controllers.tweets.addGet)
  app.post('/tweet', auth.isAuthenticated, controllers.tweets.addPost)

  app.get('/tweet/edit/:id', auth.isInRole('Admin'), controllers.tweets.editGet)
  app.post('/tweet/edit/:id', auth.isInRole('Admin'), controllers.tweets.editPost)

  app.post('/tweet/delete/:id', auth.isInRole('Admin'), controllers.tweets.deletePost)

  app.get('/tag/:tagName', controllers.tweets.listByTag)

  app.get('/profile/:username', controllers.users.listByUser)

  app.post('/like/:id', auth.isAuthenticated, controllers.tweets.like)
  app.post('/unlike/:id', auth.isAuthenticated, controllers.tweets.unlike)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
