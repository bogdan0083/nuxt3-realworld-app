<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import type { Article, Profile } from '~/lib/api/__generated__'

const router = useRouter()
const route = useRoute()
const slug = route.params.slug as string
const user = useAuthUser()
const comment = ref('')

const { data: articleData, error: articleError, pending: articlePending } = await useArticleApi({ slug })
const { data: commentsData, error: commentsError, pending: commentsPending } = await useArticleCommentsApi({ slug })
const computedComments = computed(() => commentsData.value?.comments)
const { execute: createComment, status: createCommentStatus } = await useCreateArticleCommentApi({ articleSlug: slug, commentBody: comment, comments: computedComments })

const { execute: followOrUnfollowUser } = await useFollowOrUnfollowUserApi({ profile: () => articleData.value?.article.author as Profile })

const commentIdToDelete = ref<number | undefined>()
const { execute: deleteComment, error: deleteCommentError } = await useDeleteArticleCommentApi({
  articleSlug: slug,
  id: (commentIdToDelete as Ref<number>),
  comments: computedComments,
})

const { error: favoriteArticleError, execute: favoriteArticle } = await useFavoriteArticleApi({ article: () => articleData.value?.article as Article })
const { status: deleteArticleStatus, execute: deleteArticle, error: deleteArticleError } = await useDeleteArticleApi({ slug })

const isMyArticle = computed(() => user.value?.username === articleData.value?.article.author.username)

const formattedDate = computed(() => {
  if (articleData.value)
    return formatDate(new Date(articleData?.value.article.createdAt), 'MMMM D, YYYY', { locales: 'en-US' })
  else
    return undefined
})

const authorLink = computed(() => {
  if (articleData.value)
    return `/profile/${articleData.value.article.author.username}`
  else
    return undefined
})

const favoriteButtonClasses = computed(() => ({
  'btn btn-sm': true,
  'btn-outline-primary': !articleData.value?.article.favorited,
  'btn-primary': articleData.value?.article.favorited,
}))

const followButtonClasses = computed(() => ({
  'btn btn-sm action-btn': true,
  'btn-outline-secondary': !articleData.value?.article.author.following,
  'btn-secondary': articleData.value?.article.author.following,
}))

watchEffect(() => {
  if (favoriteArticleError.value)
    console.error('error', favoriteArticleError.value)
  if (deleteCommentError.value)
    console.error('error', deleteCommentError.value)
})

async function onFollowClick() {
  if (articleData.value)
    await followOrUnfollowUser()
}
async function onFavoriteClick() {
  if (!user.value)
    router.push('/login')
  else
    await favoriteArticle()
}

async function onCommentSubmit() {
  if (articleData.value)
    await createComment()
}

async function onDeleteComment(commentId: number) {
  if (articleData.value) {
    commentIdToDelete.value = commentId
    await deleteComment()
  }
}

async function onDeleteArticle() {
  if (articleData.value)
    await deleteArticle()
}
</script>

<template>
  <div class="article-page">
    <div class="banner">
      <div v-if="articlePending" class="container">
        Loading article...
      </div>
      <div v-else-if="articleError" class="container">
        An error occurred while loading the article: {{ articleError.message }}
      </div>
      <div v-else-if="articleData?.article" class="container">
        <h1>{{ articleData.article.title }}</h1>
        <div class="article-meta">
          <NuxtLink :to="authorLink">
            <img :src="articleData.article.author.image" alt="author avatar">
          </NuxtLink>
          <div class="info">
            <NuxtLink class="author" :to="authorLink">
              {{ articleData.article.author.username }}
            </NuxtLink><span class="date">{{ formattedDate }}</span>
          </div>
          <template v-if="!isMyArticle">
            <button v-if="!isMyArticle" :class="followButtonClasses" @click.prevent="onFollowClick">
              <i class="ion-plus-round" />&nbsp; {{ articleData.article.author.following ? 'Unfollow' : 'Follow' }}
              {{ articleData.article.author.username }}
            </button>&nbsp;
            <button :class="favoriteButtonClasses" @click.prevent="onFavoriteClick">
              <i class="ion-heart" /> {{ articleData.article.favorited ? 'Unfavorite' : 'Favorite' }} Article <span
                class="counter"
              >({{ articleData.article.favoritesCount }})</span>
            </button>
          </template>
          <template v-else>
            <NuxtLink class="btn btn-outline-secondary btn-sm" :to="`/editor/${articleData.article.slug}`">
              <i class="ion-edit" /> Edit Article
            </NuxtLink>
            <button class="btn btn-outline-danger btn-sm" :disabled="deleteArticleStatus === 'pending'" @click.prevent="onDeleteArticle">
              <i class="ion-trash-a" /> {{ deleteArticleStatus === 'pending' ? 'Deleting...' : 'Delete Article' }}
            </button>
            <div v-if="deleteArticleError" class="error-messages">
              <ul>
                <li>{{ deleteArticleError.message }}</li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="container page">
      <div v-if="articleData?.article" class="row article-content">
        <div class="col-xs-12">
          <p>{{ articleData?.article.description }}</p>
          <div>
            <p>{{ articleData?.article.body }}</p>
          </div>
          <ul v-if="articleData?.article.tagList" class="tag-list">
            <li v-for="tag in articleData.article.tagList" :key="tag" class="tag-default tag-pill tag-outline">
              {{ tag }}
            </li>
          </ul>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <p v-if="!user">
            <NuxtLink to="/login">
              Sign in
            </NuxtLink>&nbsp; or &nbsp;<NuxtLink to="/register">
              Sign up
            </NuxtLink>&nbsp; to add comments
            on this article.
          </p>
          <form v-if="user && articleData?.article" class="card comment-form" @submit.prevent="onCommentSubmit">
            <div class="card-block">
              <textarea v-model="comment" name="comment" class="form-control" placeholder="Write a comment..." rows="3" />
            </div>
            <div class="card-footer">
              <img
                :src="articleData?.article.author.image" class="comment-author-img"
                :alt="`${articleData?.article.author.username} avatar`"
              ><button
                type="submit"
                class="btn btn-sm btn-primary" :disabled="createCommentStatus === 'pending'"
              >
                {{ createCommentStatus === 'pending' ? 'Posting...' : 'Post Comment' }}
              </button>
            </div>
          </form>
          <div v-if="commentsPending" class="card">
            <div class="card-block">
              Loading comments...
            </div>
          </div>
          <div v-else-if="commentsError" class="card">
            <div class="card-block">
              An error occurred while loading comments: {{ commentsError.message }}
            </div>
          </div>
          <template v-else-if="commentsData?.comments">
            <div v-for="c in commentsData?.comments" :key="c.id" class="card">
              <div class="card-block">
                <p class="card-text">
                  {{ c.body }}
                </p>
              </div>
              <div class="card-footer">
                <NuxtLink class="comment-author" :to="`/profile/${c.author.username}`">
                  <img :src="c.author.image" class="comment-author-img" :alt="`${c.author.username} avatar`">
                </NuxtLink>&nbsp;<NuxtLink class="comment-author" :to="`/profile/${c.author.username}`">
                  {{ c.author.username }}
                </NuxtLink><span class="date-posted">{{ c.createdAt }}</span><span class="mod-options"><i
                  v-if="c.author.username === user?.username" class="ion-trash-a"
                  @click.prevent="onDeleteComment(c.id)"
                /></span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
