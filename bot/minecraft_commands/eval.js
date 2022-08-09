exports.run = (bot, args) => {
    try {
        bot.send.success(bot.vm.run(args.join(" ").replace(/\xa7.?/g, '')))
    } catch (err) {
        bot.core.run(`bcraw &8[&c${err}&8]`)
    }
  }
  
  exports.name = 'eval'
  exports.hash = false
  