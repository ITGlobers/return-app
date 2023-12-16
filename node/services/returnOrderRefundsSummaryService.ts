import type { OrderRefundsSummary } from '../typings/orderRefundsSummary'

const returnOrderRefundsSumaryService = async (
  ctx: Context
): Promise<OrderRefundsSummary | null> => {
  const {
    clients: { orderRefundsSummaryClient },
    vtex: {
      logger,
      route: { params },
    },
  } = ctx

  try {
    const orderId = params.orderId as string

    logger.info(`Order Id ${orderId} Summary requested`)

    const refundsFoundByOrderId = await orderRefundsSummaryClient.search(
      { page: 1, pageSize: 10 },
      ['orderId,orderValue,refunds,refundable'],
      undefined,
      `orderId=${orderId}`
    )

    logger.info(`Refund Summaries found => ${refundsFoundByOrderId}`)

    if (refundsFoundByOrderId.length === 0) return null

    return refundsFoundByOrderId[0]
  } catch (e) {
    logger.info(`Refund Summaries error => ${e}`)

    return null
  }
}

export default returnOrderRefundsSumaryService
