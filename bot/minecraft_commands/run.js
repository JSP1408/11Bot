exports.run = (bot, args) => {
  bot.core.run(args.join(' ').replace(/^"|$"/, ''))
}

exports.name = 'run'
exports.hash = false
