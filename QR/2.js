#!/bin/node

async function main (input) {
  const lines = input.split('\n').filter(l => l)
  lines.shift()

  let test = 0
  for (let index in lines) {
    if (index % 2 === 1) {
      test += 1
      const value = lines[index].replace(/E/g, 's').replace(/S/g, 'E').replace(/s/g, 'S')

      write(`Case #${test}: ${value}\n`)
    }
  }
}

let _input = ''
function write (message) {
  process.stdout.write(message)
}
function log (message) {
  process.stderr.write(JSON.stringify(message) + '\n')
}
process.stdin.resume()
process.stdin.on('data', chunk => {
  _input += chunk.toString().replace(/\r/g, '')
})
process.stdin.on('end', () => main(_input).then(() => process.exit(0)).catch(err => console.error(err)))
