exports.run = (bot, args) => {
  bot.core.fillCore()
  bot.send.success('Core refilled!')
}

exports.name = 'refill'
exports.hash = false
