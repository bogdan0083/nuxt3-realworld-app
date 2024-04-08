import type { Article } from '~/lib/api/__generated__'

type ArticleWithStringDates = Omit<Article, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export function generateArticle(opts: Partial<ArticleWithStringDates> = {}): ArticleWithStringDates {
  return {
    slug: opts.slug || 'slug',
    title: opts.title || 'title',
    description: opts.description || 'description',
    body: opts.body || 'body',
    tagList: opts.tagList || ['tag1', 'tag2'],
    createdAt: opts.createdAt || '2021-01-01T00:00:00.000Z',
    updatedAt: opts.updatedAt || '2021-01-01T00:00:00.000Z',
    favorited: opts.favorited || false,
    favoritesCount: opts.favoritesCount || 0,
    author: {
      username: opts.author?.username || 'username',
      bio: opts.author?.bio || 'bio',
      image: opts.author?.image || 'image',
      following: opts.author?.following || false,
    },
  }
}

export function generateArticles(count: number): ArticleWithStringDates[] {
  return Array.from({ length: count }, (_, i) =>
    generateArticle({
      slug: `slug-${i}`,
      title: `title-${i}`,
      description: `description-${i}`,
      body: `body-${i}`,
      tagList: [`tag-${i}`],
      createdAt: `2021-01-01T00:00:0${i}.000Z`,
      updatedAt: `2021-01-01T00:00:0${i}.000Z`,
      favorited: false,
      favoritesCount: 0,
      author: {
        username: `username-${i}`,
        bio: `bio-${i}`,
        image: `image-${i}`,
        following: false,
      },
    }))
}
