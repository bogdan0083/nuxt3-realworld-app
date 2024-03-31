<script setup lang="ts">
import type { User } from '~/lib/api/__generated__'

interface Props {
  user?: User
}

defineProps<Props>()
</script>

<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <a class="navbar-brand" href="index.html">conduit</a>
      <ul class="nav navbar-nav pull-xs-right">
        <li v-if="!user" class="nav-item active">
          <a class="nav-link" href="index.html">Home</a>
        </li>
        <li v-if="user" class="nav-item">
          <a class="nav-link" href="editor.html">
            <i class="ion-compose" />&nbsp;New Post
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="auth.html">Sign up</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="settings.html">Settings</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
