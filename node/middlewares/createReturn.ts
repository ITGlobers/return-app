import { UserInputError } from '@vtex/api'
import { json } from 'co-body'

import { createReturnRequestService } from '../services/createReturnRequestService'

export async function createReturn(ctx: Context) {
  const { req } = ctx

  const body = await json(req)

  const { locale } = body

  if (!locale) {
    throw new UserInputError('Locale is required.')
  }

  ctx.vtex.locale = locale

  try {
    ctx.body = await createReturnRequestService(ctx, body)
    ctx.status = 200
  } catch (error) {
    ctx.body = error?.response?.data || error.response.statusText || error
    ctx.status = error.response?.status || 400
  }
}
