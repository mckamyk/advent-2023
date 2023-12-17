const lines = (await Bun.file(import.meta.dir + '/input.txt').text()).split('\n').filter(l => !!l)

const numbers = '0123456789'
const symbols = '*/+%-=$@#&'

type FoundNumber = {
  number: number,
  length: number,
  loc: {
    line: number,
    pos: number
  },
  hasSymbol: boolean
}

type Gear = {
  loc: {
    line: number,
    pos: number,
  },
  isGear?: boolean
}
type GearWithRatio = Gear & {
  isGear: true
  ratio: number
}

const foundNumbers: FoundNumber[] = []
const foundGears: Gear[] = []

const parseLine = (line: string, y: number) => {
  let i = 0;
  const cs = line.split('')
  while (i < line.length) {
    const c = cs[i]

    if (c === '*') {
      foundGears.push({
        loc: {
          line: y, pos: i
        },
      })
    }

    if (numbers.includes(c)) {
      const num = getNumber(line, i, y)
      foundNumbers.push(num)
      if (y === 0) console.log(`Found num starting at ${i}: ${c}`, num)
      i += num.length
    } else {
      i += 1
    }
  }
}

const isGear = (g: Gear): GearWithRatio | Gear => {
  const x = g.loc.pos
  const y = g.loc.line
  const inRange = foundNumbers.filter(f => {
    // first we rule out where they're def not in range
    if (!f.hasSymbol) return false
    if (Math.abs(y - f.loc.line) > 1) return false
    const left = f.loc.pos
    const right = left + f.length - 1

    if (Math.abs(x - left) < 2) return true
    if (Math.abs(x - right) < 2) return true
  })

  if (inRange.length === 2) {
    return {
      loc: {
        line: y, pos: x
      },
      isGear: true,
      ratio: inRange[0].number * inRange[1].number
    }
  }
  return {
    loc: {
      line: y, pos: x
    },
    isGear: false
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

const gears = foundGears.map(isGear).filter(g => g.isGear) as GearWithRatio[]
const gearSum = gears.reduce((p, c) => p + c.ratio, 0)

Bun.write("./founds.json", JSON.stringify(withSymbol, undefined, 2))

console.log(`found ${withSymbol.length} numbers summed to ${sum}`)
console.log(`found ${gears.length} gears summed to ${gearSum}`)

