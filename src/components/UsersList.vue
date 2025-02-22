<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-pa-md bg-grey-1">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h4 text-md-h6 text-sm-body1 text-weight-bold text-primary main-header">
            User Management
          </div>
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

        <div class="table-wrapper">
          <q-card flat bordered>
            <q-table
              :rows="users"
              :columns="columns"
              row-key="id"
              :loading="loading"
              color="primary"
              title="Users"
              class="user-table sticky-header"
              :filter="filter"
              :pagination="{ rowsPerPage: 10 }"
              :grid="$q.screen.lt.md"
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

              <template v-slot:item="props">
                <div class="q-pa-md col-xs-12 col-sm-6 col-md-4">
                  <q-card flat bordered class="user-grid-card">
                    <q-card-section>
                      <div class="row items-center no-wrap">
                        <q-avatar color="primary" text-color="white" class="q-mr-sm">
                          {{
                            props.row.name
                              .split(' ')
                              .map((part) => part[0])
                              .join('')
                              .toUpperCase()
                              .substring(0, 2)
                          }}
                        </q-avatar>
                        <div class="ellipsis">
                          <div class="text-subtitle1 text-weight-medium">{{ props.row.name }}</div>
                          <div class="text-caption">{{ props.row.email }}</div>
                        </div>
                      </div>
                    </q-card-section>

                    <q-separator />

                    <q-list dense>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="phone" color="primary" size="xs" />
                        </q-item-section>
                        <q-item-section>{{ props.row.phone }}</q-item-section>
                      </q-item>
                      <q-item v-if="props.row.company && props.row.company.name">
                        <q-item-section avatar>
                          <q-icon name="business" color="primary" size="xs" />
                        </q-item-section>
                        <q-item-section>{{ props.row.company.name }}</q-item-section>
                      </q-item>
                    </q-list>

                    <q-card-actions align="right">
                      <q-btn
                        flat
                        round
                        color="info"
                        icon="visibility"
                        size="sm"
                        @click="showUserInfo(props.row)"
                      >
                        <q-tooltip>View Details</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        color="warning"
                        icon="edit"
                        size="sm"
                        @click="openUserDialog(props.row)"
                      >
                        <q-tooltip>Edit User</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        size="sm"
                        @click="confirmDelete(props.row)"
                      >
                        <q-tooltip>Delete User</q-tooltip>
                      </q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
              </template>

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
        </div>

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
const selectedUserId = ref(null)
const confirmDeleteDialog = ref(false)

const columns = [
  { name: 'name', label: 'Name', align: 'left', field: 'name' },
  { name: 'email', label: 'Email', align: 'left', field: 'email' },
  { name: 'phone', label: 'Phone', align: 'left', field: 'phone', responsive: true },
  { name: 'actions', label: 'Actions', align: 'center' },
]

const confirmDelete = (row) => {
  selectedUserId.value = row.id
  confirmDeleteDialog.value = true
}

const fetchUsers = async () => await store.fetchUsers()
const openUserDialog = (user = null) => userDialog.value?.open(user)
const showUserInfo = (user) => userInfoDialog.value.open(user)
const deleteUser = async (id) => await store.deleteUser(id)

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped lang="scss">
.responsive-table-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.user-table {
  width: 100%;

  .q-table__top,
  .q-table__bottom {
    padding: 0;
  }

  thead tr {
    th {
      position: sticky;
      top: 0;
      z-index: 1;
      font-weight: bold;
      background-color: #f5f8fa;
      padding: 12px 16px;
    }
  }

  tbody tr {
    transition: background-color 0.3s;
    &:hover {
      background-color: #f0f9ff !important;
    }

    td {
      padding: 12px 16px;

      &.action-buttons {
        white-space: nowrap;
      }
    }
  }
  &.q-table--grid {
    .q-table__grid-content {
      min-height: 200px;
    }
  }
}

.user-grid-card {
  height: 100%;
  transition:
    box-shadow 0.2s,
    transform 0.2s;

  &:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .q-card__actions {
    padding: 8px;
    background-color: #f5f8fa;
  }
}

.sticky-header {
  max-height: calc(100vh - 100px);
}

.action-buttons {
  white-space: nowrap;
  min-width: 120px;
}

.confirm-delete-card {
  width: 400px;
  max-width: 90vw;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .search-input {
    width: 140px;
  }
  .main-header {
    font-size: 28px;
    width: min-content;
  }
}
</style>
