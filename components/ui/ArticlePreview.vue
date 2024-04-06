<script setup lang="ts">
import type { Article, Profile } from '~/lib/api/__generated__'

interface Props extends Omit<Article, 'body' | 'updatedAt' | 'createdAt'> {
  createdAt: string
}
const props = defineProps<Props>()

defineEmits(['favoriteClick'])
const authorLink = computed(() => `/profile/${props.author.username}`)
const favoritesCountClass = computed(() => ({
  'btn btn-sm pull-xs-right': true,
  'btn-primary': props.favorited,
  'btn-outline-primary': !props.favorited,
}))

const formattedDate = computed(() => {
  const date = new Date(props.createdAt)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})
</script>

<template>
  <div class="article-preview">
    <div class="article-meta">
      <NuxtLink :to="authorLink" as="a">
        <img :src="author.image" :alt="author.username" decoding="async">
      </NuxtLink>
      <div class="info">
        <NuxtLink :to="authorLink">
          {{ author.username }}
        </NuxtLink>
        <span class="date">{{ formattedDate }}</span>
      </div>
      <button :class="favoritesCountClass" @click.prevent="$emit('favoriteClick', slug)">
        <i class="ion-heart" /> {{ favoritesCount }}
      </button>
    </div>
    <NuxtLink :to="`/article/${slug}`" class="preview-link">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <span>Read more...</span>
      <ul v-if="tagList && tagList.length > 0" class="tag-list">
        <li v-for="tag in tagList" :key="tag" class="tag-default tag-pill tag-outline">
          {{ tag }}
        </li>
      </ul>
    </NuxtLink>
  </div>
</template>
