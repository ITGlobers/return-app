import type { OrderRefundsSummary } from '../typings/orderRefundsSummary'

const updateOrderRefundsSumary = async (
  ctx: Context
): Promise<OrderRefundsSummary | undefined> => {
  const {
    clients: {
      oms: omsClient,
      orderRefundsSummaryClient,
      // returnRequest: returnRequestClient,
    },
    vtex: {
      logger,
      route: { params },
    },
  } = ctx

  try {
    const orderId = params.orderId as string

    logger.info(`got Order Id${orderId}`)

    const [
      refundSummaries,
      orderFound,
      /* , currentReturns */
    ] = await Promise.all([
      await orderRefundsSummaryClient.search(
        { page: 1, pageSize: 10 },
        ['_all'],
        undefined,
        `orderId=${orderId}`
      ),
      await omsClient.order(orderId),
      // await returnRequestClient.search(
      //   { page: 1, pageSize: 100 },
      //   ['_all'],
      //   undefined,
      //   ''
      // ),
    ])

    let orderRefundSummary: OrderRefundsSummary

    if (refundSummaries.length === 0) {
      orderRefundSummary = {
        orderId,
        orderValue: orderFound.value,
        refundable: {
          available: 0,
          shipping: 0,
        },
        refunds: [],
      }
    } else {
      orderRefundSummary = refundSummaries[0]
    }

    const orderShippingTotal = orderFound.totals.find(
      (total) => total.id === 'Shipping'
    )

    const shippingRefundableTotal = orderShippingTotal?.value ?? 0

    orderRefundSummary.refundable.shipping = shippingRefundableTotal

    await orderRefundsSummaryClient.saveOrUpdate({
      id: '',
      ...orderRefundSummary,
    })

    return orderRefundSummary
  } catch (e) {
    logger.error(`Error while updating the order refund summary ${e}`)

    return undefined
  }
}

export default updateOrderRefundsSumary
