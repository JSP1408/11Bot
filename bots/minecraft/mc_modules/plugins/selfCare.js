function inject (bot) {
  bot._client.on('packet', (packet, meta) => {
    if (packet.entityID !== bot._client.entityId) return

    if (packet.entityStatus === 24) {
      setTimeout(() => {
        bot._client.write('chat', {
          message: '/op @p'
        })
      }, 200)
    }
  })

  bot._client.on('game_state_change', packet => {
    if (packet.gameMode !== 1) {
      bot.chat('/gmc')
    }
  })

  bot._client.on('respawn', packet => {
    if (packet.gamemode !== 1) {
      bot.chat('/gmc')
    }
  })

  setInterval(function () {
    bot.core.fillCore()
  }, 60000)
}

module.exports = {
  inject
}
