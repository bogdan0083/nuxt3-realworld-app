import type { mountSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function login(wrapper: ReturnType<typeof mountSuspended>) {
  const nuxtApp = useNuxtApp()
  await nuxtApp.$router.push('/login')
  await wait(100)
  const form = await wrapper.find('form')
  const emailInput = await wrapper.find('input[type="email"]')
  const passwordInput = await wrapper.find('input[type="password"]')

  await emailInput.setValue('email@gmail.com')
  await passwordInput.setValue('world')
  await fireEvent.submit(form.element)
  await flushPromises()
  await wait(100)
}
