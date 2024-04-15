export function useLogOut() {
  const user = useAuthUser()
  const tokenCookie = useCookie('token')
  const logout = async () => {
    await navigateTo('/')
    user.value = undefined
    tokenCookie.value = undefined
    await nextTick()
  }

  return logout
}
