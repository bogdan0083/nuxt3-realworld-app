export function useLogOut() {
  const user = useCurrentUser()
  const tokenCookie = useCookie('token')
  const logout = async () => {
    await navigateTo('/')
    user.value = undefined
    tokenCookie.value = undefined
    await nextTick()
  }

  return logout
}
