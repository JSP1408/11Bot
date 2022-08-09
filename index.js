const Bot = require('./bot/utilities/botHandler')
const DiscordBot = require('./bot/utilities/discord')
const fs = require('fs')
const path = require('path')
const reload = require('require-reload')
const server = JSON.parse(fs.readFileSync(`./bot/config/servers/${process.argv[2]}` + '.json'))
const config = require('./bot/config/main.json')
const { genUser } = require('./bot/utilities/username')

const discord = new DiscordBot({ token: server.token, channel: server.channel, prefix: config.prefix })

start(genUser(), server.host, server.port)

function start (username, host, port) {
  const bot = new Bot({ username, host, port })

  bot.on('login', () => {
    console.info('Logged in!')
    pluginLoader('bot/minecraft_plugins/', bot, discord)

    bot._client.once('declare_commands', (data) => {
      console.log('a')
      require('fs').writeFileSync('./declare_commands.txt', JSON.stringify(data))
    })

    bot.on('end', (data) => {
      console.error(data)

      let timeout = 1000

      if (
        data.extra?.find(
          (data) => data.text === 'Wait 5 seconds before connecting, thanks! :)'
        )
      ) { timeout = 1000 * 6 }

      setTimeout(start, timeout, genUser(), server.host, server.port)
    })
  })

  discord.on('ready', () => {
    console.info('Ready!')
    pluginLoader('bot/discord_plugins/', bot, discord)
  })
}

function pluginLoader (directory, bot, discord) {
  for (const filename of fs.readdirSync(directory)) {
    const fullpath = path.join(__dirname, directory, filename)

    let plugin

    try {
      plugin = reload(fullpath)

      plugin.inject(bot, discord)
    } catch (error) {
      console.error(`[${filename}] ${error}`)
    }
  }
}
