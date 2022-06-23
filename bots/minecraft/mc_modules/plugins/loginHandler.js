function inject(bot) {
    const fs = require('fs')

    bot.on('login', () => {
        bot.createCore()
        setTimeout(() => {
            bot.write('chat', {
                message: '/god on'
            })
        }, 800)

        setInterval(function() {
            const banned = JSON.parse(
                fs.readFileSync('./bots/minecraft/JSON/banned.json')
            )

            for (const {
                    name
                } of bot.players.getPlayers()) {

                if (banned.includes(name)) {
                    bot.core.run(`tp ${name} 0 100 1000000`)
                    bot.exploits.kick(`${name}`, 'Banned!')
                    return
                }
            }
        }, 500)
    })
}

// Allink is a furry

module.exports = {
    inject
}