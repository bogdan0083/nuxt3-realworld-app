<script setup lang="ts">
const user = useAuthUser()
</script>

<template>
  <UiHeader :user="user" />
  <div>
    <slot />
  </div>
  <UiFooter />
</template>
