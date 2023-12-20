import type { Logger } from '@vtex/api'
import type { MasterDataEntity } from '@vtex/clients'

import type {
  OrderRefundsSummary,
  OrderRefundsSummaryRefunds,
  OrderRefundsSummaryRefundsType,
} from '../../typings/OrderRefundsSummary'
import type { ReturnRequest } from '../../typings/ReturnRequest'
import {
  applyGoodwillDecrements,
  applyInvoiceDecrements,
  applyReturnDecrements,
  isGoodwillInstance,
  isReturnRequestInstance,
  mapGoodwillToOrderSummaryRefund,
  mapInvoiceRequestToOrderSummaryRefund,
  mapReturnRequestToOrderSummaryRefund,
} from '../utils/mapToOrderRefund'
import type { InvoiceRequest } from '../typings/InvoiceRequest'

type UpdateOrderRefundsSumaryServiceParams = {
  orderId: string
  refundToBeAdded: ReturnRequest | Goodwill | InvoiceRequest
  clients: {
    logger: Logger
    orderRefundsSummaryClient: MasterDataEntity<OrderRefundsSummary>
  }
}

export const updateOrderRefundsSumaryService = async (
  params: UpdateOrderRefundsSumaryServiceParams
): Promise<OrderRefundsSummary> => {
  const {
    clients: { logger, orderRefundsSummaryClient },
    refundToBeAdded,
    orderId,
  } = params

  logger.info(`Order Id ${orderId} summary will be updated`)

  const orderSummary = await orderRefundsSummaryClient.get(orderId, [
    'orderId',
    'orderValue',
    'refundable',
    'refunds',
    'id',
  ])

  if (orderSummary === undefined || orderSummary === null) {
    logger.error(`Order Id ${orderId} summary not found`)

    throw new Error(`Order Id ${orderId} summary not found`)
  }

  logger.debug(`Order Id ${orderId} summary ${JSON.stringify(orderSummary)}`)

  const isGoodwill = isGoodwillInstance(refundToBeAdded)
  const isReturnRequest = isReturnRequestInstance(refundToBeAdded)

  let newRefundState: OrderRefundsSummaryRefunds

  if (isGoodwill) {
    logger.info(
      `Order Id ${orderId} refund received ${JSON.stringify(
        refundToBeAdded
      )} is goodwill`
    )

    applyGoodwillDecrements(
      refundToBeAdded as Goodwill,
      orderSummary.refundable
    )
    newRefundState = mapGoodwillToOrderSummaryRefund(
      refundToBeAdded as Goodwill
    )
  } else if (isReturnRequest) {
    logger.info(
      `Order Id ${orderId} refund received ${JSON.stringify(
        refundToBeAdded
      )} is return`
    )

    applyReturnDecrements(
      refundToBeAdded as ReturnRequest,
      orderSummary.refundable
    )
    newRefundState = mapReturnRequestToOrderSummaryRefund(
      refundToBeAdded as ReturnRequest
    )
  } else {
    logger.info(
      `Order Id ${orderId} refund received ${JSON.stringify(
        refundToBeAdded
      )} is invoice`
    )

    applyInvoiceDecrements(
      refundToBeAdded as InvoiceRequest,
      orderSummary.refundable
    )
    newRefundState = mapInvoiceRequestToOrderSummaryRefund(
      refundToBeAdded as InvoiceRequest
    )
  }

  logger.info(
    `Order Id ${orderId} mapped request ${JSON.stringify(newRefundState)}`
  )

  const storedRefund = orderSummary.refunds.find((refund) => {
    if (refund.type === 'goodwill') {
      return (
        refund.id === newRefundState.id && refund.type === newRefundState.type
      )
    }

    const refundStatusses: OrderRefundsSummaryRefundsType[] = [
      'prerefund',
      'refund',
    ]

    if (refundStatusses.includes(refund.type)) {
      return (
        refund.id === newRefundState.id && refundStatusses.includes(refund.type)
      )
    }

    return refund.id === newRefundState.id && refund.type === 'invoice'
  })

  logger.info(
    `Order Id ${orderId} storedRefund ${JSON.stringify(storedRefund)}`
  )

  if (storedRefund) {
    storedRefund.status = newRefundState.status
    storedRefund.value = newRefundState.value
    storedRefund.type = newRefundState.type
  } else {
    orderSummary.refunds.push(newRefundState)
  }

  logger.debug(
    `Order Id ${orderId} summary request ${JSON.stringify(orderSummary)}`
  )

  await orderRefundsSummaryClient.saveOrUpdate(orderSummary)

  return orderSummary
}
