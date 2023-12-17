const lines = (await Bun.file(import.meta.dir + '/input.txt').text()).split('\n').filter(line => !!line)

const numbers = '1234567890'
const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const firstLetters = ['o', 't', 'f', 's', 'e', 'n', 'z']

const lookForNumber = (line: string) => {
  const chars = line.split('')
  const numStrings: string[] = []
  chars.forEach((c, i) => {
    if (numbers.includes(c)) {
      numStrings.push(c)
      return
    }
    if (firstLetters.includes(c)) {
      let word = chars.slice(i, i + 3).join('')
      let index = words.indexOf(word)
      if (index !== -1) {
        numStrings.push(`${index}`)
        return
      }
      word = chars.slice(i, i + 4).join('')
      index = words.indexOf(word)
      if (index !== -1) {
        numStrings.push(`${index}`)
        return
      }
      word = chars.slice(i, i + 5).join('')
      index = words.indexOf(word)
      if (index !== -1) {
        numStrings.push(`${index}`)
        return
      }
    }
  })

  return numStrings
}

const nums = lines.map(lookForNumber).map(nums => {
  return Number(`${nums[0]}${nums.pop()}`)
})

const sum = nums.reduce((prev, curr) => { return prev + curr }, 0)

console.log(sum)

