const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: process.env.MONGODB_URI,
    port: process.env.PORT
  },
  staging: {
  },
  production: {
    port: process.env.PORT,
    db: process.env.MONGODB_URI,
  }
}
