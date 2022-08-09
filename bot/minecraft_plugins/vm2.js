function inject(bot) {
    const {VM} = require('vm2');
    const mc = require('minecraft-protocol')

    const vm = new VM({
        timeout: 500,
        allowAsync: false,
        sandbox: {
            mc,
        },
    });

    bot.vm = vm
}

module.exports = { inject }