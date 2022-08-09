exports.run = (bot, args, hash, username, sender, discord) => {
  const coords = { x: Math.floor(Math.random() * 2900000), y: Math.floor(Math.random() * 266), z: Math.floor(Math.random() * 2900000) }
  bot.send.success(`Teleporting ${coords.x} ${coords.y} ${coords.z}`)
  bot.core.run(`execute unless entity @r[name= run ] run tp @a[nbt={UUID:[I;${bot.uuidToInt(sender).join()}]}] ${coords.x} ${coords.y} ${coords.z}`)
}

exports.name = 'rtp'
exports.hash = false
