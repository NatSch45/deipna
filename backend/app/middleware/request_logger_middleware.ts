import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RequestLoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await next()

    const status = ctx.response.getStatus()
    if (status >= 400) {
      ctx.logger.info(
        {
          method: ctx.request.method(),
          url: ctx.request.url(),
          status,
        },
        `HTTP ${status} ${ctx.request.method()} ${ctx.request.url()}`
      )
    }
  }
}
