exports.run = (bot, args) => {
  const fs = require('fs')
  const add_clear = args[0]
  const regex = args[1]

  if (add_clear === undefined) {
    bot.send.error('Can\'t leave action empty: add/clear')
    return
  }

  switch (add_clear) {
    case 'add':
      const bannedList = JSON.parse(fs.readFileSync('./bot/config/banned.json'))

      bannedList.push(args[1])

      fs.writeFileSync('./bot/config/banned.json', JSON.stringify(bannedList))

      bot.send.success('Added to banned!')
      break

    case 'clear':
      fs.writeFileSync('./bot/config/banned.json', '[]')
      bot.send.success('Banned cleared!')
      break
  }
}

exports.name = 'ban'
exports.hash = true
