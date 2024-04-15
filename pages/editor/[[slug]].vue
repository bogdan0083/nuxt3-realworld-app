<script setup lang="ts">
import type { NuxtError } from '#app'
import type { Article, CreateArticle201Response, GetArticleRequest, GetArticlesFeed200Response, NewArticle } from '~/lib/api/__generated__'
import { apiFetch } from '~/lib/api/apiFetch'
import type { NuxtErrorWithRecord } from '~/lib/types'

definePageMeta({
  middleware: 'auth',
})

const { params } = useRoute()
const slug = params.slug as string | undefined
const articleTitle = ref('')
const articleDescription = ref('')
const articleBody = ref('')
const articleTag = ref('')
const articleTagInputRef = ref(null) as Ref<HTMLInputElement | null>
const isTagInputFocused = ref(false)
const appliedTags = ref([]) as Ref<string[]>
const articleToCreateOrUpdate = ref(undefined) as Ref<NewArticle | undefined>

const { data, error, status } = await useArticleApi({ slug })
const { data: createArticleData, status: createArticleStatus, execute: createArticle, error: createArticleError } = await useCreateArticleApi({ article: articleToCreateOrUpdate as Ref<NewArticle> })
const { data: updateArticleData, status: updateArticleStatus, execute: updateArticle, error: updateArticleError } = await useUpdateArticleApi({ article: articleToCreateOrUpdate as Ref<NewArticle>, slug: slug as string })
const isLoading = computed(() => status.value === 'pending')

const createOrUpdateArticleData = computed(() => updateArticleData.value || createArticleData.value)
const isCreatingOrUpdatingArticle = computed(() => createArticleStatus.value === 'pending' || updateArticleStatus.value === 'pending')
const createOrUpdateArticleError = computed(() => createArticleError.value || updateArticleError.value)

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

watchEffect(async () => {
  if (createOrUpdateArticleData.value)
    await navigateTo(`/article/${createOrUpdateArticleData.value?.article.slug}`)
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

  articleToCreateOrUpdate.value = article
  await nextTick()

  if (slug)
    await updateArticle()
  else
    await createArticle()
}
</script>

<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul v-if="createOrUpdateArticleError" class="error-messages">
            <li v-for="(v, key) in createOrUpdateArticleError.data?.errors" :key="key">
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
                  v-model="articleTitle" type="text" name="title" class="form-control form-control-lg"
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
              </fieldset><button class="btn btn-lg pull-xs-right btn-primary" type="submit" :disabled="isCreatingOrUpdatingArticle">
                {{ isCreatingOrUpdatingArticle ? 'Publishing...' : 'Publish Article' }}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
