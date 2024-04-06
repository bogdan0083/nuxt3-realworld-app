<script setup lang="ts">
import type { Article } from '~/lib/api/__generated__'
import { apiFetch } from '~/lib/api/apiFetch'
import { ARTICLES_PER_PAGE } from '~/lib/constants'

const props = defineProps<{
  articles: Article[]
  articlesCount: number
}>()

const ITEMS_PER_PAGE = 10
const router = useRouter()
const route = useRoute()
const user = useCurrentUser()
const currentPage = computed(() => Number.parseInt(route.query.page as string) || 1)
// @TODO think how to properly abstract this
async function onFavoriteClick(slug: string) {
  if (!user.value) {
    router.push('/login')
  }
  else {
    const article = props.articles.find(a => a.slug === slug)

    if (article) {
      const originalFavorited = article.favorited
      article.favorited = !article.favorited
      article.favoritesCount += article.favorited ? 1 : -1
      try {
        await apiFetch(`/articles/${slug}/favorite`, {
          method: originalFavorited ? 'DELETE' : 'POST',
          body: { slug: article.slug },
        })
      }
      catch (e) {
        console.error('error', e)
        article.favorited = !article.favorited
        article.favoritesCount += article.favorited ? 1 : -1
      }
    }
  }
}

// generate pages array based on total pages and items per page
const pages = computed(() => Array.from({ length: Math.ceil((props.articlesCount || 0) / ITEMS_PER_PAGE) }, (_, i) => i + 1))
</script>

<template>
  <UiArticlePreview
    v-for="article in articles" :key="article.slug"
    :author="article.author" :title="article.title" :tag-list="article.tagList"
    :description="article.description" :created-at="article.createdAt as unknown as string" :slug="article.slug"
    :favorited="article.favorited" :favorites-count="article.favoritesCount"
    @favorite-click="onFavoriteClick"
  />
  <nav v-if="pages.length > 1">
    <ul class="pagination">
      <li v-for="p in pages" :key="p" class="page-item" :class="{ active: currentPage === p }">
        <a
          class="page-link" href="#"
          @click.prevent="$router.replace({ query: { ...route.query, page: p } })"
        >{{ p }}</a>
      </li>
    </ul>
  </nav>
</template>
