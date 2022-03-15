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

  console.log(token)

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

const obj = { getData, deleteScheduledMatch, updateScheduledMatch, createSchedueldMatch, setToken }

export default obj