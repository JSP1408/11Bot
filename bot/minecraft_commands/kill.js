exports.run = (bot, args) => {
  bot.send.info('Ending!')
  process.abort()
}

exports.name = 'kill'
exports.hash = true
