const lines = (await Bun.file(import.meta.dir + '/input.txt').text()).split('\n').filter(l => !!l)

const numbers = '0123456789'
const symbols = '*/+%-=$@#'

type FoundNumber = {
  number: number,
  length: number,
  lines: string[],
  loc: {
    line: number,
    pos: number
  },
  hasSymbol: boolean
}

const foundNumbers: FoundNumber[] = []

const parseLine = (line: string, y: number) => {
  for (let i = 0; i < line.length; i++) {
    line.split('').forEach((c, x) => {
      if (numbers.includes(c)) {
        const num = getNumber(line, x, y)
        foundNumbers.push(num)
        i += num.length
      }
    })
  }
}

const getNumber = (line: string, x: number, y: number): FoundNumber => {
  const chars: string[] = [line[x]]
  let x2 = x;
  if (x < line.length - 1) {
    for (let i = x + 1; i < line.length; i++) {
      const c = line[i]
      if (numbers.includes(c)) {
        chars.push(c)
        x2 = i
      } else {
        break;
      }
    }
  }
  return {
    number: Number(chars.join('')),
    length: chars.length,
    loc: {
      line: y,
      pos: x
    },
    hasSymbol: lookForSymbol(x, x2, y)
  }
}

const lookForSymbol = (x1: number, x2: number, y: number): boolean => {
  const up = y > 0;
  const down = y < lines.length - 1
  const left = x1 > 0;
  const right = x2 < lines[0].length - 1

  if (up) {
    const from = left ? x1 - 1 : x1
    const slice = lines[y - 1].slice(from, x2 + 2)
    const hasSymbol = slice.split('').filter(c => symbols.includes(c)).length > 0
    if (hasSymbol) return true
  }
  if (down) {
    const from = left ? x1 - 1 : x1
    const slice = lines[y + 1].slice(from, x2 + 2)
    const hasSymbol = slice.split('').filter(c => symbols.includes(c)).length > 0
    if (hasSymbol) return true
  }
  if (left && symbols.includes(lines[y][x1 - 1])) {
    return true
  }
  if (right && symbols.includes(lines[y][x2 + 1])) {
    return true
  }
  return false
}

lines.forEach(parseLine)

const withSymbol = foundNumbers.filter(n => n.hasSymbol)
const sum = withSymbol.reduce((prev, cur) => prev += cur.number, 0)

console.log(`found ${withSymbol.length} numbers summed to ${sum}`)

