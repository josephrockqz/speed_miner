import axios from 'axios'

jest.mock('axios')

const mockGet = jest.fn()
const mockPost = jest.fn()

axios.create.mockReturnValue({
  get: mockGet,
  post: mockPost
})

// Import after mock setup
const EventServiceMongo = require('@/services/EventServiceMongo').default

describe('EventServiceMongo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getScores', () => {
    it('fetches scores and maps them', async () => {
      const mockData = [
        { _id: '1', name: 'Alice', time: 10, level: 1 },
        { _id: '2', name: 'Bob', time: 20, level: 2 }
      ]
      mockGet.mockResolvedValue({ data: mockData })

      const result = await EventServiceMongo.getScores()
      expect(mockGet).toHaveBeenCalledWith('')
      expect(result).toEqual(mockData.map(s => ({ ...s })))
    })

    it('throws on network error', async () => {
      mockGet.mockRejectedValue(new Error('Network error'))
      await expect(EventServiceMongo.getScores()).rejects.toThrow('Network error')
    })

    it('returns empty array when no scores', async () => {
      mockGet.mockResolvedValue({ data: [] })
      const result = await EventServiceMongo.getScores()
      expect(result).toEqual([])
    })
  })

  describe('insertScore', () => {
    it('posts score data', async () => {
      mockPost.mockResolvedValue({ data: {} })

      await EventServiceMongo.insertScore(1, 'Alice', 10)
      expect(mockPost).toHaveBeenCalledWith('', {
        level: 1,
        name: 'Alice',
        time: 10
      })
    })

    it('throws on server error', async () => {
      mockPost.mockRejectedValue(new Error('Server error'))
      await expect(EventServiceMongo.insertScore(1, 'Bob', 20)).rejects.toThrow('Server error')
    })
  })

  it('EventServiceMongo is a class with static methods', () => {
    expect(typeof EventServiceMongo.getScores).toBe('function')
    expect(typeof EventServiceMongo.insertScore).toBe('function')
  })
})
