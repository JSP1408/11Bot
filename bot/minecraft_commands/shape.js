let sphere = require('../utilities/sphereGen')

let animations = []
const reloadDisabled = true

exports.run = (bot, args) => {
  switch (args[0]) {
    case 'help':
      bot.send.info('Help for -shape command: ')
      bot.send.info('-shape spiral <x> <y> <z> <mob> -> Generates spiral at coordinates.')
      bot.send.info('-shape sphere <x> <y> <z> <radius> <details> <rotation> <mob> -> Generates sphere at coordinates.')
      bot.send.info('-shape sphere_animated <x> <y> <z> <radius> <details> <mob> <flags> -> Generates rotating sphere at coordinates.')
      bot.send.info('-shape list_animations -> Lists all currently working animations. (DISABLED)')
      bot.send.info('-shape clear_animation <id | ALL> -> Clears 1 or all animations.')
      bot.send.info(`-shape reload_sphere_file -> Reload sphere file (${reloadDisabled ? 'disbaled' : 'enabled'})`)
      break

    case 'spiral':
      bot.send.success('Generating spiral at set coords...')

      let angle = 0
      let times = 0

      while (times < 720) {
        const x = parseInt(args[1]) + (1 + angle) * Math.cos(angle)
        const y = parseInt(args[2])
        const z = parseInt(args[3]) + (1 + angle) * Math.sin(angle)
        const mob = args[4]

        bot.core.run(`summon ${mob} ${x} ${y} ${z} {NoAI: 1b, NoGravity: 1b}`)

        times += 1
        angle += 0.1
      }

      bot.send.success('Spiral finished!...')

      break

    case 'sphere':
      const x = parseFloat(args[1])
      const y = parseFloat(args[2])
      const z = parseFloat(args[3])
      const radius = parseFloat(args[4])
      const details = parseFloat(args[5])
      const rotation = degreesToRadiants(parseFloat(args[6]))
      const mob2 = args[7]

      bot.send.success('Generating sphere at set coords...')

      const points = sphere(x, y, z, radius, details, rotation)

      for (const point of points) {
        bot.core.run(`summon ${mob2} ${point.x} ${point.y} ${point.z} {NoAI: 1b, NoGravity: 1b}`)
      }

      bot.send.success('Sphere finished!...')

      break

    case 'sphere_animated':
      const centerX = parseFloat(args[1])
      const centerY = parseFloat(args[2])
      const centerZ = parseFloat(args[3])
      const animatedRadius = parseFloat(args[4])
      const animatedDetails = parseFloat(args[5])
      const mob3 = args[6]

      let isRotationAnimated = true
      let isRadiusAnimated = false

      if (args.length > 6) {
        for (let i = 6; i < args.length; i++) {
          if (i == args.length - 1) { continue }
          const arg = args[i]
          const enabled = args[i + 1] == 'true'

          if (arg == '-radius') { isRadiusAnimated = enabled } else if (arg == '-rotation') { isRotationAnimated = enabled }

          i++
        }
      }

      console.log(isRadiusAnimated, isRotationAnimated)

      bot.send.success('Generating sphere animation at set coords...')

      let animatedRotation = 0
      let radiusSpeed = -0.3
      let currentRadius = animatedRadius

      const frames = 0

      const animId = Math.floor(Math.random() * 200)
      const animationObj = {
        interval: null,
        type: 'sphere',
        location: {
          x: centerX,
          y: centerY,
          z: centerZ
        }
      }
      const interval = setInterval(() => {
        if (frames > 1000 || !animations.includes(animationObj)) {
          bot.send.success('Sphere animation finished!...')
          bot.core.run(`/kill @e[tag=sphere_animation_${animId}]`)
          clearInterval(interval)

          return
        }

        bot.core.run(`/kill @e[tag=sphere_animation_${animId}]`)
        const animatedPoints = sphere(centerX, centerY, centerZ, currentRadius, animatedDetails, animatedRotation)
        for (const point of animatedPoints) {
          bot.core.run(`/summon ${mob3} ${point.x} ${point.y} ${point.z} {NoGravity: 1b, Tags: ["sphere_animation", "sphere_animation_${animId}"]}`)
        }

        if (isRotationAnimated) { animatedRotation += 0.1 }

        if (isRadiusAnimated) {
          if (currentRadius < -animatedRadius) {
            radiusSpeed *= -1
            currentRadius = -animatedRadius
          }

          if (currentRadius > animatedRadius) {
            radiusSpeed *= -1
            currentRadius = animatedRadius
          }

          currentRadius += radiusSpeed
        }
        // frames++;
      }, 200)

      animations.push(animationObj)

      break

    case 'list_animations':
      bot.send.error('bcraw &8[&7Disabled'); return

      bot.send.info('bcraw &8[&7Running animations: ')

      for (const animation of animations) {
        bot.send.info(`${animations.indexOf(animation)}) ${animation.type} -> x: ${animation.location.x}, y: ${animation.location.y} z: ${animation.location.z}`)
      }
      break

    case 'clear_animation':
      const target = args[1]
      if (target == null) {
        bot.send.error('Invalid id! See valid ids with -shape list_animations or use ALL.')
        break
      }

      if (target.toLowerCase() == 'all') {
        animations = []

        bot.send.success('All animation cleared!')
        break
      }

      if (animations[target] == null) {
        bot.send.error('Invalid id! See valid ids with -shape list_animations or use ALL.')
        break
      }

      delete animations[target]
      bot.send.success(`Animation ${target} cleared!`)

      break

    case 'reload_sphere_file':
      if (reloadDisabled) {
        bot.send.error('Reloading files is currently disabled!')
        break
      }
      delete require.cache[require.resolve(`${__dirname}/../utilities/sphereGen.js`)]
      sphere = require('../utilities/sphereGen')

      bot.send.success('Reloaded sphere file!...')
      break

    default:
      bot.send.error('Invalid action!')
  }
}

function degreesToRadiants (degrees) {
  return degrees * Math.PI * 2 / 360
}

exports.name = 'shape'
exports.hash = true
