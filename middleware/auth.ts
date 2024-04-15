import type { RouteLocationNormalized } from 'vue-router'

export default function defineNuxtRouteMiddleware(_to: RouteLocationNormalized) {
  const user = useAuthUser()

  if (!user.value && _to.path !== '/login' && _to.path !== '/register')
    return navigateTo('/login')

  // protect authenticated user from accessing login/register pages
  if (user.value && ['/login', '/register'].includes(_to.path))
    return navigateTo(`/profile/${user.value.username}`)
}
