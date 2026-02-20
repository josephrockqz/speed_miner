import axios from 'axios'

const url = 'https://node.joerock.dev/api/posts/speed_miner'

const apiClient = axios.create({
  baseURL: url,
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
})

class EventServiceMongo {

  // Get Scores
  static async getScores() {
    const res = await apiClient.get('')
    return res.data.map(score => ({ ...score }))
  }

  // Create Score
  static insertScore(level, name, time) {
    return apiClient.post('', {
      level: level,
      name: name,
      time: time
    })
  }
}

export default EventServiceMongo
