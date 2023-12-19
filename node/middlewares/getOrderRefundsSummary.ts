import returnOrderRefundsSumaryService from '../services/returnOrderRefundsSummaryService'

async function getOrderRefundsSummary(ctx: Context) {
  try {
    const {
      vtex: {
        logger,
        route: { params },
      },
      clients: {
        returnRequestClient,
        oms,
        goodwill,
        orderRefundsSummaryClient,
      },
    } = ctx

    const orderId = params.orderId as string

    const response = await returnOrderRefundsSumaryService({
      clients: {
        goodwillClient: goodwill,
        logger,
        omsClient: oms,
        orderRefundsSummaryClient,
        returnRequestClient,
      },
      orderId,
    })

    if (response === null) throw new Error('Internal error')

    ctx.body = {
      data: response,
    }
    ctx.status = 200
  } catch (e) {
    ctx.status = 500
  }

  ctx.set('Cache-Control', 'no-cache')
}

export default getOrderRefundsSummary
