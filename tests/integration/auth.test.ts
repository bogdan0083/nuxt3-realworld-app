// @vitest-environment nuxt
// ~/tests/e2e/articles.test.ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { login, wait } from '../utils'
import App from '~/app.vue'
import { registerAuthEndpoints } from '~/mocks/auth/endpoints'

registerAuthEndpoints()
describe('user', async () => {
  it('should show errors on empty fields submit', async () => {
    const wrapper = await mountSuspended(App, { route: '/login' })
    const form = await wrapper.find('form')

    await fireEvent.submit(form.element)
    await flushPromises()
    await wait(100)
    expect(wrapper.html()).toContain('email can\'t be blank')
  })
  it('should successfully login', async () => {
    const wrapper = await mountSuspended(App, { route: '/login' })
    await login(wrapper)
    expect(wrapper.find('.navbar').html()).toContain('myAwesomeLogin')
  })
})
