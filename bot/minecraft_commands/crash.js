exports.run = (bot, args) => {
  bot.exploits.crashClient(args[0])
  bot.send.success('Crashing!')
}

exports.name = 'crash'
exports.hash = true
