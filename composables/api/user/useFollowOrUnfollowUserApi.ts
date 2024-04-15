import { apiFetch } from '~/lib/api/apiFetch'
import type { Profile } from '~/lib/api/__generated__'
import type { NuxtErrorWithRecord } from '~/lib/types'

interface Options {
  profile: MaybeRefOrGetter<Profile>
}

export default async function useFollowOrUnfollowUserApi(opts: Options) {
  return await useLazyAsyncData<Profile, NuxtErrorWithRecord, Profile>('follow-or-unfollow-user', async () => {
    const profile = toValue(opts.profile)
    const username = profile.username
    const previousFollowing = profile.following
    return apiFetch(`/profiles/${username}/follow`, {
      method: previousFollowing ? 'DELETE' : 'POST',
      onRequest: () => {
        profile.following = !previousFollowing
      },
      onRequestError: () => {
        profile.following = previousFollowing
      },
    })
  })
}
