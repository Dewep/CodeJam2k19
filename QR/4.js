#!/bin/node

// python3 interactive_runner.py python3 testing_tool.py 0 -- node 4.js

function findBrokens (N, answers, responses) {
  let indexWorker = 0
  let indexAnswers = 0
  let indexResponses = 0
  let brokens = ''

  while (indexWorker < N) {
    let found = false

    if (indexAnswers < answers[0].length && indexResponses < responses[0].length) {
      found = true

      for (let index = 0; index < answers.length; index++) {
        if (answers[index][indexAnswers] !== responses[index][indexResponses]) {
          found = false
        }
      }
    }

    if (found) {
      indexResponses += 1
    } else {
      brokens += (brokens.length ? ' ' : '') + indexAnswers
    }
    
    indexAnswers += 1
    indexWorker += 1
  }

  return brokens
}

function getTestStore (N, step) {
  let testStore = ''
  let value = 0

  while (testStore.length < N) {
    testStore += Array(1 + Math.min(step, N - testStore.length)).join(value)
    value = value ? 0 : 1
  }

  return testStore
}

async function main () {
  let numberOfTests = await getLine({ asInteger: true, asArray: false })

  while (numberOfTests-- > 0) {
    const [N, B, F] = await getLine({ asInteger: true, asArray: true })
    log({ numberOfTests, N, B, F })

    const testStoresAnswers = []
    const testStoresResponses = []

    for (let step = 16; step >= 1; step /= 2) {
      const testStore = getTestStore(N, step)
      write(testStore + '\n')
      log({ testStore })

      testStoresAnswers.push(testStore)

      const res = await getLine({ asInteger: false, asArray: false })
      log({ res })

      testStoresResponses.push(res)

      if (res === '-1') {
        return process.exit(1)
      }
    }

    const solution = findBrokens(N, testStoresAnswers, testStoresResponses)
    write(solution + '\n')
    log({ solution })

    const verdict = await getLine({ asInteger: true, asArray: false })
    if (verdict === 1) {
      log('We won!')
    } else {
      log('we lost :(')
      return process.exit(1)
    }
  }
}

let _input = ''
let _onInput = null
function write (message) {
  process.stdout.write(message)
}
function log (message) {
  // process.stderr.write(JSON.stringify(message) + '\n')
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
