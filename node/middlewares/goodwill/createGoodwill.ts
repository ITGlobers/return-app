import createGoodwillService from '../../services/goodwill/createGoodwillService'
import validateGoodwillRequest from '../../services/goodwill/validateGoodwillRequest'
import returnOrderRefundsSummaryService from '../../services/returnOrderRefundsSummaryService'
import generateInvoiceFromGoodwill from '../../utils/generateInvoiceFromGoodwill'
import { getErrorLog } from '../../utils/handleError'
import { validateOrderId } from '../../utils/validateOrderId'
import { ExternalLogSeverity } from '../errorHandler'

export default async function createGoodwill(
  ctx: Context,
  next: () => Promise<any>
): Promise<any> {
  const body = ctx.body as Goodwill
  ctx.state.logs.push({
    message: 'Request received',
    middleware: 'Middleware create Goodwill',
    severity: ExternalLogSeverity.INFO,
    payload: {
      details: 'Body of the request captured',
      stack: JSON.stringify(body),
    },
  })
  if (!body?.orderId) {
    ctx.status = 400
    throw new Error(getErrorLog(`Goodwill order Id is Required`, 'GW012'))
  }

  body.orderId = validateOrderId(body.orderId)

  await validateGoodwillRequest(ctx, body)

  const goodwillDraft = await createGoodwillService(ctx, body)

  await returnOrderRefundsSummaryService(
    ctx,
    {
      ...body,
      type: 'GOODWILL',
    },
    'update'
  )
  const orderSummary = await returnOrderRefundsSummaryService(
    ctx,
    {
      ...body,
      type: 'GET',
    },
    'get'
  )
  const invoicesData = generateInvoiceFromGoodwill(body, orderSummary)

  ctx.body = {
    message: 'Goodwill created',
    data: goodwillDraft,
    invoicesData,
  }

  ctx.set('Cache-Control', 'no-cache')
  await next()
}
