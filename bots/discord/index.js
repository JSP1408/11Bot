/* eslint-disable import/no-absolute-path */
const { bot } = require('./../minecraft/index')
const { Client, Intents, Collection } = require('discord.js')
const fs = require('fs')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], disableRatelimitQueue: true })

const settings = {
  token: process.argv[3],
  prefix: process.argv[4],
  logChannel: process.argv[5]
}

client.on('ready', () => {
  console.log('Connected!')
  console.log(`Username: ${client.user.tag}, Prefix: ${settings.prefix}, Log channel: ${settings.logChannel}`)
})

client.config = settings
client.commands = new Collection()

const events = fs.readdirSync('./bots/discord/events').filter(file => file.endsWith('.js'))
for (const file of events) {
  const eventName = file.split('.')[0]
  const event = require(`./events/${file}`)
  client.on(eventName, event.bind(null, client))
}

const commands = fs.readdirSync('./bots/discord/commands').filter(file => file.endsWith('.js'))
for (const file of commands) {
  const commandName = file.split('.')[0]
  const command = require(`./commands/${file}`)

  client.commands.set(commandName, command)
}

let queue = ''

bot.on('login', () => {
  bot.on('message', (username, message) => {
    const uname = username.replace(/\xa7.?/g, '')
    if (username === bot.username) return
    queue += `${uname}: ${message}\n`
  })

  setInterval(function () {
    if (queue === '') return

    if (queue.length > 2000) {
      queue = ''
      return
    }

    if (queue !== '') {
      client.channels.cache.get(settings.logChannel).send({ content: `${queue}`, allowedMentions: { parse: [] } })
      queue = ''
    }
  }, 3000)

  client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id || message.channel.id !== process.argv[5] || message.author.bot) return
    if (!message.content.indexOf(process.argv[4])) return

    bot.core.run(`/tellraw @a "§8[§a11Bot Discord§8]§r §c${message.author.username.replace(/["]+/g, '/')}§r: §7${message.content.replace(/["]+/g, '/')}"`)
  })
})

client.login(settings.token)

module.exports = { client, settings }
