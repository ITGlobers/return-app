import { getSummary } from "../services/getSummary"
export async function getOrderRefundsSummaryComplete(ctx: Context) {

  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const orderId = params.orderId as string
  const response = await getSummary(ctx , orderId)
  ctx.body = response
  ctx.status = 200

  ctx.set('Cache-Control', 'no-cache')
}
