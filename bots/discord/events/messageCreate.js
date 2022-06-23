module.exports = (client, message) => {
  if (message.author.bot) return

  if (message.content.indexOf(process.argv[4]) !== 0) return

  const args = message.content.slice(process.argv[4].length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  const cmd = client.commands.get(command)

  if (!cmd) {
    if (message.channel.id !== process.argv[5]) return
    message.reply(`Invalid command! Try ${process.argv[4]}help for help!`)
    return
  }

  if (cmd.trusted >= 1 && !message.member.roles.cache.has('973566813378052096')) {
    message.reply('You must be trusted!')
    return
  }

  if (message.channel.id !== process.argv[5]) return

  if (cmd >= undefined) return

  if (cmd.superTrusted >= 1 && !message.member.roles.cache.has('973683135525060629')) {
    message.reply('You must be super trusted!')
    return
  }

  cmd.run(client, message, args)
}
