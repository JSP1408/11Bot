const { createClient } = require('minecraft-protocol')
const Vec3 = require('vec3')
const EventEmitter = require('events')

class Bot extends EventEmitter {
  constructor (options = {}) {
    super()

    options.username = options.username ?? 'Client'
    options.password = options.password ?? null
    options.host = options.host ?? '127.0.0.1'
    options.port = options.port ?? 25565
    options.hideErrors = options.hideErrors ?? true

    const client = createClient(options)

    this._client = client
    this.username = options.username
    this.host = options.host
    this.port = options.port
    this.ip = options.host + ':' + options.port
    this.position = new Vec3(null, null, null)
    this.version = client.version
    this.collection = new Map()
    this.commands = []

    client.once('login', (data) => {
      this.entityId = data.entityId
      this.emit('login', data)
    })

    client.on('position', (data) => {
      this.position = data
      client.write('teleport_confirm', { teleportId: data.teleportId })

      this.emit('position', data)
    })

    client.on('chat', (data) => {
      this.emit('chat', data)
    })

    client.once('end', reason => {
      this.emit('end', reason, 'end')
    })

    client.once('error', reason => {
      this.emit('end', reason, 'end')
    })

  }

  write (name, params) {
    this._client.write(name, params)
  }

  chat (message) {
    this.write('chat', { message })
  }
}

module.exports = Bot
