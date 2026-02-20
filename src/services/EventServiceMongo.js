import axios from 'axios'

const url = 'https://node.joerock.dev/api/posts/speed_miner'

class EventServiceMongo {
  
  // Get Scores
  static async getScores() {
    const res = await axios.get(url)
    return res.data.map(score => ({ ...score }))
  }

  // Create Score
  static insertScore(level, name, time) {
    return axios.post(url, {
      level: level,
      name: name,
      time: time
    })
  }
}

export default EventServiceMongo
