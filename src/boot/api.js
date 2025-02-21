import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Change this to your actual API URL
  // headers: {
  //   'Content-type': 'application/json; charset=UTF-8',
  // },
})

export default boot(({ app }) => {
  app.provide('api', api) // Provide the API instance
})

export { api }
