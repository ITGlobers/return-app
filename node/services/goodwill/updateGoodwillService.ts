import { UserInputError } from '@vtex/api'

import type { GoodwillUpdate } from '../../middlewares/goodwill/updateGoodwill'
import returnOrderRefundsSummaryService from '../returnOrderRefundsSummaryService'
import { ExternalLogSeverity } from '../../middlewares/errorHandler'

export default async function createGoodwillService(
  ctx: Context,
  goodwillUpdate: GoodwillUpdate
): Promise<any> {
  const {
    clients: { goodwill },
  } = ctx
  ctx.state.logs.push({
    message: 'Request received',
    middleware: 'Resolver Update Goodwill Service',
    severity: ExternalLogSeverity.INFO,
    payload: {
      details: 'Body of the request captured',
      stack: JSON.stringify(goodwillUpdate),
    },
  })
  const { id, status, message } = goodwillUpdate

  console.info('🚀 ~ id:', id)
  console.info('🚀 ~ status:', status)

  const goodwillData = await goodwill.get(id, [
    'id,orderId,sellerId,status,goodwillCreditId,goodwillCreditAmount,shippingCost,items,reason,logs',
  ])

  console.info('🚀 ~ goodwillData:', goodwillData)

  switch (status) {
    case 200:
      goodwillData.status = 'amountRefunded'
      goodwillData.logs.push({
        detail: JSON.stringify({
          date: new Date(),
          status: 'amountRefunded',
          detail: message,
        }),
      })

      break

    case 403:
      await returnOrderRefundsSummaryService(
        ctx,
        {
          ... goodwillData,
          type: 'GOODWILL',
        },
        'denied'
      )
      goodwillData.status = 'failed'
      goodwillData.logs.push({
        detail: JSON.stringify({
          date: new Date(),
          status: 'failed',
          detail: message,
        }),
      })
      break

    default:
      throw new UserInputError('Invalid status')
  }

  return goodwill.saveOrUpdate(goodwillData)
}
