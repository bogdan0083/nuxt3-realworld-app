<script setup lang="ts">
import type { User } from '~/lib/api/__generated__'
import { apiFetch } from '~/lib/api/apiFetch'
import { ARTICLES_PER_PAGE } from '~/lib/constants'

defineProps<{ user?: User }>()
const route = useRoute()
const currentPage = computed(() => Number.parseInt(route.query?.page as string) || 1)
const offset = computed(() => (currentPage.value - 1) * ARTICLES_PER_PAGE)
const favorited = computed(() => route.params.username as string)

const { data, pending, error } = await useGetArticlesApi({ offset, favorited })
</script>

<template>
  <div v-if="pending">
    Loading articles...
  </div>
  <div v-else-if="data?.articles && data?.articles.length > 0">
    <UiArticlePreviewList :articles="data.articles" :articles-count="data.articlesCount" />
  </div>
  <div v-else-if="data?.articles && data?.articles.length === 0 && !pending">
    No articles are here... yet.
  </div>
  <div v-else-if="error">
    An error occurred while loading the articles: {{ error.message }}
  </div>
</template>
