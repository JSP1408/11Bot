exports.run = (bot, args) => {
  bot.send.info(JSON.stringify(bot.players.getPlayerByName(args[0])))
}

exports.name = 'getp'
exports.hash = false
