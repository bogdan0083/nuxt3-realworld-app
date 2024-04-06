<script setup lang="ts">
import { ARTICLES_PER_PAGE } from '~/lib/constants'

definePageMeta({
  alias: ['/signin/callback', '/feed'],
})

const router = useRouter()
const route = useRoute()
const isFeed = computed(() => route.path === '/feed')
const user = useCurrentUser()

if (import.meta.client && route.path === '/signin/callback')
  router.push('/')

if (isFeed.value && !user.value)
  navigateTo('/')

const currentPage = computed(() => Number.parseInt(route.query.page as string) || 1)

const opts = computed(() => ({
  tag: route.query.tag as string,
  offset: (currentPage.value - 1) * ARTICLES_PER_PAGE,
  feed: isFeed.value,
}))

const { data, pending, error } = await useArticlesQuery(opts)
const { data: tagsData } = await useTagsQuery()
</script>

<template>
  <div class="home-page">
    <UiBanner v-if="!user" />
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <a
                  class="nav-link" href="/feed" :class="{ active: isFeed }"
                  @click.prevent="$router.replace({ path: '/feed', force: true, query: { ...route.query, tag: undefined } })"
                >
                  Your feed
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link" href="#" :class="{ active: !route.query.tag && !isFeed }"
                  @click.prevent="$router.replace({ path: '/', force: true, query: { ...route.query, tag: undefined } })"
                >Global
                  Feed</a>
              </li>
              <li v-if="route.query.tag" class="nav-item">
                <a class="nav-link active">{{ `#${route.query.tag}` }}</a>
              </li>
            </ul>
          </div>
          <div v-if="pending">
            Loading articles...
          </div>
          <div v-else-if="data?.articles && data?.articles.length > 0">
            <UiArticlePreviewList :articles="data.articles" :articles-count="data.articlesCount" />
          </div>
          <div v-else-if="data?.articles && data?.articles.length === 0">
            No articles are here... yet.
          </div>
          <div v-else-if="error">
            An error occurred while loading the articles: {{ error.message }}
          </div>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div v-if="tagsData?.tags" class="tag-list">
              <a
                v-for="tag in tagsData.tags" :key="tag" href="#" class="tag-pill tag-default"
                @click="$router.replace({ query: { page: 1, tag } })"
              >{{ tag }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="error">
      {{ error.message }}
    </div>
  </div>
</template>
