<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-pa-md bg-grey-1">
        <div class="row items-center justify-between">
          <div class="text-h4 q-mb-md text-weight-bold text-primary">User Management</div>
          <q-btn
            label="Add New User"
            color="primary"
            @click="openUserDialog()"
            class="q-px-md"
            icon="add"
            unelevated
            rounded
          />
        </div>

        <q-responsive class="full-width">
          <q-card flat bordered>
            <q-table
              :rows="users"
              :columns="columns"
              row-key="id"
              :loading="loading"
              color="primary"
              title="Users"
              class="user-table"
              :filter="filter"
              :pagination="{ rowsPerPage: 10 }"
            >
              <template v-slot:top>
                <div class="row full-width items-center">
                  <div class="text-h6 text-weight-medium">Users</div>
                  <q-space />
                  <q-input
                    v-model="filter"
                    dense
                    placeholder="Search"
                    outlined
                    class="q-ml-md"
                    clearable
                  >
                    <template v-slot:append>
                      <q-icon name="search" color="primary" />
                    </template>
                  </q-input>
                </div>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-sm">
                  <q-btn
                    round
                    flat
                    size="sm"
                    color="info"
                    icon="visibility"
                    @click="showUserInfo(props.row)"
                  >
                    <q-tooltip>View Details</q-tooltip>
                  </q-btn>
                  <q-btn
                    round
                    flat
                    size="sm"
                    color="warning"
                    icon="edit"
                    @click="openUserDialog(props.row)"
                  >
                    <q-tooltip>Edit User</q-tooltip>
                  </q-btn>
                  <q-btn
                    round
                    flat
                    size="sm"
                    color="negative"
                    icon="delete"
                    @click="confirmDelete(props.row)"
                  >
                    <q-tooltip>Delete User</q-tooltip>
                  </q-btn>
                </q-td>
              </template>

              <!-- <template v-slot:item="props">
                <q-card class="q-mb-md">
                  <q-card-section>
                    <div class="text-h6">{{ props.row.name }}</div>
                    <div class="text-subtitle2">{{ props.row.email }}</div>
                    <div class="text-subtitle2">{{ props.row.phone }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-actions align="right">
                    <q-btn
                      round
                      flat
                      size="sm"
                      color="info"
                      icon="visibility"
                      @click="showUserInfo(props.row)"
                    >
                      <q-tooltip>View Details</q-tooltip>
                    </q-btn>
                    <q-btn
                      round
                      flat
                      size="sm"
                      color="warning"
                      icon="edit"
                      @click="openUserDialog(props.row)"
                    >
                      <q-tooltip>Edit User</q-tooltip>
                    </q-btn>
                    <q-btn
                      round
                      flat
                      size="sm"
                      color="negative"
                      icon="delete"
                      @click="confirmDelete(props.row)"
                    >
                      <q-tooltip>Delete User</q-tooltip>
                    </q-btn>
                  </q-card-actions>
                </q-card>
              </template> -->

              <template v-slot:no-data>
                <div class="full-width row flex-center q-pa-md text-grey">No users found</div>
              </template>

              <template v-slot:loading>
                <q-inner-loading showing color="primary">
                  <q-spinner size="50px" color="primary" />
                </q-inner-loading>
              </template>
            </q-table>
          </q-card>
        </q-responsive>

        <UserDialog ref="userDialog" />
        <UserInfoDialog ref="userInfoDialog" @edit-user="openUserDialog" />

        <q-dialog v-model="confirmDeleteDialog" persistent>
          <q-card class="confirm-delete-card">
            <q-card-section class="row items-center justify-center">
              <q-avatar icon="warning" color="negative" text-color="white" />
              <span class="q-ml-sm text-h6">Delete User</span>
            </q-card-section>
            <q-card-section align="center">
              Are you sure you want to delete this user? This action cannot be undone.
            </q-card-section>
            <q-card-actions align="center">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                flat
                label="Delete"
                color="negative"
                @click="deleteUser(selectedUserId)"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUsersStore } from 'src/stores/user-store.js'
import UserDialog from './UserDialog.vue'
import UserInfoDialog from './UserInfoDialog.vue'

const store = useUsersStore()
const users = computed(() => {
  return store.getUsers
})
const loading = store.loading
const userDialog = ref(null)
const filter = ref('')
const userInfoDialog = ref(null)

const columns = [
  { name: 'name', label: 'Name', align: 'left', field: 'name' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  { name: 'phone', label: 'Phone', align: 'left', field: 'phone', responsive: true },
  { name: 'actions', label: 'Actions', align: 'center' },
]

const selectedUserId = ref(null)
const confirmDeleteDialog = ref(false)
const confirmDelete = (row) => {
  selectedUserId.value = row.id
  confirmDeleteDialog.value = true
}

const fetchUsers = async () => await store.fetchUsers()
const openUserDialog = (user = null) => userDialog.value?.open(user)
const showUserInfo = (user) => userInfoDialog.value.open(user)
const deleteUser = async (id) => await store.deleteUser(id)

onMounted(fetchUsers)
</script>

<style scoped lang="scss">
.user-table {
  .q-table__card {
    box-shadow: none;
    border-radius: 8px;
  }

  thead tr {
    th {
      font-weight: bold;
      background-color: #f5f8fa;
    }
  }

  tbody tr {
    transition: background-color 0.3s;
    &:hover {
      background-color: #f0f9ff !important;
    }
  }
}

.confirm-delete-card {
  width: 400px;
  max-width: 90vw;
  border-radius: 8px;
}
</style>
