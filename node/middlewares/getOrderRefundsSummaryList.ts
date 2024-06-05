import { json } from 'co-body'
import { getSummary } from '../services/getSummary'
import { ordersGetSummary, ordersToSummary } from '../typings/types'
export async function getOrderRefundsSummaryList(ctx: Context) {
  const { req } = ctx
  const body: ordersGetSummary[] = await json(req)
  const orderListPromises: ordersToSummary[] = []

  for (const order of body) {
    const response = await getSummary(ctx, order.orderId)
    const hasTransactions =
      response.transactions && response.transactions.length > 0
    const hasQuantityGreaterThanZero = response.items
      .map((item) => item.amountAvailablePerItem.quantity)
      .some((quantity) => quantity > 0)
    const hasRefunds = hasTransactions || false
    const orderToSummary = {
      ...order,
      hasRefunds: hasRefunds,
      hasAmount:
        response.amountsAvailable.shipping > 0 ||
        response.amountsAvailable.order > 0 ||
        hasQuantityGreaterThanZero,
    }
    orderListPromises.push(orderToSummary)
  }
  const orders = await Promise.all(orderListPromises)

  ctx.body = orders
  ctx.status = 200

  ctx.set('Cache-Control', 'no-cache')
}
