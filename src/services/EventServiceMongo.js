import axios from 'axios'

const url = 'https://node.joerock.dev/api/speed_miner'

class EventServiceMongo {
  
  // Get Scores
  static getScores() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url)
        const data = res.data
        resolve(
          data.map(score => ({
            ...score
          }))
        )
      } catch (err) {
        reject(err)
      }
    })
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
