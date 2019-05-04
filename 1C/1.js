#!/bin/node

// python3 interactive_runner.py python3 testing_tool.py 0 -- node 1.js

async function main () {
  let numberOfTests = await getLine({ asInteger: true, asArray: false })
  let testNumber = 1

  while (testNumber <= numberOfTests) {
    const A = await getLine({ asInteger: true, asArray: false })

    let lines = []
    for (let a = 0; a < A; a++) {
      const line = await getLine({ asInteger: false, asArray: false })
      let fullline = ''
      while (fullline.length < 500) {
        fullline += line
      }
      lines.push(fullline.slice(0, 500))
    }

    let end = false
    let sol = ''

    for (let i = 0; i < 500; i++) {
      const present = { R: false, P: false, S: false }

      for (const line of lines) {
        present[line[i]] = true
      }

      if (present.R && present.P && present.S) {
        sol = null
        // log('all-present')
        break
      } else if (present.R && !present.S) {
        sol += 'P'
        // log('P')
        lines = lines.filter(line => line[i] !== 'R')
      } else if (!present.P && present.S) {
        sol += 'R'
        // log('R')
        lines = lines.filter(line => line[i] !== 'S')
      } else if (!present.R && present.P) {
        sol += 'S'
        // log('S')
        lines = lines.filter(line => line[i] !== 'P')
      } else {
        sol = null
        // log('nope')
        break
      }

      // log({ remaining: lines.length })
      if (!lines.length) {
        end = true
        break
      }
    }

    const res = !sol || !sol.length || !end ? 'IMPOSSIBLE' : sol

    // log({ testNumber, res })

    write(`Case #${testNumber}: ${res}\n`)

    testNumber += 1
  }
}

let _input = ''
let _onInput = null
function write (message) {
  process.stdout.write(message)
}
function log (message) {
  process.stderr.write(JSON.stringify(message) + '\n')
}
async function getRawLine () {
  const index = _input.indexOf('\n')
  if (index === -1) {
    await new Promise(resolve => {
      _onInput = resolve
    })
    return getRawLine()
  }
  const line = _input.slice(0, index)
  _input = _input.slice(index + 1)
  return line
}
// opts.asArray: split by spaces
// opts.asInteger: convert items in integer
async function getLine (opts = {}) {
  const line = await getRawLine()
  const transfomer = opts.asInteger ? n => +n : n => n
  return opts.asArray ? line.split(' ').map(transfomer) : transfomer(line)
}
process.stdin.on('data', chunk => {
  _input += chunk.toString().replace(/\r/g, '')
  if (_onInput) {
    _onInput()
    _onInput = null
  }
})
main().then(() => process.exit(0)).catch(err => console.error(err))
// python3 interactive_runner.py python3 testing_tool.py 0 -- node 1.js
