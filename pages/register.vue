<script setup lang="ts">
import type { CreateUserRequest, Login200Response, User } from '~/lib/api/__generated__'
import { apiFetch } from '~/lib/api/apiFetch'
import type { NuxtErrorWithRecord } from '~/lib/types'

definePageMeta({
  middleware: 'auth',
})

const userCookie = useCookie<User>('user', { path: '/' })
const tokenCookie = useCookie('token', { path: '/' })
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')

const user = computed(() => ({
  username: username.value,
  email: email.value,
  password: password.value,
}))

const { data, error, execute, status } = await useAsyncData<CreateUserRequest, NuxtErrorWithRecord, Login200Response>('create-user', () => {
  return apiFetch('/users', {
    method: 'POST',
    body: { user: user.value },
  })
}, { immediate: false })

const isLoading = computed(() => status.value === 'pending')

watchEffect(() => {
  if (data.value) {
    userCookie.value = data.value.user
    tokenCookie.value = data.value.user?.token
    refreshCookie('user')
    refreshCookie('token')
    nextTick().then(() => {
      router.push('/')
    })
  }
})
async function onSubmit(e: Event) {
  e.preventDefault()
  await execute()
}
</script>

<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">
            Sign up
          </h1>
          <p class="text-xs-center">
            <NuxtLink to="/login">
              have an account?
            </NuxtLink>
          </p>
          <ul v-if="error" class="error-messages">
            <li v-for="(v, key) in error.data?.errors" :key="key">
              {{ key }} {{ v.join(', ') }}
            </li>
          </ul>
          <form autocomplete="on" @submit="onSubmit">
            <fieldset class="form-group">
              <input
                v-model="username" name="username" class="form-control form-control-lg" type="text"
                placeholder="Username"
              >
            </fieldset>
            <fieldset class="form-group">
              <input v-model="email" name="email" class="form-control form-control-lg" type="email" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="password" name="password" class="form-control form-control-lg" type="password"
                placeholder="Password"
              >
            </fieldset><button type="submit" class="btn btn-lg btn-primary pull-xs-right" :disabled="isLoading">
              {{ isLoading ? 'loading...' : 'sign up' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
