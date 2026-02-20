export function createMockSquares(count) {
  const squares = []
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div')
    squares.push(div)
  }
  return squares
}
