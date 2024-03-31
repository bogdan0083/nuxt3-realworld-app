<script setup lang="ts">
const user = useCurrentUser()
</script>

<template>
  <UiHeader :user="user" />
  <div>
    <slot />
  </div>
  <UiFooter />
</template>
