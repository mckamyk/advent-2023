const rawCards = (await Bun.file(import.meta.dir + "/input.txt").text()).split('\n').filter(l => !!l)

type Card = {
  winningNumbers: number[],
  numbers: number[];
  id: number;
  matches: number
  copies: Card[],
  totalValue?: number
}

const parseCard = (raw: string, id: number): Card => {
  const data = raw.split(":")[1]
  const [wins, numbs] = data.split('|').map(s => s.split(' ').filter(s => !!s).map(Number))

  const card = {
    winningNumbers: wins,
    numbers: numbs,
    id,
    matches: 0,
    copies: [],
  }
  return card
}

const countCards = (card: Card): number => {
  if (card.totalValue) return card.totalValue
  if (!card.copies.length) {
    card.totalValue = 1;
    return card.totalValue
  }

  const copiesValues = card.copies.map(c => countCards(c))
  const v = copiesValues.reduce((p, c) => p + c)
  card.totalValue = v + 1
  return card.totalValue
}

const getCopies = (c: Card) => {
  c.matches = c.numbers.filter(n => c.winningNumbers.includes(n)).filter(w => w).length
  c.copies = [...cards.slice(c.id, c.id + c.matches)]
  return c
}

const getScore = (c: Card): number => {
  const found = c.numbers.filter(n => c.winningNumbers.includes(n))

  if (!found.length) return 0
  if (found.length === 1) return 1
  return 1 * Math.pow(2, found.length - 1)
}

const printCard = (c: Card) => {
  console.log(`Card ${c.id} has ${c.matches} matches and copies of ${c.copies.map(c => `Card ${c.id}`).join(', ')}`)
}

const d = Date.now()
const cards = rawCards.map((l, i) => parseCard(l, i + 1))
cards.forEach(getCopies)
const scores = cards.map(getScore)
const sum = scores.reduce((c, p) => c + p, 0)

const sumCards = cards.map(countCards).reduce((p, c) => p + c)

console.log(`sum: ${sum}`)
console.log(`num cards: ${sumCards.toLocaleString()}`)
console.log(sumCards)
console.log(`completed in ${Date.now() - d}ms`)


