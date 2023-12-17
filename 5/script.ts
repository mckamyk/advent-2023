const [rawSeeds, ...rawMaps] = (await Bun.file(import.meta.dir + "/input.txt").text()).split("\n\n")

const createMap = (text: string) => {
  const [_, ...ranges] = text.split('\n')

  return {
    ranges: ranges.map(r => {
      const [destination, source, size] = r.split(" ").map(Number)
      return { source, destination, size }
    }),

    findRange: function(source: number) {
      return this.ranges.find(r => {
        const max = r.source + r.size
        const min = r.source
        return source >= min && source <= max
      })
    },

    getDestination: function(source: number) {
      const range = this.findRange(source)
      if (!range) return source
      const diff = source - range.source
      return range.destination + diff
    },
  }
}

const getSeedRanges = (rawSeeds: string) => {
  const nums = rawSeeds.split(':')[1].split(" ").filter(s => !!s).map(Number)
  const ranges: [number, number][] = []
  for (let i = 0; i < nums.length / 2; i++) {
    ranges.push([nums[i], nums[i + 1]])
  }
  return ranges
}

const getLocation = (seed: number) => {
  return maps.reduce((p, c) => c.getDestination(p), seed)
}

const seeds = rawSeeds.split(":")[1].split(" ").filter(s => !!s).map(Number)
const maps = rawMaps.map(createMap)
const locations = seeds.map(seed => {
  return maps.reduce((p, c) => c.getDestination(p), seed)
})
const min = locations.reduce((p, c) => c < p ? c : p)

const seedRanges = getSeedRanges(rawSeeds);
const rangeLocations = seedRanges.map(([min, length], i) => {
  console.log(`Working on seed range`, i)
  let minLoc = Number.MAX_VALUE;
  for (let i = min; i + length; i++) {
    const x = getLocation(i)
    if (x < minLoc) minLoc = x
  }
  return minLoc
})
const rangeMin = rangeLocations.reduce((p, c) => p < c ? p : c)

console.log(min)
console.log(rangeMin)

