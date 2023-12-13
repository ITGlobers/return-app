import type { ReturnRequest } from 'vtex.return-app'

import type OrderRefundsSummary from '../typings/orderRefundsSummary'

const returnOrderRefundsSumaryService = async (
  ctx: Context
): Promise<OrderRefundsSummary> => {
  const {
    clients: { returnRequest: returnRequestClient, oms: omsClient },
    vtex: {
      logger,
      route: { params },
    },
  } = ctx

  const orderId = params.orderId as string

  logger.info(`Order Id ${orderId} Summary requested`)

  // TODO: ask for entity name
  const [currentRefunds, orderFound] = await Promise.all([
    await returnRequestClient.search(
      { page: 1, pageSize: 10 },
      ['_all'],
      undefined,
      `orderId=${orderId}`
    ),
    await omsClient.order(orderId),
  ])

  // TODO: integration tests
  return {
    orderId,
    orderValue: orderFound.value,
    refundable: {
      available: 0,
      shipping: 0,
    },
    refunds: currentRefunds.map((refund: ReturnRequest) => ({
      id: refund.sequenceNumber,
      type: 'goodwill',
      value: refund.refundableAmount,
    })),
  }
}

export default returnOrderRefundsSumaryService
