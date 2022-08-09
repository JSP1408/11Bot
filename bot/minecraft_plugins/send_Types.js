function inject (bot) {
  const send = {
    info (input) {
      bot.core.run(`/tellraw @a [{"text":"[", "color":"dark_gray"}, {"text":${JSON.stringify(input)}, "color":"gray"}, {"text":"]", "color":"dark_gray"}]`)
    },

    error (input) {
      bot.core.run(`/tellraw @a [{"text":"[", "color":"dark_gray"}, {"text":${JSON.stringify(input)}, "color":"red"}, {"text":"]", "color":"dark_gray"}]`)
    },

    success (input) {
      bot.core.run(`/tellraw @a [{"text":"[", "color":"dark_gray"}, {"text":${JSON.stringify(input)}, "color":"green"}, {"text":"]", "color":"dark_gray"}]`)
    }
  }

  bot.send = send
}

module.exports = { inject }
