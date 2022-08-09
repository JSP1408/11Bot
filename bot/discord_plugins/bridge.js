function inject (bot, discord) {
  let queue = ''

  bot.on('parsed_chat', (data) => {
    if(data.clean.startsWith('Command set'))return

    queue += `${data.clean}\n`
  })

  setInterval(function () {
    if (queue === '') return

    if (queue.length > 2000) {
      queue = ''
      return
    }

    if (queue !== '') {
      discord._client.channels.cache.get(discord.channel).send({ content: `${queue}`, allowedMentions: { parse: [] } })
      queue = ''
    }
  }, 3000)

  discord._client.on('messageCreate', async (message) => {
    if (message.author.id === discord._client.user.id || message.channel.id !== discord.channel) return
    if (!message.content.indexOf(bot.prefix)) return

    bot.core.run(`/tellraw @a "§8[§a11Bot Discord§8]§r §c${message.author.username.replace(/["]+/g, '/')}§r: §7${message.content.replace(/["]+/g, '/')}"`)
  })
}

module.exports = { inject }
