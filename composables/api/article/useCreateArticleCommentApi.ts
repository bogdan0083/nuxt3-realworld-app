import { apiFetch } from '~/lib/api/apiFetch'
import type { Comment, CreateArticleComment200Response, CreateArticleCommentRequest } from '~/lib/api/__generated__'

interface Options {
  articleSlug: MaybeRefOrGetter<string>
  comments: MaybeRefOrGetter<Comment[] | undefined>
  commentBody: MaybeRefOrGetter<string>
}

export default function useCreateArticleCommentApi(opts: Options) {
  const response = useLazyAsyncData<CreateArticleCommentRequest, Error, CreateArticleComment200Response>(
    () => {
      let comments = toValue(opts.comments)
      const commentBody = toValue(opts.commentBody)
      const previousComments = comments
      const previousCommentBody = commentBody
      const slug = toValue(opts.articleSlug)
      return apiFetch(`/articles/${slug}/comments`, {
        method: 'POST',
        body: { comment: { body: commentBody } },
        onResponse: ({ response }) => {
          if (isRef(opts.commentBody))
            opts.commentBody.value = ''
          comments?.push?.(response._data.comment)
        },
        onRequestError: () => {
          comments = previousComments
          if (isRef(opts.commentBody))
            opts.commentBody.value = previousCommentBody
        },
      })
    },
    { immediate: false, deep: false },
  )

  const isPostingComment = computed(() => response.status?.value === 'pending')

  return { ...response, isPostingComment: isPostingComment.value }
}
