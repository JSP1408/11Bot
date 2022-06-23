const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')

class CommandHandler extends EventEmitter {
  constructor (options) {
    super()
    this.folder = options.folder ?? './bots/minecraft/mc_modules/commands/'
    // this.trustedFile = options.trustedFile ?? "./plugins/json/trusted.json";
    this.bannedFile = './bots/minecraft/JSON/banned.json'
    // this.crashFile = "./plugins/json/Cfiltered.json";
    this.maxFolderDepth = options.maxFolderDepth ?? 3
    this.prefix = options.prefix ?? '|'
    this.securityCodeOptions = {
      length: options.securityCodeLength ?? 7,
      charset:
        options.securityCodeCharset ?? 'abcdefghijklmnopqrstuvwxyz123456789',
      regenOnFail: options.securityCodeRegenOnFail ?? false
    }

    this.commands = {}
    this.securityCode = ''
    // this.trusted = [];
    this.banned = []
    // this.crashFilter = [];
    this.genSecurityCode()

    this.loadCommands(this.folder)
    // this.loadTrusted();
    this.loadBanned()
    // this.loadCrashFilter();
  }

  loadCommands (folder, depth = 0) {
    if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
      fs.mkdirSync(folder)
      return
    }

    if (depth === 0) this.commands = {}

    if (depth > this.maxFolderDepth) return

    const files = fs.readdirSync(folder)

    for (const file of files) {
      const filePath = path.resolve(`${folder}/${file}`)

      const stats = fs.statSync(filePath)
      if (stats.isDirectory()) {
        this.loadCommands(filePath, depth + 1)
        continue
      }

      this.loadCommand(filePath)
    }
  }

  loadCommand (filePath) {
    try {
      const command = new Command(filePath, require(filePath))

      if (
        this.commands[command.name] != null &&
        !this.commands[command.name].isAlias
      ) { return }

      this.commands[command.name] = {
        isAlias: false,
        command
      }

      for (const alias of command.aliases) {
        if (this.commands[alias] != null) return

        this.commands[alias] = {
          isAlias: true,
          command
        }
      }
    } catch (err) {
      console.log(`Error while loading ${filePath} :\n`, err)
    }
  }

  execute (bot, username, cmd, args) {
    if (!this.isCommand(cmd)) return false

    const command = this.getCommand(cmd)
    /* if (command.trustedOnly && !this.isTrusted(username)) {
      this.emit("botError", `Only trusted players can use this command!`);
      return false;
    } */

    if (command.useSecurityCode) {
      const isValid = this.isValidSecurityCode(args[0])

      if (!isValid) {
        this.emit('botError', 'Invalid hash provided!')
        return false
      }

      args.shift()
      this.genSecurityCode()
    }

    try {
      command.execute(bot, username, cmd, args, this)
      return true
    } catch (err) {
      console.log(err)
      this.emit('botError', `${err}` + '!')
      return false
    }
  }

  isCommand (cmd) {
    return this.commands[cmd] != null
  }

  getCommands () {
    const commands = []
    for (const cmd of Object.keys(this.commands)) {
      const command = this.commands[cmd]
      if (command.isAlias) continue

      commands.push(command.command)
    }

    return commands
  }

  getCommand (cmd) {
    if (!this.isCommand(cmd)) return null

    const command = this.commands[cmd].command
    return command
  }

  reload (cmd) {
    if (!this.isCommand(cmd)) return false

    const command = this.getCommand(cmd)
    this.commands[command.name] = null

    for (const alias of command.aliases) {
      const aliasCmd = this.commands[alias]
      if (command === aliasCmd.command) this.commands[alias] = null
    }

    delete require.cache[require.resolve(command.path)]

    this.loadCommand(command.path)
    return true
  }

  reloadAll () {
    for (const command of this.getCommands()) {
      const cmd = command.name

      this.reload(cmd)
    }

    return true
  }

  isValidSecurityCode (securityCode) {
    if (
      securityCode !== this.securityCode &&
      this.securityCodeOptions.regenOnFail
    ) {
      this.genSecurityCode()
      return false
    }

    return securityCode === this.securityCode
  }

  genSecurityCode () {
    const crypto = require('crypto')
    var hash = crypto.createHash('sha256')
    const randomBytes = crypto.randomBytes(289)
    hash.update(randomBytes)
    var hash = hash.digest(Math.round(Math.random()) ? 'hex' : 'Base64')

    /* console.log(hash.substring(0, 16)) */
    let securityCode = ''
    const charset = this.securityCodeOptions.charset
    securityCode += hash.substring(0, 16)

    this.securityCode = securityCode
    this.emit('securityCodeChange', this.securityCode)
    return securityCode
  }

  loadBanned () {
    if (!fs.existsSync(this.bannedFile)) return

    try {
      const banned = JSON.parse(fs.readFileSync(this.bannedFile))
      if (!Array.isArray(banned)) {
        // eslint-disable-next-line no-undef
        console.log(
          // eslint-disable-next-line no-undef
          `Error while loading ${file}: Invalid json must be an array!`
        )
        // this.emit("error", `Error while loading ${file}: Invalid json must be an array!`);
        return
      }

      this.banned = banned
    } catch (err) {
      // eslint-disable-next-line no-undef
      console.log(`Error while loading ${file}:\n${err}`)
      // this.emit("error", `Error while loading ${file}:\n${err}`);
    }
  }

  /* loadCrashFilter() {
    if (!fs.existsSync(this.crashFile)) return;

    try {
      let crashed = JSON.parse(fs.readFileSync(this.crashFile));
      if (!Array.isArray(crashed)) {
        // eslint-disable-next-line no-undef
        console.log(
          `Error while loading ${file}: Invalid json must be an array!`
        );
        // this.emit("error", `Error while loading ${file}: Invalid json must be an array!`);
        return;
      }

      this.crashed = crashed;
    } catch (err) {
      // eslint-disable-next-line no-undef
      console.log(`Error while loading ${file}:\n${err}`);
      // this.emit("error", `Error while loading ${file}:\n${err}`);
    }
  }

  loadTrusted() {
    if (!fs.existsSync(this.trustedFile)) return;

    try {
      let trusted = JSON.parse(fs.readFileSync(this.trustedFile));
      if (!Array.isArray(trusted)) {
        // eslint-disable-next-line no-undef
        console.log(
          `Error while loading ${file}: Invalid json must be an array!`
        );
        // this.emit("error", `Error while loading ${file}: Invalid json must be an array!`);
        return;
      }

      this.trusted = trusted;
    } catch (err) {
      // eslint-disable-next-line no-undef
      console.log(`Error while loading ${file}:\n${err}`);
      // this.emit("error", `Error while loading ${file}:\n${err}`);
    }
  } */
}

class Command {
  constructor (path, required) {
    this.path = path
    this.name = required.name
    this.aliases = required.aliases
    this.description = required.description
    this.usage = required.usage

    // this.trustedOnly = required.trustedOnly;
    this.useSecurityCode = required.useSecurityCode

    this.execute = required.execute
  }
}

module.exports = {
  CommandHandler,
  Command
}
