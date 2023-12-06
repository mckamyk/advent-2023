const lines = (await Bun.file(import.meta.dir + "/input.txt").text()).split("\n").filter(line => !!line)

type Round = {
  red: number,
  blue: number,
  green: number,
}

const max: Round = {
  red: 12,
  green: 13,
  blue: 14,
}

type Game = {
  number: number,
  rounds: Round[],
  pass?: boolean
}

const isGamePossible = (game: Game) => {
  for (let i in game.rounds) {
    const round = game.rounds[i]
    if (round.red > max.red) {
      game.pass = false
      return game
    }
    if (round.green > max.green) {
      game.pass = false
      return game
    }
    if (round.blue > max.blue) {
      game.pass = false
      return game
    }
  }

  game.pass = true
  return game
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
const passes = games.map(isGamePossible).filter(p => p.pass).reduce((p, c) => p + c.number, 0)

console.log(passes)


