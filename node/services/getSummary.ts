import { validateOrderId } from '../utils/validateOrderId'
import returnOrderRefundsSummaryService from './returnOrderRefundsSummaryService'
import { OrderDetailResponse } from '@vtex/clients'

export const getSummary = async (
  ctx: Context,
  orderId: string
) => {
  try {
    const {
      clients: { oms },
    } = ctx

    const order: OrderDetailResponse = await oms.order(validateOrderId(orderId))

    const orderSummary = await returnOrderRefundsSummaryService(
      ctx,
      {
        ...order,
        type: 'GET',
      },
      'get'
    )
    orderSummary.items.map(async (item: any) => {
      const orderItem = await order.items.find((itemOrder: any) =>
      itemOrder.id == item.id
      )
      item.name = orderItem?.name
      item.image = orderItem?.imageUrl
    })
    const response =  {
      ... await orderSummary,
        creationDate:  order.creationDate,
      }
    return response
  } catch (e) {
    throw new Error('Error getSummary')
  }
}

