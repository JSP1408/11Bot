function inject (bot) {
  bot.player = {}

  const players = {
    list: [],
    getPlayers () {
      return players.list
    },
    getPlayerByUUID (uuid) {
      return players.list.find(player => player.UUID === uuid)
    },
    getPlayerByName (name) {
      return players.list.find(player => player.name === name)
    },
    getPlayer (uuidOrName) {
      return players.list.find(player => player.uuid === uuidOrName || player.uuid === uuidOrName)
    },
    isBot (player) {
      return typeof player === 'object' ? player.UUID === bot.player.UUID : typeof player === 'string' ? player === bot.player.name || player === bot.player.uuid : null
    }
  }

  bot.players = players

  bot.on('player_joined', player => {
    players.list.push(player)
  })

  bot.on('player_left', player => {
    for (let i = 0; i < players.list.length; i++) {
      const listedPlayer = players.list[i]

      if (listedPlayer.UUID === player.UUID) players.list.splice(i, 1)
    }
  })

  bot._client.on('player_info', packet => {
    packet.data.forEach(player => {
      switch (packet.action) {
        case 0:
          if (players.getPlayerByUUID(player.UUID)) bot.emit('player_unvanished', player)
          else bot.emit('player_joined', player)

          if (players.isBot(player)) bot.player = player
          break
        case 1:
          bot.emit('player_gamemode_changed', player)

          if (players.isBot(player)) bot.emit('gamemode_changed', player.gamemode)
          break
        case 2:
          bot.emit('player_ping_changed', player)

          if (players.isBot(player)) bot.emit('ping_changed', player.ping)
          break
        case 3:
          break
        case 4:
          player = players.getPlayerByUUID(player.UUID)

          if (!player || !player.name) return

          getPlayers(bot).then(players => {
            if (players.includes(player.name)) bot.emit('player_vanished', player)
            else bot.emit('player_left', player)
          })
          break
        default:
          console.error(`Invalid player action! ${packet.action}`)
          break
      }
    })
  })
}

function getPlayers (bot) {
  return new Promise(resolve => {
    const transactionId = Math.floor(Math.random() * 0xffff)

    bot.write('tab_complete', {
      transactionId,
      text: '/scoreboard players add '
    })

    bot._client.once('tab_complete', packet => resolve(packet.matches.filter(match => !match.tooltip).map(match => match.match)))
  })
}

module.exports = {
  inject
}
