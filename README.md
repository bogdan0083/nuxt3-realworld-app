# ![RealWorld Example App](logo.png)

> ### Nuxt 3 codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Nuxt 3 Demo](https://nuxt3-realworld-app.vercel.app)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **Nuxt 3** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Nuxt 3** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

## How it works

Our Nuxt application acts as an intermediary between the client and an external API, forwarding requests from the client to the external API and then returning the responses back to the client. Basically it acts as a proxy and doesn't have any defined API endpoints.

All API calls are [abstracted into composables](composables/api/) to make working with server state clearer and more consistent.

## Getting started

```
npm install && npm run setup-git-hooks && npm run dev
```

## TODOs

- Add a visual feedback to all errors
