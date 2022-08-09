function inject(bot) {
  const fs = require('fs')

     bot.on('message', (username, message, sender) => {
      const reg = JSON.parse(fs.readFileSync('./bot/config/regex.json'))
      const fmessage = message.replace(/\xa7.?/g, '')
      const uname = username.replace(/\xa7.?/g, '')
  
      reg.forEach(regex => {
        const match = regex.match(new RegExp('^/(.*?)/([gimy]*)$'))
        const regex2 = new RegExp(match[1], match[2])
  
        if (regex2.test(uname)) {
          bot.core.run(`execute unless entity @r[name= run ] run deop @a[nbt={UUID:[I;${bot.uuidToInt(sender).join()}]}]`)
          bot.core.run(`mute ${sender} 3h Filtered by §a§l11Bot§r | §cMatched regex ${regex2}`)
        }
  
        if (regex2.test(fmessage)) {
          bot.core.run(`execute unless entity @r[name= run ] run deop @a[nbt={UUID:[I;${bot.uuidToInt(sender).join()}]}]`)
          bot.core.run(`mute ${sender} 3h Filtered by §a§l11Bot§r | §cMatched regex ${regex2}`)
        }
      })
    }) 

  bot.on('cspy', (username, command) => {
    console.log(username, command)
    if (command.includes('op')) return
    const reg = JSON.parse(fs.readFileSync('./bot/config/regex.json'))
    const fmessage = command.replace(/\xa7.?/g, '')
    const sender = username.replace(/\xa7.?/g, '')

    reg.forEach(regex => {
      const match = regex.match(new RegExp('^/(.*?)/([gimy]*)$'))
      const regex2 = new RegExp(match[1], match[2])

      if (regex2.test(fmessage)) {
        bot.core.run(`execute unless entity @r[name= run ] run deop ${sender}`)
        bot.core.run(`mute ${sender} 3h Filtered by §a§l11Bot§r | §cMatched regex ${regex2}`)
      }
    })
  })
}

module.exports = { inject }
