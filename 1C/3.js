#!/bin/node

// python3 interactive_runner.py python3 testing_tool.py 0 -- node 3.js

function mutateMap (R, C, map, r, c, type) {
  let i
  if (type === 'H') {
    if (map[r].includes('#')) {
      return null
    }
    map = map.map(line => line)
    i = c
    while (i >= 0 && map[r][i] === '.') {
      map[r] = map[r].substr(0, i) + 'o' + map[r].substr(i + 1)
      i -= 1
    }
    i = c + 1
    while (i < C && map[r][i] === '.') {
      map[r] = map[r].substr(0, i) + 'o' + map[r].substr(i + 1)
      i += 1
    }
    return map
  }
  if (type === 'V') {
    for (let r = 0; r < R; r++) {
      if (map[r][c] === '#') {
        return null
      }
    }
    map = map.map(line => line)
    i = r
    while (i >= 0 && map[i][c] === '.') {
      map[i] = map[i].substr(0, c) + 'o' + map[i].substr(c + 1)
      i -= 1
    }
    i = r + 1
    while (i < R && map[i][c] === '.') {
      map[i] = map[i].substr(0, c) + 'o' + map[i].substr(c + 1)
      i += 1
    }
    return map
  }
  return null
}

function countWin (R, C, map, becca = true, first = true) {
  let nb = 0
  let end = true
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (map[r][c] === '.') {
        const mapH = mutateMap(R, C, map, r, c, 'H')
        const mapV = mutateMap(R, C, map, r, c, 'V')
        if (mapH) {
          nb += countWin(R, C, mapH, !becca, false)
          end = false
        }
        if (mapV) {
          nb += countWin(R, C, mapV, !becca, false)
          end = false
        }
      }
    }
  }
  if (end) {
    // console.log('countWinEnd', becca ? 0 : 1, becca, ':', map.join(' '), ':')
    return becca ? 0 : 1
  }
  // console.log('countWinContinue', nb, '\n' + map.join('\n'))
  return !first && nb ? 1 : nb
}

async function main () {
  let numberOfTests = await getLine({ asInteger: true, asArray: false })
  let testNumber = 1

  while (testNumber <= numberOfTests) {
    const [R, C] = await getLine({ asInteger: true, asArray: true })
    const map = []

    for (let r = 0; r < R; r++) {
      map.push(await getLine({ asInteger: false, asArray: false }))
    }

    let res = countWin(R, C, map, true)

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
process.stdin.on('end', () => {
  _input += '\n'
  if (_onInput) {
    _onInput()
    _onInput = null
  }
})
main().then(() => process.exit(0)).catch(err => console.error(err))
// python3 interactive_runner.py python3 testing_tool.py 0 -- node 3.js
