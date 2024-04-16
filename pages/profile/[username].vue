<script setup lang="ts">
import type { Profile } from '~/lib/api/__generated__'

const user = useAuthUser()

const route = useRoute()
const username = route.params.username as string

const { data: userData, error: userError, pending: userPending } = await useGetUserApi({ username })

const { execute: followOrUnfollowUser } = await useFollowOrUnfollowUserApi({ profile: () => userData.value?.profile as Profile })
const isMyProfile = computed(() => {
  return user.value && userData?.value?.profile && user.value.username === userData.value.profile.username
})

const isFollowing = computed(() => {
  return user.value && userData?.value?.profile && userData?.value?.profile.following
})

const profileLink = computed(() => `/profile/${username}`)
const profileFavoritesLink = computed(() => `/profile/${username}/favorites`)

const followButtonClasses = computed(() => ({
  'btn btn-sm action-btn': true,
  'btn-outline-secondary': !isFollowing.value,
  'btn-secondary': isFollowing.value,
}))

// @TODO: abstract this into a reusable composable
async function onFollowClick() {
  if (!user.value) {
    await navigateTo('/login')
    return
  }
  if (userData.value?.profile)
    await followOrUnfollowUser()
}
</script>

<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div v-if="userPending">
              Loading profile...
            </div>
            <div v-else-if="userError">
              An error occurred while loading the profile: {{ userError.message }}
            </div>
            <template v-else-if="userData?.profile">
              <img :src="userData.profile.image" class="user-img" alt="profile avatar">
              <h4>{{ userData.profile.username }}</h4>
              <p>{{ userData.profile.bio }}</p>
              <NuxtLink v-if="isMyProfile" class="btn btn-sm btn-outline-secondary action-btn" to="/settings">
                <i class="ion-gear-a" /> Edit Profile Settings
              </NuxtLink>
              <button v-if="!isMyProfile" :class="followButtonClasses" @click.prevent="onFollowClick">
                <i class="ion-plus-round" />&nbsp; {{ isFollowing ? 'Unfollow' : 'Follow' }} {{ userData.profile.username }}
              </button>
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
