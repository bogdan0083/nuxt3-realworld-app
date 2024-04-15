<script setup lang="ts">
import type { Article } from '~/lib/api/__generated__'
import { ARTICLES_PER_PAGE } from '~/lib/constants'

const props = defineProps<{
  articles: Article[]
  articlesCount: number
}>()

const router = useRouter()
const route = useRoute()
const user = useAuthUser()
const currentPage = computed(() => Number.parseInt(route.query.page as string) || 1)
const favoritedArticle = ref<Article>()
const { execute: favoriteArticle } = useFavoriteArticleApi({ article: favoritedArticle as Ref<Article> })

async function onFavoriteClick(slug: string) {
  if (!user.value) {
    router.push('/login')
  }
  else {
    const article = props.articles.find(a => a.slug === slug) as Article
    favoritedArticle.value = article
    await favoriteArticle()
  }
}

// generate pages array based on total pages and items per page
const pages = computed(() => Array.from({ length: Math.ceil((props.articlesCount || 0) / ARTICLES_PER_PAGE) }, (_, i) => i + 1))
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
