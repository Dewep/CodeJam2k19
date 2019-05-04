#!/bin/node

function maxSuffix (used, words, word) {
  for (let index = 0; index < word.length; index++) {
    const suffix = word.slice(index)

    if (used.includes(suffix)) {
      continue
    }

    for (const w of words) {
      if (w.line !== word && w.line.endsWith(suffix)) {
        return suffix.length
      }      
    }
  }

  return 0
}

function findSolution (used, words) {
  while (true) {
    if (!words.length) {
      return
    }

    for (const word of words) {
      word.max = maxSuffix(used, words, word.line)
    }
  
    words.sort((a, b) => b.max - a.max)
  
    if (!words[0].max) {
      return
    }

    const suffix = words[0].line.slice(words[0].line.length - words[0].max)
    used.push(suffix)
    let removed = 0

    words = words.filter(w => {
      if (removed < 2 && w.line.endsWith(suffix)) {
        removed += 1
        return false
      }
      return true
    })
  }
}

async function main () {
  let numberOfTests = await getLine({ asInteger: true, asArray: false })
  let testNumber = 1

  while (testNumber <= numberOfTests) {
    const nbWords = await getLine({ asInteger: true, asArray: false })
    const words = []

    for (let i = 0; i < nbWords; i++) {
      words.push({
        line: await getLine({ asInteger: false, asArray: false })
      })
    }

    const suffix = []

    findSolution(suffix, words)

    // log({ testNumber, words, suffix })

    write(`Case #${testNumber}: ${suffix.length * 2}\n`)

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
// python3 interactive_runner.py python3 testing_tool.py 0 -- node 4.js
