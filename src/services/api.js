import axios from 'axios'
import qs from 'qs'
const baseUrl = '/api/fbhl'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getData = async (url) => {
  const res = await axios.get(`${baseUrl}${url}`)
  return res.data
}

const getDataFromArray = async (url, arr) => {
  const res = await axios.get(`${baseUrl}${url}`, {
    params: {
      matchIds: arr
    },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: "repeat" })
    }
  })
  return res.data
}

const deleteScheduledMatch = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.delete(`${baseUrl}/schedule/${id.toString()}`, config)
  return res.status
}

const updateScheduledMatch = async (id, newMatch) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.put(`${baseUrl}/schedule/${id.toString()}`, newMatch, config)
  return res
}

const createSchedueldMatch = async (newMatch) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.post(`${baseUrl}/schedule/`, newMatch, config)
  return res.data
}

const createForfeitedMatch = async (forfeitedMatch) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.post(`${baseUrl}/forfeits`, forfeitedMatch, config)
  return res.data
}

const deleteForfeitedMatch = async (matchId) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.delete(`${baseUrl}/forfeits/${matchId.toString()}`, config)
  return res
}

const reinstateMatch = async (matchId) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.delete(`${baseUrl}/invalidMatches/${matchId.toString()}`, config)
  return res.status
 }

 const invalidateMatch = async (matchId) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.post(`${baseUrl}/invalidMatches/`, { matchId, newRecord: true }, config)
  return res.status
}

const getMatch = async (matchId) => {
  const res = await axios.get(`${baseUrl}/matchHistory/${matchId}`)
  return res.data
}


const obj = { 
  getData,
  deleteScheduledMatch,
  updateScheduledMatch,
  createSchedueldMatch,
  setToken,
  reinstateMatch,
  invalidateMatch,
  getMatch,
  createForfeitedMatch,
  deleteForfeitedMatch,
  getDataFromArray
}

export default obj