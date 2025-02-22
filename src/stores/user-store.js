import { defineStore } from 'pinia'
import { api } from 'src/boot/api'

export const useUsersStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
  }),
  getters: {
    getUsers() {
      return this.users
    },
  },
  actions: {
    async fetchUsers() {
      this.loading = true
      const response = await api.get(`/`)
      this.users = response.data
      this.loading = false
    },
    async addUser(user) {
      const response = await api.post('/', user)
      console.log(response)
      this.users.push(response.data)
    },
    async editUser(editedUser) {
      await api.put(`/${editedUser.id}`, editedUser)
      const index = this.users.findIndex((user) => user.id == editedUser.id)
      if (index !== -1) {
        this.users[index] = editedUser
      }
    },
    async deleteUser(userId) {
      await api.delete(`/${userId}`)
      this.users = this.users.filter((user) => user.id !== userId)
    },
  },
})
