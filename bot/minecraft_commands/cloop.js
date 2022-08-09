exports.run = (bot, args) => {
  const add_clear = args.shift()
  const delay = parseInt(args.shift())
  const command1 = args.join(' ')

  if (add_clear === undefined) {
    bot.send.error('Can\'t leave action empty: add/clear')
    return
  }

  switch (add_clear) {
    case 'add':
      bot.cloops.push({ command: `${command1}`, interval: delay })
      bot.send.success(`Adding: ${command1} with a delay of ${delay} to cloops...`)
      break

    case 'clear':
      bot.cloops.splice(0, bot.cloops.length)
      bot.send.success('Clearing all cloops...')
      break
  }
}

exports.name = 'cloop'
exports.hash = true
