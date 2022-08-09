exports.run = (bot, args) => {
  bot.exploits.kick(args[0])
  bot.send.success('Kicking!')
}

exports.name = 'kick'
exports.hash = true
