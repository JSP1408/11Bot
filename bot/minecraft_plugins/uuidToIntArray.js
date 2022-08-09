function inject (bot) {
  const uuid = {
    uuidToIntArray (uuid) {
      return uuid.replace(/-/g, '').match(/.{8}/g).map(str => Number.parseInt(str, 16)).map(num => num & 0x80000000 ? num - 0xffffffff - 1 : num)
    }
  }

  bot.uuidToInt = uuid.uuidToIntArray
}

module.exports = { inject }
