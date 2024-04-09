<script setup lang="ts">
import type { NuxtError } from '#app'
import type { CreateArticle201Response, GetArticleRequest, GetArticlesFeed200Response } from '~/lib/api/__generated__'
import { apiFetch } from '~/lib/api/apiFetch'
import type { NuxtErrorWithRecord } from '~/lib/types'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const { params: { slug } } = useRoute()
const articleTitle = ref('')
const articleDescription = ref('')
const articleBody = ref('')
const articleTag = ref('')
const articleTagInputRef = ref(null) as Ref<HTMLInputElement | null>
const isTagInputFocused = ref(false)
const appliedTags = ref([]) as Ref<string[]>
const publishError = ref(undefined) as Ref<NuxtErrorWithRecord | undefined>
const isPublishing = ref(false)

const { data, error, status } = await useLazyAsyncData<GetArticleRequest, NuxtErrorWithRecord, CreateArticle201Response>(
  () => apiFetch(`/articles/${slug}`),
  { immediate: !!slug },
)

const isLoading = computed(() => status.value === 'pending')

const onTagInputFocus = () => isTagInputFocused.value = true
const onTagInputBlur = () => isTagInputFocused.value = false

onMounted(() => {
  if (articleTagInputRef.value === null)
    return

  articleTagInputRef.value.addEventListener('focus', onTagInputFocus)
  articleTagInputRef.value.addEventListener('blur', onTagInputBlur)
})

onUnmounted(() => {
  if (articleTagInputRef.value === null)
    return

  articleTagInputRef.value.removeEventListener('focus', onTagInputFocus)
  articleTagInputRef.value.removeEventListener('blur', onTagInputBlur)
})

function onArticleTagEnter(e: KeyboardEvent) {
  e.stopPropagation()
  e.stopImmediatePropagation()
  appliedTags.value.push(articleTag.value)
  articleTag.value = ''
}

watchEffect(() => {
  if (data.value && data.value.article) {
    articleTitle.value = data.value.article.title
    articleDescription.value = data.value.article.description
    articleBody.value = data.value.article.body
    appliedTags.value = data.value.article.tagList
  }
})

async function onPublishArticle() {
  if (isTagInputFocused.value)
    return

  const article = {
    title: articleTitle.value,
    description: articleDescription.value,
    body: articleBody.value,
    tagList: appliedTags.value,
  }

  try {
    isPublishing.value = true
    const response = await apiFetch<CreateArticle201Response>(slug ? `/articles/${slug}` : '/articles', {
      method: slug ? 'PUT' : 'POST',
      body: { article },
    })
    router.push(`/article/${response.article.slug}`)
  }
  catch (e) {
    publishError.value = e as NuxtErrorWithRecord
  }
  finally {
    isPublishing.value = false
  }
}
</script>

<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul v-if="publishError" class="error-messages">
            <li v-for="(v, key) in publishError.data?.errors" :key="key">
              {{ key }} {{ v.join(', ') }}
            </li>
          </ul>
          <div v-if="error" class="text-xs-center">
            An error occurred: {{ error.message }}
          </div>
          <div v-if="isLoading" class="text-xs-center">
            Loading...
          </div>
          <form v-else-if="!slug || data?.article" @submit.prevent="onPublishArticle">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="articleTitle" type="text" name="articleTitle" class="form-control form-control-lg"
                  placeholder="Article Title"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="articleDescription" type="text" name="description" class="form-control"
                  placeholder="What's this article about?"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="articleBody" class="form-control" name="body" rows="8"
                  placeholder="Write your article (in markdown)"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  ref="articleTagInputRef" v-model="articleTag" type="text" name="tags" class="form-control"
                  placeholder="Enter tags"
                  @keydown.enter="onArticleTagEnter"
                >
                <div v-if="appliedTags" class="tag-list">
                  <span v-for="t in appliedTags" :key="t" class="tag-default tag-pill"><i
                    class="ion-close-round"
                    @click="appliedTags.splice(appliedTags.indexOf(t), 1)"
                  />{{ t }}</span>
                </div>
              </fieldset><button class="btn btn-lg pull-xs-right btn-primary" type="submit" :disabled="isPublishing">
                {{ isPublishing ? 'Publishing...' : 'Publish Article' }}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
