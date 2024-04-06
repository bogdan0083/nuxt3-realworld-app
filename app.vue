<script setup>
import { pageTitle } from '~/lib/utils'

useHead({
  title: pageTitle('Home'),
  link: [
    // add favicon
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      href: '//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '//demo.productionready.io/main.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
