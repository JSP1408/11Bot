/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const reload = require('require-reload')(require)
const options = {
  enableMC: true,
  enableDC: true
}

// Start MC Bot
if (options.enableMC === true) {
  let mcBot
  mcBot = reload('./bots/minecraft/index.js')
} else {
  console.log('MC bot not Enabled!')
}

// Start DC Bot
if (options.enableDC === true) {
  let mcBot
  mcBot = reload('./bots/discord/index.js')
} else {
  console.log('DC bot not Enabled!')
}
