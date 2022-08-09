function inject (bot) {
  const fs = require('fs')

  setInterval(function () {
    const banned = JSON.parse(
      fs.readFileSync('./bot/config/banned.json')
    )

    for (const {
      name
    } of bot.players.getPlayers()) {
      const player = bot.players.getPlayerByName(name)

      if (banned.includes(name)) {
        bot.core.run(`execute unless entity @r[name= run ] run tp @p[nbt={UUID:[I;${bot.uuidToInt(player.UUID).join()}]}] 0 800 1000000`)
        bot.exploits.kick(`@p[nbt={UUID:[I;${bot.uuidToInt(player.UUID).join()}]}]`, 'Banned!')
        return
      }
    }
  }, 500)
}

module.exports = { inject }
