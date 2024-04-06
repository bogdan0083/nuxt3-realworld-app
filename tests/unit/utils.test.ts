import { describe, expect, it } from 'vitest'
import { pageTitle } from '~/lib/utils'

describe('utils', () => {
  it('pageTitle', () => {
    expect(pageTitle('Home')).toBe('Home - Conduit')
  })
})
