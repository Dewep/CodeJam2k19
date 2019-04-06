#!/bin/node

function isPrime (n) {
  return !(Array(n + 1).join(1).match(/^1?$|^(11+?)\1+$/))
}

const primes = []

function getPrimeAtIndex (index) {
  while (index >= primes.length) {
    let current = primes.length ? primes[primes.length - 1] + 1 : 2
    while (!isPrime(current)) {
      current += 1
    }
    primes.push(current)
  }
  return primes[index]
}

function findFirstPrimes (number, secondNumber) {
  let index = 0
  let prime = getPrimeAtIndex(index)
  while (number % prime !== 0) {
    index++
    prime = getPrimeAtIndex(index)
  }

  const secondPrime = number / prime
  if (secondNumber % prime === 0) {
    return secondPrime
  }

  return { choice1: prime, choice2: number / prime }
}

function findSolution (numbers, firstPrime) {
  const sol = [firstPrime]
  const primes = [firstPrime]

  for (const number of numbers) {
    const char = number / sol[sol.length - 1]
    if (number % sol[sol.length - 1] !== 0) {
      throw new Error('Bad choice BOB')
    }

    sol.push(char)
    if (!primes.includes(char)) {
      primes.push(char)
    }
  }

  primes.sort((a, b) => a - b)

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const secret = {}
  for (const index in alphabet) {
    secret[primes[index]] = alphabet[index]
  }

  // console.log('numbers', JSON.stringify(numbers))
  // console.log('sol', JSON.stringify(sol))
  // console.log('primes', JSON.stringify(primes))
  // console.log('secret', JSON.stringify(secret))

  return sol.map(value => secret[value]).join('')
}

async function main (input) {
  const lines = input.split('\n').filter(l => l)
  lines.shift()

  let test = 0
  for (let index in lines) {
    if (index % 2 === 1) {
      test += 1
      const numbers = lines[index].split(' ').map(n => +n)
      let solSecret = ''

      const firstPrimes = findFirstPrimes(numbers[0])
      try {
        solSecret = findSolution(numbers, firstPrimes.choice1)
      } catch (err) {
        solSecret = findSolution(numbers, firstPrimes.choice2)
      }

      write(`Case #${test}: ${solSecret}\n`)
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
