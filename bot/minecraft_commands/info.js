exports.run = (bot, args, hash, username, sender, discord) => {
  const config = require('./../config/main.json')

  bot.send.info(`Username: ${bot.username}`)
  bot.send.info(`UUID: ${bot.players.getPlayerByName(bot.username).UUID}`)
  bot.send.info(`Discord channel: ${discord.channel}`)
  bot.send.info(`Prefix: ${config.prefix}`)
}

exports.name = 'info'
exports.hash = false
