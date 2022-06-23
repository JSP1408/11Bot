const fs = require('fs')
const path = require('path')
const reload = require('require-reload')(require)
const {
    CommandHandler
} = require('./mc_modules/commandHandler')
const {
    genUser
} = require('./mc_modules/username')
const settings = require('./settings.json')
const Bot = require('./bot')

const cmdHandlerOptions = {
    prefix: settings.prefix,
    securityCodeLength: settings.securityLength,
    securityCodeRegenOnFail: settings.regenOnFail
}

const cmdHandler = new CommandHandler(cmdHandlerOptions)

const options = {
    host: process.argv[2],
    port: process.argv[6],
    username: genUser()
}

const reg = {
    nigger: /nigger/i,
    faggot: /faggot/i,
    jew: /jew/i,
    hitler: /hitler/i,
    supremacist: /supremacist/i,
    bigot: /bigot/i,
    negro: /negro/i,
    rape: /rape/i,
    swastika: /卐/i,
    kaboom: /kaboom/i
}

const bot = new Bot(options)

loadPlugins('/mc_modules/plugins/', bot)

function loadPlugins(directory, bot) {
    for (const filename of fs.readdirSync(path.join(__dirname, directory))) {
        const fullpath = path.join(__dirname, directory, filename)

        let plugin

        try {
            plugin = reload(fullpath)

            plugin.inject(bot)
        } catch (error) {
            console.error(`[${filename}] ${error}`)
        }
    }
}

bot.on('message', (username, message) => {
    const args = message.split(' ')
    let command = args.shift()
    const uname = username.replace(/\xa7.?/g, '')
    const fmessage = message.replace(/\xa7.?/g, '')

    for (const property in reg) {
        if (reg[property].test(fmessage)) {
            bot.core.run(`mute ${uname} 3h Filtered by §a§l11Bot`)
            return
        }
    }

    if (command.startsWith(cmdHandler.prefix)) {
        command = command.slice(1)

        if (!cmdHandler.isCommand(command)) {
            return
        }

        cmdHandler.execute(bot, uname, command, args)
    }
})

cmdHandler.on('securityCodeChange', function(code) {
    console.log(`Code changed: ${code}`)
})

cmdHandler.on('botError', function(err) {
    bot.core.run(`/tellraw @a "§8[§c${err}§8]"`)
    console.log(err)
})

bot.once('end', (reason) => {
    wrLog(reason)
    setTimeout(() => {
        process.exit(reason)
    }, 6000);
})

bot._client.on('error', error => {
    wrLog(`Error: ${error}`)
})

function wrLog(data) {
    console.info(`${data}`)
}

module.exports = {
    bot,
    cmdHandler
}