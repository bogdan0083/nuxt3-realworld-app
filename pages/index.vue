<script setup lang="ts">
import { ArticlesApi, type GetArticlesRequest } from '~/lib/api/__generated__'

const ITEMS_PER_PAGE = 10
const router = useRouter()
const route = useRoute()
const routeQuery = computed(() => route.query)

const computedTag = computed(() => route.query.tag || 'none') as ComputedRef<string>

const currentPage = computed(() => route.query.page ?? 1)

const offset = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)

const { data, pending, error } = await useArticlesQuery({})
const user = useCurrentUser()

// eslint-disable-next-line unused-imports/no-unused-vars
function onFavoriteClick(slug: string) {
  if (!user)
    router.push('/register')
}

// generate pages array based on total pages and items per page
const pages = computed(() => Array.from({ length: Math.ceil((data?.value?.articlesCount || 0) / ITEMS_PER_PAGE) }, (_, i) => i + 1))
</script>

<template>
  <div class="home-page">
    <UiBanner />
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link" href="#" :class="{ active: !route.query.tag }" @click.prevent="$router.replace({ query: { ...route.query, tag: undefined } })">Global Feed</a>
              </li>
              <li v-if="route.query.tag" class="nav-item">
                <a class="nav-link active">{{ `#${route.query.tag}` }}</a>
              </li>
            </ul>
          </div>
          <UiArticlePreview
            v-for="article in data.articles"
            v-if="!pending && data?.articles" :key="article.slug" :author="article.author"
            :title="article.title" :tag-list="article.tagList" :description="article.description"
            :created-at="article.createdAt" :slug="article.slug" :favorited="article.favorited"
            :favorites-count="article.favoritesCount" @favorite-click="onFavoriteClick"
          />
          <nav v-if="!pending">
            <ul class="pagination">
              <li v-for="p in pages" :key="p" class="page-item" :class="{ active: currentPage === p.toString() }">
                <a class="page-link" href="#" @click.prevent="$router.replace({ query: { ...route.query, page: p } })">{{ p }}</a>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3" />
      </div>
    </div>
    <div v-if="error">
      {{ error.message }}
    </div>
  </div>
</template>
