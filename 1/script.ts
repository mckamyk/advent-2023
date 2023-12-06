const lines = (await Bun.file(import.meta.dir + '/input.txt').text()).split('\n')

const numbers = '1234567890'

const allNums = lines.filter(line => !!line).map(line => {
  const chars = line.split('')
  const nums = chars.filter(c => numbers.includes(c))
  const firstLast = `${nums[0]}${nums.pop()}`
  return Number(firstLast)
})

const sum = allNums.reduce((prev, curr) => { return prev + curr }, 0)

console.log(sum)

