import type { MasterDataEntity } from '@vtex/clients'
import type { Logger } from '@vtex/api'

import type {
  OrderRefundsSummary,
  OrderRefundsSummaryRefundable,
  OrderRefundsSummaryRefunds,
} from '../../typings/OrderRefundsSummary'
import type { ReturnRequest } from '../../typings/ReturnRequest'
import type { OMSCustom } from '../clients/oms'

const masterdataPagination = { page: 1, pageSize: 100 }

const returnStatussesMap: Record<
  ReturnRequest['status'],
  OrderRefundsSummaryRefunds['status']
> = {
  new: 'pending',
  amountRefunded: 'applied',
  canceled: 'rejected',
  denied: 'rejected',
  packageVerified: 'pending',
  pendingVerification: 'pending',
  pickedUpFromClient: 'pending',
  processing: 'pending',
}

const goodwillStatussesMap: Record<
  Goodwill['status'],
  OrderRefundsSummaryRefunds['status']
> = {
  amountRefunded: 'applied',
  new: 'pending',
  processing: 'pending',
}

type ReturnOrderRefundsSumaryServiceParams = {
  orderId: string
  clients: {
    logger: Logger
    orderRefundsSummaryClient: MasterDataEntity<OrderRefundsSummary>
    omsClient: OMSCustom
    returnRequestClient: MasterDataEntity<ReturnRequest>
    goodwillClient: MasterDataEntity<Goodwill>
  }
}

const generateOrderRefundsSummary = async ({
  clients,
  orderId,
}: ReturnOrderRefundsSumaryServiceParams): Promise<OrderRefundsSummary> => {
  const { goodwillClient, logger, omsClient, returnRequestClient } = clients

  const [orderReturns, orderFound, orderGoodwills] = await Promise.all([
    returnRequestClient
      .search(
        masterdataPagination,
        [
          'id',
          'orderId',
          'refundableAmount',
          'refundableAmountTotals',
          'status',
          'refundStatusData',
        ],
        'createdIn DESC',
        `orderId=${orderId}`
      )
      .then((refunds) => refunds as ReturnRequest[]),

    omsClient.order(orderId),

    goodwillClient
      .search(
        masterdataPagination,
        [
          'creditnoteID',
          'sellerId',
          'status',
          'creditAmount',
          'reason',
          'refundPaymentData',
          'id',
        ],
        undefined,
        `id=${orderId}`
      )
      .then((goodwills) => goodwills as Goodwill[]),
  ])

  logger.info(
    `Order Id ${orderId} orderReturns: ${JSON.stringify(orderReturns)}`
  )
  logger.info(
    `Order Id ${orderId} orderGoodwills: ${JSON.stringify(orderGoodwills)}`
  )

  const orderItemsTotal =
    orderFound.totals.find((total) => total.id === 'Items')?.value ?? 0

  const orderShippingTotal =
    orderFound.totals.find((total) => total.id === 'Shipping')?.value ?? 0

  logger.info(
    `Order Id ${orderId} orderItemsTotal: ${JSON.stringify(orderItemsTotal)}`
  )

  logger.info(
    `Order Id ${orderId} orderShippingTotal: ${JSON.stringify(
      orderShippingTotal
    )}`
  )

  const refundableTotals: OrderRefundsSummaryRefundable = {
    available: orderItemsTotal,
    shipping: orderShippingTotal,
  }

  const refunds: OrderRefundsSummaryRefunds[] = []

  for (const refund of orderReturns) {
    if (refund.status === 'amountRefunded') {
      refundableTotals.available -=
        refund.refundableAmountTotals.find((total) => total.id === 'items')
          ?.value ?? 0
      refundableTotals.shipping -=
        refund.refundableAmountTotals.find((total) => total.id === 'shipping')
          ?.value ?? 0
    }

    const isRefund = refund.refundStatusData.find(
      (statusData) => statusData.status === 'packageVerified'
    )

    refunds.push({
      id: String(refund.id),
      type: isRefund ? 'refund' : 'prerefund',
      value: Number(refund.refundableAmount),
      status: returnStatussesMap[refund.status],
    })
  }

  for (const goodwill of orderGoodwills) {
    if (goodwill.status === 'amountRefunded') {
      refundableTotals.available -= goodwill.creditAmount
    }

    refunds.push({
      id: String(goodwill.creditnoteID),
      type: 'goodwill',
      value: Number(goodwill.creditAmount),
      status: goodwillStatussesMap[goodwill.status],
    })
  }

  logger.info(`Order Id ${orderId} refunds: ${JSON.stringify(refunds)}`)

  logger.info(
    `Order Id ${orderId} refundableTotals: ${JSON.stringify(refundableTotals)}`
  )

  const orderRefundSummary: OrderRefundsSummary = {
    orderId,
    orderValue: orderItemsTotal,
    refundable: refundableTotals,
    refunds,
  }

  logger.info(
    `Order Id ${orderId} orderRefundSummary: ${JSON.stringify(
      orderRefundSummary
    )}`
  )

  return orderRefundSummary
}

const returnOrderRefundsSumaryService = async (
  params: ReturnOrderRefundsSumaryServiceParams
): Promise<OrderRefundsSummary | null> => {
  const {
    clients: { logger, orderRefundsSummaryClient },
    orderId,
  } = params

  try {
    logger.info(`Order Id ${orderId} Summary requested`)

    logger.debug(
      `Order Id ${orderId} Masterdata Search Params: ${JSON.stringify(
        masterdataPagination
      )}`
    )

    const refundSummaries = await orderRefundsSummaryClient.search(
      masterdataPagination,
      ['orderId', 'orderValue', 'refundable', 'refunds'],
      undefined,
      `orderId=${orderId}`
    )

    logger.info(
      `Order Id ${orderId} Refund Summaries found: ${JSON.stringify(
        refundSummaries
      )}`
    )

    const orderRefundSummary =
      refundSummaries.length === 0
        ? await generateOrderRefundsSummary(params)
        : refundSummaries[0]

    return orderRefundSummary
  } catch (e) {
    logger.error(`Refund Summaries error => ${e}`)

    return null
  }
}

export default returnOrderRefundsSumaryService
