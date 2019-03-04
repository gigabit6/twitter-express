const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: process.env.MONGODB_URI || 'mongodb://localhost:27017/twitter2',
    port: process.env.PORT || 3030
  },
  staging: {
  },
  production: {
    port: process.env.PORT,
    db: process.env.MONGODB_URI,
  }
}
