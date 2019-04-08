#!/bin/node

async function main (input) {
  const lines = input.split('\n').filter(l => l)

  for (let index in lines) {
    if (index > 0) {
      const small = lines[index].replace(/4/g, '1')
      const remaining = BigInt(lines[index]) - BigInt(small)

      write(`Case #${index}: ${small} ${remaining}\n`)
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
