function inject (bot) {
  const main = require('./../config/main.json')
  bot.createCore()

  setTimeout(() => {
    bot.send.success(`11Bot: Rewritten. Type ${main.prefix}help for help!`)
  }, 250)

  setTimeout(() => {
    bot.chat('/cspy on')
  }, 1000);
}

module.exports = { inject }
