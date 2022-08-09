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
      const regex = JSON.parse(fs.readFileSync('./bot/config/regex.json'))

      regex.push(args[1])

      fs.writeFileSync('./bot/config/regex.json', JSON.stringify(regex))

      bot.send.success('Added to regex!')
      break

    case 'clear':
      fs.writeFileSync('./bot/config/regex.json', '[]')
      bot.send.success('Regex cleared!')
      break
  }
}

exports.name = 'regex'
exports.hash = true
