function genUser () {
  const crypto = require('crypto')
  const hash = crypto.createHash('md5')
  const randomBytes = crypto.randomBytes(16)
  hash.update(randomBytes)
  const username = hash.digest(Math.round(Math.random()) ? 'hex' : 'Base64')

  return username.substring(0, 16)
}

module.exports = { genUser }
