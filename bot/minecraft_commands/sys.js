exports.run = (bot, args) => {
  const os = require('os')

  bot.send.info(`CPU architecture: ${os.arch()}`)
  bot.send.info(`Host: ${os.hostname()}`)
  bot.send.info(`Platform: ${os.platform()}`)
}

exports.name = 'sys'
exports.hash = false
