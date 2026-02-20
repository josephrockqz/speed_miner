import { getNeighborIndices, isValidIndex } from '@/store'

describe('getNeighborIndices', () => {
  // 10x10 grid
  const width = 10
  const height = 10

  it('returns 3 neighbors for top-left corner (index 0)', () => {
    const neighbors = getNeighborIndices(0, width, height)
    expect(neighbors).toEqual(expect.arrayContaining([1, 10, 11]))
    expect(neighbors).toHaveLength(3)
  })

  it('returns 3 neighbors for top-right corner (index 9)', () => {
    const neighbors = getNeighborIndices(9, width, height)
    expect(neighbors).toEqual(expect.arrayContaining([8, 18, 19]))
    expect(neighbors).toHaveLength(3)
  })

  it('returns 3 neighbors for bottom-left corner (index 90)', () => {
    const neighbors = getNeighborIndices(90, width, height)
    expect(neighbors).toEqual(expect.arrayContaining([80, 81, 91]))
    expect(neighbors).toHaveLength(3)
  })

  it('returns 3 neighbors for bottom-right corner (index 99)', () => {
    const neighbors = getNeighborIndices(99, width, height)
    expect(neighbors).toEqual(expect.arrayContaining([88, 89, 98]))
    expect(neighbors).toHaveLength(3)
  })

  it('returns 5 neighbors for top edge (index 5)', () => {
    const neighbors = getNeighborIndices(5, width, height)
    expect(neighbors).toEqual(expect.arrayContaining([4, 6, 14, 15, 16]))
    expect(neighbors).toHaveLength(5)
  })

  it('returns 5 neighbors for bottom edge (index 95)', () => {
    const neighbors = getNeighborIndices(95, width, height)
    expect(neighbors).toEqual(expect.arrayContaining([84, 85, 86, 94, 96]))
    expect(neighbors).toHaveLength(5)
  })

  it('returns 5 neighbors for left edge (index 20)', () => {
    const neighbors = getNeighborIndices(20, width, height)
    expect(neighbors).toEqual(expect.arrayContaining([10, 11, 21, 30, 31]))
    expect(neighbors).toHaveLength(5)
  })

  it('returns 5 neighbors for right edge (index 29)', () => {
    const neighbors = getNeighborIndices(29, width, height)
    expect(neighbors).toEqual(expect.arrayContaining([18, 19, 28, 38, 39]))
    expect(neighbors).toHaveLength(5)
  })

  it('returns 8 neighbors for center cell (index 55)', () => {
    const neighbors = getNeighborIndices(55, width, height)
    expect(neighbors).toEqual(expect.arrayContaining([44, 45, 46, 54, 56, 64, 65, 66]))
    expect(neighbors).toHaveLength(8)
  })

  it('does not wrap around edges', () => {
    // index 10 is the first cell on second row (left edge)
    const neighbors = getNeighborIndices(10, width, height)
    expect(neighbors).not.toContain(9)
    expect(neighbors).not.toContain(19)
  })

  it('works with rectangular grids (25x10)', () => {
    const neighbors = getNeighborIndices(0, 25, 10)
    expect(neighbors).toEqual(expect.arrayContaining([1, 25, 26]))
    expect(neighbors).toHaveLength(3)
  })

  it('works with rectangular grids (30x16) center cell', () => {
    const neighbors = getNeighborIndices(255, 30, 16)
    expect(neighbors).toHaveLength(8)
    expect(neighbors).toEqual(expect.arrayContaining([224, 225, 226, 254, 256, 284, 285, 286]))
  })

  it('returns 8 neighbors for a non-edge cell in a 25x10 grid', () => {
    // index 26 = row 1, col 1 in 25-wide grid
    const neighbors = getNeighborIndices(26, 25, 10)
    expect(neighbors).toHaveLength(8)
    expect(neighbors).toEqual(expect.arrayContaining([0, 1, 2, 25, 27, 50, 51, 52]))
  })

  it('handles 1-wide grid', () => {
    const neighbors = getNeighborIndices(1, 1, 5)
    // only top and bottom neighbors
    expect(neighbors).toEqual(expect.arrayContaining([0, 2]))
    expect(neighbors).toHaveLength(2)
  })

  it('handles 1-tall grid', () => {
    const neighbors = getNeighborIndices(2, 5, 1)
    expect(neighbors).toEqual(expect.arrayContaining([1, 3]))
    expect(neighbors).toHaveLength(2)
  })
})

describe('isValidIndex', () => {
  const squares = [document.createElement('div'), document.createElement('div'), document.createElement('div')]
  const state = { numCells: 3, squares }

  it('returns true for valid indices', () => {
    expect(isValidIndex(0, state)).toBe(true)
    expect(isValidIndex(1, state)).toBe(true)
    expect(isValidIndex(2, state)).toBe(true)
  })

  it('returns false for negative index', () => {
    expect(isValidIndex(-1, state)).toBe(false)
  })

  it('returns false for index >= numCells', () => {
    expect(isValidIndex(3, state)).toBe(false)
    expect(isValidIndex(100, state)).toBe(false)
  })

  it('returns false when square is null', () => {
    const stateWithNull = { numCells: 3, squares: [null, document.createElement('div'), null] }
    expect(isValidIndex(0, stateWithNull)).toBe(false)
    expect(isValidIndex(1, stateWithNull)).toBe(true)
    expect(isValidIndex(2, stateWithNull)).toBe(false)
  })
})
