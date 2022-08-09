exports.run = (bot, args, hash, username, sender) => {
  bot.send.success('1: bot.send.success')
  bot.send.error('2: bot.send.error')
  bot.send.info('3: bot.send.info')
  bot.send.success(`Args: ${args.join(' ')}, Hash: no, Username: ${bot.players.getPlayerByUUID(sender).name}, UUID: ${sender}`)
}

exports.name = 'example'
exports.hash = false
