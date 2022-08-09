exports.run = (bot, args) => {
  bot.send.info(args.join(' '))
}

exports.name = 'echo'
exports.hash = false
