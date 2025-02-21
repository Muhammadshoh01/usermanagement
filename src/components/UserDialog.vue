<template>
  <q-dialog v-model="isOpen" persistent :maximized="$q.screen.lt.sm" @hide="onDialogClose">
    <q-card class="user-dialog-card">
      <q-card-section class="bg-primary text-white row items-center justify-between">
        <div class="text-h6">{{ editMode ? 'Edit User' : 'Add New User' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pt-lg">
        <q-form @submit="saveUser" ref="userForm">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="user.name"
                label="Full Name"
                outlined
                :rules="[(val) => !!val || 'Name is required']"
                stack-label
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="primary" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="user.email"
                label="Email Address"
                type="email"
                outlined
                :rules="[
                  (val) => !!val || 'Email is required',
                  (val) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
                    'Please enter a valid email',
                ]"
                stack-label
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="primary" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="user.phone"
                label="Phone Number"
                outlined
                mask="(###) ###-####"
                :rules="[(val) => !!val || 'Phone number is required']"
                stack-label
              >
                <template v-slot:prepend>
                  <q-icon name="phone" color="primary" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="user.company.name" label="Company" outlined stack-label>
                <template v-slot:prepend>
                  <q-icon name="business" color="primary" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input v-model="user.website" label="Website" outlined class="q-mb-md" stack-label>
                <template v-slot:prepend>
                  <q-icon name="language" color="primary" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <div class="text-subtitle1">Address Information</div>
              <q-separator class="q-mb-md" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="user.address.street" label="Street Address" outlined stack-label>
                <template v-slot:prepend>
                  <q-icon name="home" color="primary" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="user.address.city" label="City" outlined stack-label>
                <template v-slot:prepend>
                  <q-icon name="location_city" color="primary" />
                </template>
              </q-input>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right" class="bg-grey-1 q-py-md">
        <q-btn label="Cancel" color="grey" flat @click="isOpen = false" class="q-px-md" />
        <q-btn
          :label="editMode ? 'Update' : 'Save'"
          color="primary"
          unelevated
          @click="saveUser"
          class="q-px-lg"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useUsersStore } from 'src/stores/user-store.js'
import { useQuasar } from 'quasar'

const store = useUsersStore()
const isOpen = ref(false)
const editMode = ref(false)
const userForm = ref(null)
const user = ref({
  name: '',
  email: '',
  phone: '',
  website: '',
  company: {
    name: '',
  },
  address: {
    street: '',
    city: '',
  },
})
const $q = useQuasar()

const open = (existingUser = null) => {
  console.log('existing', existingUser)
  if (existingUser) {
    editMode.value = true
  }
  user.value = existingUser
    ? { ...existingUser }
    : {
        id: null,
        name: '',
        email: '',
        phone: '',
        website: '',
        company: {
          name: '',
        },
        address: {
          street: '',
          city: '',
        },
      }
  isOpen.value = true
}
const onDialogClose = () => {
  editMode.value = false
}

const saveUser = async () => {
  const success = await userForm.value.validate()
  if (success) {
    if (user.value.id) {
      await store.editUser(user.value)
    } else {
      await store.addUser(user.value)
    }
    isOpen.value = false
  } else {
    $q.notify({
      type: 'negative', // 'positive', 'negative', 'warning', 'info'
      message: 'Something went wrong',
      position: 'top-right', // You can change position
      timeout: 3000, // Auto-close after 3s
    })
  }
  editMode.value = false
  // emit('user-saved')
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.user-dialog-card {
  width: 700px;
  max-width: 90vw;
  border-radius: 8px;

  .q-field--outlined .q-field__control {
    border-radius: 8px;
  }

  @media (max-width: 599px) {
    width: 100%;
  }
}
</style>
