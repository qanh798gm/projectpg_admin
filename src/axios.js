import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3001'
  // baseURL: 'projectpg-backend.herokuapp.com/'
})

export default instance