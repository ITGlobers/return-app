import type OrderRefundsSummary from '../../typings/OrderRefundsSummary'
import type { ReturnRequestInput } from '../../typings/ReturnRequest'
import type { InvoicetoSummary } from '../typings/InvoiceRequest'
import { getErrorLog } from '../utils/handleError'
import { mapToOrderSummary } from '../utils/mapToOrderSummary'

type ReturnRequestStatusUpdate = ReturnRequestInput & {
  statusTx: 'accepted' | 'denied' | 'pending'
}
type TransactionData =
  | ReturnRequestStatusUpdate
  | Goodwill
  | InvoicetoSummary
  | any

const returnOrderRefundsSummaryService = async (
  ctx: Context,
  transactionData: TransactionData & {
    type: 'GOODWILL' | 'RETURN_REQUEST' | 'INVOICE'
  },
  action: 'info' | 'denied' | 'get' | 'update' = 'get'
): Promise<OrderRefundsSummary> => {
  const {
    clients: { oms },
    vtex: { logger },
  } = ctx

  const [order] = await Promise.all([oms.order(transactionData.orderId)])

  let refundSummaryData: OrderRefundsSummary = await mapToOrderSummary(
    ctx,
    transactionData.orderId
  )

  if (action === 'get') {
    return refundSummaryData
  }

  if (action === 'denied' && refundSummaryData.transactions) {
    const goodwillData = transactionData as Goodwill
    const amountsAvailable = {
      order:
        refundSummaryData.amountsAvailable.order +
        (goodwillData.goodwillCreditAmount - goodwillData.shippingCost ?? 0),
      shipping:
        refundSummaryData.amountsAvailable.shipping + goodwillData.shippingCost,
    }

    const items = refundSummaryData.items.map((refundSummaryItems) => {
      const itemToUpdate = goodwillData.items.find(
        (goodwillDataItem) => refundSummaryItems.id === goodwillDataItem.id
      )

      if (itemToUpdate) {
        refundSummaryItems.amountAvailablePerItem.amount =
          refundSummaryItems.amountAvailablePerItem.amount + itemToUpdate.amount
      }

      return refundSummaryItems
    })

    const itemToUpdate = refundSummaryData.transactions.find(
      (transactions) => transactions.id === goodwillData.id
    )

    if (itemToUpdate) {
      itemToUpdate.status = 'denied'
    }

    refundSummaryData = {
      orderId: order.orderId,
      orderValue: refundSummaryData.orderValue,
      shippingValue: refundSummaryData.shippingValue,
      amountsAvailable,
      items,
      transactions: [...(refundSummaryData.transactions ?? [])],
    }

    return refundSummaryData
  }

  if (transactionData.type === 'GOODWILL') {
    const goodwillData = transactionData as Goodwill

    const amountsAvailable = {
      order:
        refundSummaryData.amountsAvailable.order -
        (goodwillData.goodwillCreditAmount - goodwillData.shippingCost ?? 0),
      shipping:
        refundSummaryData.amountsAvailable.shipping - goodwillData.shippingCost,
    }

    const items = refundSummaryData.items.map((refundSummaryItems) => {
      const itemToUpdate = goodwillData.items.find(
        (goodwillDataItem) => refundSummaryItems.id === goodwillDataItem.id
      )

      if (itemToUpdate) {
        refundSummaryItems.amountAvailablePerItem.amount =
          refundSummaryItems.amountAvailablePerItem.amount - itemToUpdate.amount
      }

      return refundSummaryItems
    })

    refundSummaryData = {
      orderId: order.orderId,
      orderValue: refundSummaryData.orderValue,
      shippingValue: refundSummaryData.shippingValue,
      amountsAvailable,
      items,
      transactions: [
        ...(refundSummaryData.transactions ?? []),
        {
          id: goodwillData.id,
          amount: goodwillData.goodwillCreditAmount,
          type: 'goodwill',
          status: 'accepted',
          metadata: JSON.stringify(goodwillData),
        },
      ],
    }
  } else if (transactionData.type === 'RETURN_REQUEST') {
    const returnData = transactionData as unknown as ReturnRequestStatusUpdate
    let returnAmount = 0

    const filteredItemsFromOrder = returnData.items.map((item) => {
      const mappedItem = {
        id: order.items[item.orderItemIndex].id,
        amount: order.items[item.orderItemIndex].sellingPrice * item.quantity,
        quantity: item.quantity,
      }
      returnAmount += mappedItem.amount

      return mappedItem
    })

    if (returnData.statusTx === 'pending' || returnData.statusTx === 'denied') {
      refundSummaryData = {
        orderId: order.orderId,
        orderValue: refundSummaryData.orderValue,
        shippingValue: refundSummaryData.shippingValue,
        amountsAvailable: refundSummaryData.amountsAvailable,
        items: refundSummaryData.items,
        transactions: [
          ...(refundSummaryData.transactions ?? []),
          {
            amount: returnAmount,
            type: 'refund',
            status: returnData.statusTx,
            metadata: JSON.stringify(returnData),
          },
        ],
      }
    } else if (returnData.statusTx === 'accepted') {
      const amountsAvailable = {
        ...refundSummaryData.amountsAvailable,
        order: refundSummaryData.amountsAvailable.order - returnAmount,
      }

      const items = refundSummaryData.items.map((refundSummaryItems) => {
        const itemToUpdate = filteredItemsFromOrder.find(
          (filteredItemFromOrder: { id: string }) =>
            refundSummaryItems.id === filteredItemFromOrder.id
        )

        if (itemToUpdate) {
          refundSummaryItems.amountAvailablePerItem.amount =
            refundSummaryItems.amountAvailablePerItem.amount -
            itemToUpdate.amount

          refundSummaryItems.amountAvailablePerItem.quantity =
            refundSummaryItems.amountAvailablePerItem.quantity -
            itemToUpdate.quantity
        }

        return refundSummaryItems
      })

      refundSummaryData = {
        orderId: order.orderId,
        orderValue: refundSummaryData.orderValue,
        shippingValue: refundSummaryData.shippingValue,
        amountsAvailable,
        items,
        transactions: [
          ...(refundSummaryData.transactions ?? []),
          {
            amount: returnAmount,
            type: 'refund',
            status: returnData.statusTx,
            metadata: JSON.stringify(returnData),
          },
        ],
      }
    }
  } else if (transactionData.type === 'INVOICE') {
    const { invoiceRequest } = transactionData as InvoicetoSummary

    if (refundSummaryData.transactions) {
      const exist = refundSummaryData.transactions.find(
        (transaction) => transaction.id === invoiceRequest.invoiceNumber
      )

      if (exist) {
        ctx.status = 400

        const errorMessage = getErrorLog(
          `Invoice already created for invoiceNumber: ${invoiceRequest.invoiceNumber}`,
          'INV001'
        )
        logger.error(errorMessage)
        throw new Error(errorMessage)
      }
    }

    let orderValueToRefund = 0

    const items = await Promise.all(
      refundSummaryData.items.map((refundSummaryItems) => {
        const itemToUpdate = invoiceRequest.items.find(
          (invoiceDataItem) =>
            refundSummaryItems.sellerSku === invoiceDataItem.id
        )
        if (itemToUpdate) {
          if (itemToUpdate.amount === undefined) {
            ctx.status = 400
            throw new Error(
              getErrorLog(
                `The field amount to item ${itemToUpdate.id} is required`,
                'INV007'
              )
            )
          }
          const newAmountAvailablePerItem =
            refundSummaryItems.amountAvailablePerItem.amount -
            itemToUpdate.amount

          const newQuantityAvailablePerItem =
            refundSummaryItems.amountAvailablePerItem.quantity -
            itemToUpdate.quantity

          if (newQuantityAvailablePerItem < 0) {
            ctx.status = 400

            throw new Error(
              getErrorLog(
                `The quantity to be returned to the item ${itemToUpdate.id} is not valid, it is greater than the available`,
                'INV002'
              )
            )
          }
          if (itemToUpdate.amount < 0 || newAmountAvailablePerItem < 0) {
            ctx.status = 400
            const errorMessage = getErrorLog(
              `The amount to be returned to the item ${itemToUpdate.id} is not valid`,
              'INV003'
            )

            logger.error(errorMessage)
            throw new Error(errorMessage)
          }
          orderValueToRefund += itemToUpdate.amount

          refundSummaryItems.amountAvailablePerItem.amount =
            newAmountAvailablePerItem

          refundSummaryItems.amountAvailablePerItem.quantity =
            newQuantityAvailablePerItem
        }

        return refundSummaryItems
      })
    )

    let shippingValueToRefund = invoiceRequest.invoiceValue - orderValueToRefund

    const totalavailable =
      orderValueToRefund + refundSummaryData.amountsAvailable.shipping

    if (invoiceRequest.invoiceValue < 0) {
      ctx.status = 400
      const errorMessage = getErrorLog(
        `The invoice value cant be negative`,
        'INV004'
      )

      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (
      invoiceRequest.invoiceValue < orderValueToRefund ||
      invoiceRequest.invoiceValue > totalavailable
    ) {
      ctx.status = 400
      const errorMessage = getErrorLog(
        `The invoice value to be refunded is not available`,
        'INV005'
      )

      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (shippingValueToRefund > refundSummaryData.amountsAvailable.shipping) {
      ctx.status = 400
      const errorMessage = getErrorLog(
        `The shipping value to be refunded is greater than the available`,
        'INV006'
      )

      logger.error(errorMessage)
      throw new Error(errorMessage)
    }

    const amountsAvailable = {
      order: refundSummaryData.amountsAvailable.order - orderValueToRefund,
      shipping:
        refundSummaryData.amountsAvailable.shipping - shippingValueToRefund,
    }
    refundSummaryData = {
      orderId: order.orderId,
      orderValue: refundSummaryData.orderValue,
      shippingValue: refundSummaryData.shippingValue,
      amountsAvailable,
      items,
      transactions: [
        ...(refundSummaryData.transactions ?? []),
        {
          id: invoiceRequest.invoiceNumber,
          amount: Number(invoiceRequest.invoiceValue),
          type: 'invoice',
          status: 'accepted',
          metadata: JSON.stringify(invoiceRequest),
        },
      ],
    }

    return refundSummaryData
  } else {
    ctx.status = 400

    throw new Error('RR002')
  }

  logger.debug(`refundSummaryData => ${JSON.stringify(refundSummaryData)}`)

  return refundSummaryData
}

export default returnOrderRefundsSummaryService
