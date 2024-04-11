<script setup lang="ts">
import type { CreateUserOperationRequest, Login200Response } from '~/lib/api/__generated__'
import { apiFetch } from '~/lib/api/apiFetch'

definePageMeta({
  middleware: 'auth',
})

const user = useCurrentUser()
const isSubmitting = ref(false)
const submitError = ref(null) as Ref<Error | null>
const logout = useLogOut()

const { data, error, pending } = await useLazyAsyncData<CreateUserOperationRequest, Error, Login200Response & { user: { password?: string } }>('get-settings', async () => {
  return apiFetch(`/user`)
})

async function onSubmit() {
  try {
    isSubmitting.value = true
    await apiFetch(`/profiles/${user.value?.username}`, {
      method: 'PUT',
      body: data.value,
    })
  }
  catch (e) {
    submitError.value = e as Error
    console.error('error', e)
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">
            Your Settings
          </h1>
          <div v-if="pending" class="text-xs-center">
            Loading...
          </div>
          <div v-else-if="error" class="text-xs-center">
            An error occurred: {{ error.message }}
          </div>
          <form v-else-if="data?.user" data-bitwarden-watching="1" @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="data.user.image" class="form-control" type="text"
                  placeholder="URL of profile picture"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="data.user.username" class="form-control form-control-lg" type="text"
                  placeholder="Your Name"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="data.user.bio" class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                />
              </fieldset>
              <fieldset class="form-group">
                <input v-model="data.user.email" class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="data.user.password" class="form-control form-control-lg" type="password" placeholder="Password">
              </fieldset><button type="submit" class="btn btn-lg btn-primary pull-xs-right" :disabled="isSubmitting">
                {{ isSubmitting ? 'Updating...' : 'Update Settings' }}
              </button>
            </fieldset>
          </form>
          <hr><button class="btn btn-outline-danger" @click.prevent="logout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
