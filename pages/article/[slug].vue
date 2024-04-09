<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import type { NuxtError } from '#app'
import type { Comment, CreateArticle201Response, CreateArticleComment200Response, GetArticleComments200Response, GetArticleCommentsRequest, GetArticleRequest } from '~/lib/api/__generated__'
import { apiFetch } from '~/lib/api/apiFetch'

const router = useRouter()
const { params: { slug } } = useRoute()
const user = useCurrentUser()
const comment = ref('')
const isPostingComment = ref(false)
const isDeletingArticle = ref(false)

const { data, error, pending } = await useLazyAsyncData<GetArticleRequest, NuxtError, CreateArticle201Response>('get-article', async () => {
  return apiFetch(`/articles/${slug}`)
})

const { data: commentsData, error: commentsError, pending: commentsPending } = await useLazyAsyncData<GetArticleCommentsRequest, NuxtError, GetArticleComments200Response>('get-article-comments', async () => {
  return apiFetch(`/articles/${slug}/comments`)
})

const isMyArticle = computed(() => user.value?.username === data.value?.article.author.username)

const formattedDate = computed(() => {
  if (data.value)
    return formatDate(new Date(data?.value.article.createdAt), 'MMMM D, YYYY', { locales: 'en-US' })
  else
    return undefined
})

const authorLink = computed(() => {
  if (data.value)
    return `/profile/${data.value.article.author.username}`
  else
    return undefined
})

const favoriteButtonClasses = computed(() => ({
  'btn btn-sm': true,
  'btn-outline-primary': !data.value?.article.favorited,
  'btn-primary': data.value?.article.favorited,
}))

const followButtonClasses = computed(() => ({
  'btn btn-sm action-btn': true,
  'btn-outline-secondary': !data.value?.article.author.following,
  'btn-secondary': data.value?.article.author.following,
}))

// @TODO: abstract this into a reusable composable
async function onFollowClick() {
  if (data.value) {
    const { article: { author: { following } } } = data.value
    const encodedUsername = encodeURIComponent(data.value.article.author.username)

    try {
      const previousFollowing = following
      data.value.article.author.following = !following
      await apiFetch(`/profiles/${encodedUsername}/follow`, {
        method: previousFollowing ? 'DELETE' : 'POST',
      })
    }
    catch (error) {
      data.value.article.author.following = !data.value.article.author.following
    }
  }
}

async function onFavoritesClick() {
  if (data.value) {
    const article = data.value.article
    const originalFavorited = article.favorited
    article.favorited = !article.favorited
    article.favoritesCount += article.favorited ? 1 : -1
    try {
      await apiFetch(`/articles/${article.slug}/favorite`, {
        method: originalFavorited ? 'DELETE' : 'POST',
        body: { slug: article.slug },
      })
    }
    catch (e) {
      article.favorited = !article.favorited
      article.favoritesCount += article.favorited ? 1 : -1
    }
  }
}

async function onCommentSubmit() {
  if (data.value) {
    isPostingComment.value = true
    const article = data.value.article
    const commentBody = comment.value
    try {
      const response = await apiFetch<CreateArticleComment200Response>(`/articles/${article.slug}/comments`, {
        method: 'POST',
        body: { comment: { body: commentBody } },
      })
      comment.value = ''
      // prepend new comment to the list
      commentsData.value?.comments.unshift(response.comment)
    }
    catch (e) {
      console.error(e)
    }
    finally {
      isPostingComment.value = false
    }
  }
}

async function deleteComment(commentId: number) {
  if (data.value) {
    const article = data.value.article
    const deletedCommentIndex = commentsData.value?.comments.findIndex(c => c.id === commentId) as number
    const deletedComment = commentsData.value?.comments[deletedCommentIndex] as Comment
    // remove comment from the list
    if (deletedCommentIndex !== undefined && deletedCommentIndex !== -1)
      commentsData.value?.comments.splice(deletedCommentIndex, 1)

    try {
      await apiFetch(`/articles/${article.slug}/comments/${commentId}`, {
        method: 'DELETE',
      })
    }
    catch (e) {
      // if error happens, add the comment back to the list
      if (deletedCommentIndex !== undefined && deletedCommentIndex !== -1)
        commentsData.value?.comments.splice(deletedCommentIndex, 0, deletedComment)
      console.error(e)
    }
  }
}

async function deleteArticle() {
  if (data.value) {
    isDeletingArticle.value = true
    try {
      await apiFetch(`/articles/${data.value.article.slug}`, {
        method: 'DELETE',
      })
      router.push(`/profile/${user.value?.username}`)
    }
    catch (e) {
      console.error(e)
    }
    finally {
      isDeletingArticle.value = false
    }
  }
}
</script>

<template>
  <div class="article-page">
    <div class="banner">
      <div v-if="pending" class="container">
        Loading article...
      </div>
      <div v-else-if="error" class="container">
        An error occurred while loading the article: {{ error.message }}
      </div>
      <div v-else-if="data?.article" class="container">
        <h1>{{ data.article.title }}</h1>
        <div class="article-meta">
          <NuxtLink :to="authorLink">
            <img :src="data.article.author.image" alt="author avatar">
          </NuxtLink>
          <div class="info">
            <NuxtLink class="author" :to="authorLink">
              {{ data.article.author.username }}
            </NuxtLink><span class="date">{{ formattedDate }}</span>
          </div>
          <template v-if="!isMyArticle">
            <button v-if="!isMyArticle" :class="followButtonClasses" @click.prevent="onFollowClick">
              <i class="ion-plus-round" />&nbsp; {{ data.article.author.following ? 'Unfollow' : 'Follow' }}
              {{ data.article.author.username }}
            </button>&nbsp;
            <button :class="favoriteButtonClasses" @click.prevent="onFavoritesClick">
              <i class="ion-heart" /> {{ data.article.favorited ? 'Unfavorite' : 'Favorite' }} Article <span
                class="counter"
              >({{ data.article.favoritesCount }})</span>
            </button>
          </template>
          <template v-else>
            <NuxtLink
              class="btn btn-outline-secondary btn-sm"
              :to="`/editor/${data.article.slug}`"
            >
              <i class="ion-edit" /> Edit Article
            </NuxtLink>
            <button class="btn btn-outline-danger btn-sm" :disabled="isDeletingArticle" @click.prevent="deleteArticle">
              <i class="ion-trash-a" /> {{ isDeletingArticle ? 'Deleting...' : 'Delete Article' }}
            </button>
          </template>
        </div>
      </div>
    </div>
    <div class="container page">
      <div v-if="data?.article" class="row article-content">
        <div class="col-xs-12">
          <p>{{ data?.article.description }}</p>
          <div>
            <p>{{ data?.article.body }}</p>
          </div>
          <ul v-if="data?.article.tagList" class="tag-list">
            <li v-for="tag in data.article.tagList" :key="tag" class="tag-default tag-pill tag-outline">
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
          <form v-if="user && data?.article" class="card comment-form" @submit.prevent="onCommentSubmit">
            <div class="card-block">
              <textarea
                v-model="comment" name="comment" class="form-control" placeholder="Write a comment..."
                rows="3"
              />
            </div>
            <div class="card-footer">
              <img
                :src="data?.article.author.image" class="comment-author-img"
                :alt="`${data?.article.author.username} avatar`"
              ><button
                type="submit" class="btn btn-sm btn-primary"
                :disabled="isPostingComment"
              >
                {{ isPostingComment ? 'Posting...' : 'Post Comment' }}
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
                  @click.prevent="deleteComment(c.id)"
                /></span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
