import axios from 'axios'
const baseUrl = '/api/fbhl'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getData = async (url) => {
  const res = await axios.get(`${baseUrl}${url}`)
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

  const res = await axios.post(`${baseUrl}/invalidMatches/`, { matchId }, config)
  return res.status
}

const getMatch = async (matchId) => {
  const res = await axios.get(`${baseUrl}/matchHistory/${matchId}`)
  return res.data
}


const obj = { getData, deleteScheduledMatch, updateScheduledMatch, createSchedueldMatch, setToken, reinstateMatch, invalidateMatch, getMatch }

export default obj