exports.run = (bot, args) => {
  const commands = bot.collection
  let list = ' '

  if (args.length > 0) {
    const cmd = args[0]
    const info = commands.get(`${cmd}`)

    if (info === undefined) {
      bot.send.error(`Unknown command: ${cmd}!`)
      return
    } else {
      bot.send.info(`Name: ${info.name}`)
      bot.send.info(`Hash: ${info.hash}`)
      return
    }
  }

  for (const value of commands.values()) {
    if (value.hash === true) {
      list += `§a${value.name}§7 `
    } else {
      list += `${value.name} `
    }
  }

  bot.send.info('Green: Private, Gray: Public')
  bot.send.info(list)
  list = ' '
}

exports.name = 'help'
exports.hash = false
