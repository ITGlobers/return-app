import returnOrderRefundsSumaryService from '../services/returnOrderRefundsSummaryService'

async function getOrderRefundsSummary(ctx: Context) {
  try {
    const response = await returnOrderRefundsSumaryService(ctx)

    ctx.body = response
    ctx.status = 200
  } catch (e) {
    ctx.status = 500
  }

  ctx.set('Cache-Control', 'no-cache')
}

export default getOrderRefundsSummary
