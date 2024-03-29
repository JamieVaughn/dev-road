import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware((context, next) => {
  // update type declaration in env.d.ts to type `locals` object
  context.locals.title = JSON.stringify(context)

  const accessToken = context.cookies.get('sb-access-token')
  const refreshToken = context.cookies.get('sb-refresh-token')

  const isProtectedRoute =
    context.url.pathname.includes('class') ||
    context.url.pathname.includes('courses')

  if (isProtectedRoute && (!accessToken || !refreshToken)) {
    return Response.redirect(`${context.url.origin}/login`, 302)
  }
  return next()
})
