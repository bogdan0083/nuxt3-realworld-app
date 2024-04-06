<script setup lang="ts">
import type { User } from '~/lib/api/__generated__'

interface Props {
  user?: User
}

defineProps<Props>()
const activeClass = 'active'
</script>

<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <NuxtLink class="navbar-brand" to="/">
        conduit
      </NuxtLink>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <NuxtLink to="/" class="nav-link" :active-class="activeClass">
            Home
          </NuxtLink>
        </li>
        <li v-if="user" class="nav-item">
          <NuxtLink class="nav-link" to="/editor" :active-class="activeClass">
            <i class="ion-compose" />&nbsp;New Article
          </NuxtLink>
        </li>
        <li v-if="!user" class="nav-item">
          <NuxtLink to="/login" class="nav-link" :active-class="activeClass">
            Sign in
          </NuxtLink>
        </li>
        <li v-if="!user" class="nav-item" :active-class="activeClass">
          <NuxtLink to="/register" class="nav-link">
            Sign up
          </NuxtLink>
        </li>
        <li v-if="user" class="nav-item" :active-class="activeClass">
          <NuxtLink class="nav-link" to="/settings">
            <i class="ion-gear-a" />&nbsp;Settings
          </NuxtLink>
        </li>
        <li v-if="user" class="nav-item">
          <NuxtLink class="nav-link" :to="`/profile/${user.username}`">
            <img
              :src="user.image"
              class="user-pic" :alt="user.username"
            >{{ user.username }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
