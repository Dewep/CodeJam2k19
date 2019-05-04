#!/bin/node

function findSolution (R, C, sol, nextR, nextC) {
  if (nextR && nextC) {
    if (sol.length) {
      const [lastR, lastC] = sol[sol.length - 1]
      if (lastR === nextR || lastC === nextC || nextR - nextC === lastR - lastC || nextR + nextC === lastR + lastC) {
        // log({ forb: sol.map(item => item.join(' ')), nextR, nextC })
        throw new Error('Forbidden move')
      }
      for (let [prevR, prevC] of sol) {
        if (prevR === nextR && prevC === nextC) {
          // log({ used: sol.map(item => item.join(' ')), nextR, nextC })
          throw new Error('Already used')
        }
      }
    }
    
    sol.push([nextR, nextC])
  }

  if (sol.length === R * C) {
    return
  }

  // log('toto')
  // log({ OK: sol.map(item => item.join(' ')) })
  for (let r = 1; r <= R; r++) {
    for (let c = 1; c <= C; c++) {
      // log({ r, c })
      try {
        findSolution(R, C, sol, r, c)
        return
      } catch (err) {
      }
    }
  }

  if (nextR && nextC) {
    sol.pop()
  }

  // log({ impossible: sol.map(item => item.join(' ')) })
  throw new Error('Impossible')
}

async function main () {
  let numberOfTests = await getLine({ asInteger: true, asArray: false })
  let testNumber = 1

  while (testNumber <= numberOfTests) {
    const [R, C] = await getLine({ asInteger: true, asArray: true })
    // log({ testNumber, R, C })

    const sol = []

    try {
      findSolution(R, C, sol)
      write(`Case #${testNumber}: POSSIBLE\n`)
      write(sol.map(item => item.join(' ')).join('\n') + '\n')
    } catch (err) {
      write(`Case #${testNumber}: IMPOSSIBLE\n`)
    }

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
