<script setup lang="ts">
import type { User } from '~/lib/api/__generated__'

definePageMeta({
  middleware: 'auth',
})

const userCookie = useCookie<User>('user', { path: '/' })
const tokenCookie = useCookie<string>('token', { path: '/' })

const email = ref('')
const password = ref('')

const user = computed(() => ({
  email: email.value,
  password: password.value,
}))

const { data, error, execute: loginUser, status } = await useLoginUserApi({
  user,
})

const isLoading = computed(() => status.value === 'pending')

watchEffect(() => {
  if (data.value) {
    userCookie.value = data.value.user
    tokenCookie.value = data.value.user?.token
    refreshCookie('user')
    refreshCookie('token')
    nextTick().then(async () => {
      await navigateTo('/feed')
    })
  }
})
async function onSubmit(e: Event) {
  e.preventDefault()
  await loginUser()
}
</script>

<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">
            Sign in
          </h1>
          <p class="text-xs-center">
            <NuxtLink to="/register">
              Need an account?
            </NuxtLink>
          </p>
          <ul v-if="error" class="error-messages">
            <li v-for="(v, key) in error.data?.errors" :key="key">
              {{ key }} {{ v.join(', ') }}
            </li>
          </ul>
          <form autocomplete="on" @submit="onSubmit">
            <fieldset class="form-group">
              <input v-model="email" name="email" class="form-control form-control-lg" type="email" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="password" name="password" class="form-control form-control-lg" type="password"
                placeholder="Password"
              >
            </fieldset><button type="submit" class="btn btn-lg btn-primary pull-xs-right" :disabled="isLoading">
              {{ isLoading ? 'Loading...' : 'Sign in' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
