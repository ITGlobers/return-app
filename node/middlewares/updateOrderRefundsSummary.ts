import { json } from 'co-body'

import type { ReturnRequest } from '../../typings/ReturnRequest'
import { updateOrderRefundsSumaryService } from '../services/updateOrderRefundsSummaryService'

type BodyRequest = {
  refund: Goodwill | ReturnRequest
}

const updateOrderRefundsSummary = async (ctx: Context): Promise<void> => {
  const {
    req,
    clients: { orderRefundsSummaryClient },
    vtex: {
      logger,
      route: { params },
    },
  } = ctx

  try {
    const orderId = params.orderId as string

    const { refund } = (await json(req)) as BodyRequest

    const orderRefundSummary = await updateOrderRefundsSumaryService({
      orderId,
      refundToBeAdded: refund,
      clients: {
        logger,
        orderRefundsSummaryClient,
      },
    })

    ctx.status = 200
    ctx.body = orderRefundSummary
  } catch (e) {
    logger.error(`Error while updating the order refund summary ${e}`)
    ctx.status = 500
  }
}

export default updateOrderRefundsSummary
