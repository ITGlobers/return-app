import { json } from 'co-body'

import { createInvoice } from '../services/createInvoice'
import { ExternalLogSeverity } from './errorHandler'

export default async function invoice(
  ctx: Context,
  next: () => Promise<any>
): Promise<any> {
  const {
    req,
    vtex: {
      route: {
        params: { orderId },
      },
    },
  } = ctx

  const body = await json(req)

  ctx.state.logs.push({
    message: 'Request received',
    middleware: 'Middleware create invoice',
    severity: ExternalLogSeverity.INFO,
    payload: {
      details: 'Body of the request captured',
      stack: JSON.stringify(body),
    },
  })
  ctx.body = await createInvoice(ctx, orderId, body)

  ctx.set('Cache-Control', 'no-cache')
  await next()
}
