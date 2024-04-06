<script setup lang="ts">
import { loadRouteLocation } from '#vue-router'
import type { GetProfileByUsername200Response, GetProfileByUsernameRequest } from '~/lib/api/__generated__'
import { apiFetch } from '~/lib/api/apiFetch'
import type { NuxtErrorWithRecord } from '~/lib/types'

const user = useCurrentUser()

const route = useRoute()
const username = route.params.username as string

const { data: authorData, error: authorError, pending: authorPending } = await useLazyAsyncData<GetProfileByUsernameRequest, NuxtErrorWithRecord, GetProfileByUsername200Response>(() => {
  return apiFetch(`/profiles/${username}`)
})

const isMyProfile = computed(() => {
  return user.value && authorData?.value?.profile && user.value.username === authorData.value.profile.username
})

const profileLink = computed(() => `/profile/${username}`)
const profileFavoritesLink = computed(() => `/profile/${username}/favorites`)
</script>

<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div v-if="authorPending">
              Loading profile...
            </div>
            <div v-else-if="authorError">
              An error occurred while loading the profile: {{ authorError.message }}
            </div>
            <template v-else-if="authorData?.profile">
              <img :src="authorData.profile.image" class="user-img" alt="profile avatar">
              <h4>{{ authorData.profile.username }}</h4>
              <p>{{ authorData.profile.bio }}</p>
              <NuxtLink v-if="isMyProfile" class="btn btn-sm btn-outline-secondary action-btn" to="/settings">
                <i class="ion-gear-a" /> Edit Profile Settings
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <NuxtLink class="nav-link" :href="{ path: profileLink, query: {} }" exact-active-class="active">
                  My Articles
                </NuxtLink>
              </li>
              <li class="nav-item">
                <NuxtLink class="nav-link" :href="{ path: profileFavoritesLink, query: {} }" active-class="active">
                  Favorited Articles
                </NuxtLink>
              </li>
            </ul>
          </div>
          <NuxtPage :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>
