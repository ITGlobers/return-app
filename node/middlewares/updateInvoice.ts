import { json } from 'co-body'

import { updateInvoiceService } from '../services/updateInvoiceService'

export async function updateInvoice(ctx: Context): Promise<any> {
  const {
    req,
    vtex: {
      route: {
        params: { orderId },
      },
    },
  } = ctx

  const body = await json(req)

  ctx.body = await updateInvoiceService(ctx, orderId, body)
}
