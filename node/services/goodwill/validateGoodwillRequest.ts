import type OrderRefundsSummary from '../../../typings/OrderRefundsSummary'
import { getErrorLog } from '../../utils/handleError'
import { validateOrderId } from '../../utils/validateOrderId'
import returnOrderRefundsSummaryService from '../returnOrderRefundsSummaryService'

const validateGoodwillRequest = async (ctx: Context, goodwill: Goodwill) => {
  const {
    clients: { oms, goodwill: goodwillClient },
  } = ctx

  const { orderId } = goodwill

  let goodwillCreditIdIsDuplicated

  if (!goodwill.goodwillCreditId) {
    ctx.status = 400
    throw new Error(getErrorLog(`Goodwill credit Id is Required`, 'GW011'))
  }

  try {
    const previousGoodwillByOrder = await goodwillClient.search(
      {
        page: 1,
        pageSize: 10,
      },
      ['_all'],
      '',
      `orderId=${orderId}`
    )

    goodwillCreditIdIsDuplicated = !!previousGoodwillByOrder.find(
      (item) => item.goodwillCreditId === goodwill.goodwillCreditId && item.status !== 'failed'
    )
  } catch (error) {
    ctx.status = 400
    throw new Error(
      getErrorLog(
        `Error getting Goodwill list: ${
          error?.response?.data
            ? JSON.stringify(error?.response?.data)
            : error.response
        }`,
        'GW014'
      )
    )
  }

  if (goodwillCreditIdIsDuplicated) {
    ctx.status = 400
    throw new Error(
      getErrorLog(`Goodwill already created for orderId: ${orderId}`, 'GW002')
    )
  }

  if (goodwill.goodwillCreditAmount === 0 && goodwill.shippingCost === 0) {
    ctx.status = 400
    throw new Error(
      getErrorLog(`Cant create a goodwill without credit`, 'GW010')
    )
  }

  if (!goodwill.items.every((item) => item.amount > 0)) {
    ctx.status = 400
    throw new Error(
      getErrorLog(
        `Goodwill cannot contain items with amounts of 0 or less.`,
        'GW015'
      )
    )
  }

  let order

  try {
    order = await oms.order(validateOrderId(orderId))
  } catch (error) {
    ctx.status = 404
    throw new Error(getErrorLog(`Order Not Fount: ${orderId}`, 'GW006'))
  }

  if (
    order.status !== 'invoiced' &&
    order.status !== 'payment-approved' &&
    order.status !== 'handling'
  ) {
    ctx.status = 400
    throw new Error(getErrorLog(`Order is not invoiced`, 'GW000'))
  }

  let totalValueOrder = 0
  const orderSummary: OrderRefundsSummary =
    await returnOrderRefundsSummaryService(ctx, {
      ...goodwill,
      type: 'GOODWILL',
    })

  if (
    orderSummary.amountsAvailable.order === 0 &&
    orderSummary.amountsAvailable.shipping === 0
  ) {
    ctx.status = 400
    throw new Error(getErrorLog(`No invoices available to refund`, 'GW007'))
  }

  totalValueOrder += goodwill.shippingCost
  if (goodwill.shippingCost > orderSummary?.amountsAvailable?.shipping) {
    ctx.status = 400
    throw new Error(
      getErrorLog(
        `Shipping value ${goodwill.shippingCost} cannot exceed ${orderSummary.amountsAvailable.shipping} for orderId: ${orderId}`,
        'GW001'
      )
    )
  }

  for (const item of goodwill.items) {
    const itemOrder = order.items.find(
      (itemSummaryToLook) =>
        itemSummaryToLook.id === item.id ||
        itemSummaryToLook.sellerSku === item.id
    )

    if (itemOrder === undefined) {
      ctx.status = 400
      throw new Error(
        getErrorLog(
          `The item ${item.id} cannot be found on orderId: ${orderId}`,
          'GW004'
        )
      )
    }

    const itemSummary = orderSummary.items.find(
      (itemSummaryToLook) => itemSummaryToLook.id === item.id
    )

    if (!itemSummary) {
      ctx.status = 400
      throw new Error(
        getErrorLog(
          `Item Summary ${item.id} cannot be found on orderId: ${orderId}`,
          'GW008'
        )
      )
    }

    totalValueOrder += item.amount

    if (item.amount > itemSummary.amountAvailablePerItem.amount) {
      ctx.status = 400
      throw new Error(
        getErrorLog(
          `Item ${item.id} value ${item.amount} cannot exceed ${itemSummary.amountAvailablePerItem.amount} for orderId: ${orderId}`,
          'GW005'
        )
      )
    }
  }

  const amountAvailable =
    orderSummary.amountsAvailable.order + orderSummary.amountsAvailable.shipping

  if (goodwill.goodwillCreditAmount !== totalValueOrder) {
    ctx.status = 400

    throw new Error(
      getErrorLog(
        `Total value of goodWill ${totalValueOrder} not match with ${goodwill.goodwillCreditAmount} for items to orderId: ${orderId}`,
        'GW009'
      )
    )
  }

  if (totalValueOrder > amountAvailable) {
    ctx.status = 400

    throw new Error(
      getErrorLog(
        `Total value of goodWill ${totalValueOrder} cannot exceed ${amountAvailable} for orderId: ${orderId}`,
        'GW003'
      )
    )
  }
}

export default validateGoodwillRequest
