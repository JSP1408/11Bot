function inject (bot) {
  bot.cloops = []
  setInterval(() => {
    bot.cloops.forEach((cloop, i) => {
      if (!cloop._looping) loop(i)
    })
  }, 1)
  function loop (i) {
    if (bot.cloops[i] == null) { return }

    bot.cloops[i]._looping = true
    bot.core.run(bot.cloops[i].command)
    setTimeout(() => loop(i), bot.cloops[i].interval)
  }
}

module.exports = { inject }
