<template>
  <q-dialog v-model="isOpen">
    <q-card class="user-info-card">
      <q-card-section class="bg-info text-white">
        <div class="row items-center no-wrap">
          <q-avatar size="48px" color="white" text-color="info" class="q-mr-md">
            {{ userInitials }}
          </q-avatar>
          <div>
            <div class="text-h6">{{ user.name }}</div>
            <div class="text-subtitle2">{{ user.email }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
      </q-card-section>
      <q-card-section class="q-pt-lg">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="phone" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Phone</q-item-label>
                  <q-item-label>{{ user.phone }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="business" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Company</q-item-label>
                  <q-item-label>{{ user.company.name }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="language" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Website</q-item-label>
                  <q-item-label>
                    <a :href="websiteUrl" target="_blank" class="text-primary">{{
                      user.website
                    }}</a>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-6">
            <q-card flat bordered class="address-card q-pa-md">
              <div class="text-subtitle1 q-mb-sm">
                <q-icon name="place" color="primary" size="sm" class="q-mr-xs" /> Address
              </div>
              <q-separator class="q-mb-md" />
              <p class="text-body1">
                {{ user.address?.street }}<br />
                {{ user.address?.city }}
              </p>

              <q-btn
                outline
                color="primary"
                icon="map"
                label="View on Map"
                size="sm"
                class="q-mt-sm"
                @click="openMap"
              />
            </q-card>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="bg-grey-1 q-py-md">
        <q-btn
          outline
          label="Edit Profile"
          color="warning"
          icon="edit"
          @click="editUser"
          class="q-mr-sm"
        />
        <q-btn unelevated label="Close" color="primary" @click="isOpen = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, nextTick, defineEmits } from 'vue'

const isOpen = ref(false)
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
const emit = defineEmits(['edit-user'])
const open = (userData) => {
  user.value = userData
  isOpen.value = true
}

const openMap = () => {
  const address = `${user.value.address.street}, ${user.value.address.city}`
  const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`
  window.open(url, '_blank')
}

const editUser = async () => {
  isOpen.value = false
  await nextTick()
  emit('edit-user', user.value)
}

const userInitials = computed(() => {
  if (!user.value?.name) return ''
  return user.value.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const websiteUrl = computed(() => {
  if (!user.value.website) return '#'
  return user.value.website.startsWith('http')
    ? user.value.website
    : `https://${user.value.website}`
})

defineExpose({ open })
</script>

<style lang="scss" scoped>
.user-info-card {
  width: 800px;
  max-width: 90vw;
  border-radius: 8px;

  .address-card,
  .activity-card {
    border-radius: 8px;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    }
  }

  @media (max-width: 599px) {
    width: 100%;
  }
}
</style>
