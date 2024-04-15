import { apiFetch } from '~/lib/api/apiFetch'
import type { Comment, CreateArticleComment200Response, CreateArticleCommentRequest } from '~/lib/api/__generated__'

interface Options {
  articleSlug: MaybeRefOrGetter<string>
  comments: MaybeRefOrGetter<Comment[] | undefined>
  id: MaybeRefOrGetter<number>
}

export default function useCreateDeleteCommentApi(opts: Options) {
  const response = useLazyAsyncData<CreateArticleCommentRequest, Error, CreateArticleComment200Response>(
    () => {
      const slug = toValue(opts.articleSlug)
      const id = toValue(opts.id)
      let comments = toValue(opts.comments)
      const previousComments = comments
      return apiFetch(`/articles/${slug}/comments/${id}`, {
        method: 'DELETE',
        onRequest: () => {
          const deletedCommentIndex = comments?.findIndex(c => c.id === id) as number
          // remove comment from the list
          if (deletedCommentIndex !== undefined && deletedCommentIndex !== -1)
            comments?.splice(deletedCommentIndex, 1)
        },
        onRequestError: () => {
          comments = previousComments
        },
      })
    },
    { immediate: false, deep: false },
  )

  return response
}
