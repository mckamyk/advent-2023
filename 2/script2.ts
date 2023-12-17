const lines = (await Bun.file(import.meta.dir + "/input.txt").text()).split("\n").filter(line => !!line)

type Round = {
  red: number,
  blue: number,
  green: number,
}

type Game = {
  number: number,
  rounds: Round[],
  pass?: boolean
}

const minimumPossible = (game: Game): number => {
  const mins: Round = {
    red: 0, green: 0, blue: 0
  }

  game.rounds.forEach(r => {
    if (r.red > mins.red) mins.red = r.red
    if (r.green > mins.green) mins.green = r.green
    if (r.blue > mins.blue) mins.blue = r.blue
  })

  return mins.red * mins.green * mins.blue
}

const parseLine = (line: string): Game => {
  const [Game, ...gameData] = line.split(":")
  const number = Number(Game.split(' ')[1])

  const rounds = gameData.join('').split(';').map(r => {
    const colors = r.split(',')
    const rr: Round = {
      red: 0, green: 0, blue: 0
    }

    colors.forEach(c => {
      const [_, num, color] = c.split(' ')
      rr[color as keyof Round] = Number(num)
    })
    return rr
  })

  return {
    number,
    rounds
  }
}

const games = lines.map(parseLine)
const passes = games.map(minimumPossible).reduce((p, c) => p + c, 0)
console.log(passes)


