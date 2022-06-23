function engFuck (lang) {
  const opts = {
    chars: 'abcdefghijklmnopqrstuvwxyz{}()\'"` .,+-=:;<>*?!%#'.split(''),
    vals: '0123456789'.split(''),
    value: 0,
    output: ''
  }

  const input = lang

  for (let i = 0; i < input.length; i++) {
    if (input[i] === '+') opts.value++

    if (input[i] === '-') opts.value--

    if (input[i] == '^') {
      if (opts.value < 1 || opts.value > opts.output.length) {
        opts.value = 0
        return
      }

      output = opts.output.substring(0, opts.value - 1) + opts.output[opts.value - 1].toUpperCase() + opts.output.substring(opts.value, opts.output.length)
    }

    if (input[i] === '#') {
      const val = opts.vals[opts.value] ?? '0'
      opts.output += val
      opts.value = 0
    }

    if (input[i] === '=') {
      const char = opts.chars[opts.value - 1] ?? '#'
      opts.output += char
      opts.value = 0
    }
  }
  return opts.output
}

module.exports = {
  engFuck
}
