// @vitest-environment nuxt
// ~/tests/e2e/articles.test.ts
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { login, wait } from '../utils'
import App from '~/app.vue'
import { registerArticlesEndpoints } from '~/mocks/articles/endpoints'
import { registerTagsEndpoints } from '~/mocks/tags/endpoints'
import { registerAuthEndpoints } from '~/mocks/auth/endpoints'

describe('articles', async () => {
  registerArticlesEndpoints()
  registerTagsEndpoints()
  registerAuthEndpoints()

  describe('unauthenticated', () => {
    it('should display list of articles', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })

      await flushPromises()
      const articles = await wrapper.findAll('.article-preview')

      expect(articles).toHaveLength(10)
    })
    it('should handle pagination', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })
      const paginationLinkClass = '.pagination .page-link'

      await flushPromises()

      let paginationLinks = await wrapper.findAll(paginationLinkClass)
      const firstLinkParentClass = (paginationLinks[0].element?.parentNode as Element).getAttribute('class')

      expect(firstLinkParentClass).toBe('page-item active')

      // trigger click on last pagination link
      await fireEvent.click(paginationLinks[2].element)

      await wait(400)

      const articles = await wrapper.findAll('.article-preview')

      await nextTick()
      paginationLinks = await wrapper.findAll(paginationLinkClass)
      const secondLinkParentClass = (paginationLinks[2].element?.parentNode as Element).getAttribute('class')
      expect(articles).toHaveLength(2)
      expect(paginationLinks).toHaveLength(3)
      expect(secondLinkParentClass).toBe('page-item active')
    })
    it('should handle tag filtering', async () => {
      const wrapper = await mountSuspended(App, { route: '/' })

      await flushPromises()

      const tagPills = await wrapper.findAll('.sidebar .tag-list .tag-pill')
      expect(tagPills).toHaveLength(10)

      await fireEvent.click(tagPills[0].element)
      await wait(300)

      const articles = await wrapper.findAll('.article-preview')
      expect(articles).toHaveLength(1)
    })
    it('should render article page', async () => {
      const wrapper = await mountSuspended(App, { route: '/article/slug-1' })

      await flushPromises()

      expect(wrapper.find('.article-page').exists()).toBe(true)
      expect(wrapper.find('.banner h1').text()).toContain('title-1')
      expect(wrapper.find('.article-content').text()).toContain('description-1')
      expect(wrapper.find('.article-content').text()).toContain('body-1')
      expect(wrapper.find('.article-content .tag-list').text()).toContain('tag-1')
    })
  })
  describe('authenticated', () => {
    it('should have my feed tab with articles', async () => {
      const wrapper = await mountSuspended(App, { route: '/login' })
      await login(wrapper)
      const feedTabs = await wrapper.findAll('.feed-toggle .nav-link')

      expect(feedTabs).toHaveLength(2)

      // when we logged in we are on "your feed" feed by default and have 6 articles
      expect(await wrapper.findAll('.article-preview')).toHaveLength(6)

      await fireEvent.click(feedTabs[1].element)
      await wait(100)

      // now we on the global feed and should have 10 articles
      expect(await wrapper.findAll('.article-preview')).toHaveLength(10)
    })
  })
})
