// @ts-nocheck

import type {
  OrderRefundsSummary,
  OrderRefundsSummaryRefundable,
  OrderRefundsSummaryRefunds,
} from '../../typings/OrderRefundsSummary'
import type {
  ReturnRequest,
  ReturnRequestStatus,
} from '../../typings/ReturnRequest'
import type { InvoiceRequest } from '../typings/InvoiceRequest'

const returnStatussesMap: Record<
  ReturnRequest['status'],
  OrderRefundsSummaryRefunds['status']
> = {
  new: 'pending',
  amountRefunded: 'accepted',
  canceled: 'denied',
  denied: 'denied',
  packageVerified: 'pending',
  pendingVerification: 'pending',
  pickedUpFromClient: 'pending',
  processing: 'pending',
}

const goodwillStatussesMap: Record<
  Goodwill['status'],
  OrderRefundsSummaryRefunds['status']
> = {
  amountRefunded: 'accepted',
  draft: 'pending',
  failed: 'pending',
}

export const mapReturnRequestToOrderSummaryRefund = (
  returnRequest: ReturnRequest
): OrderRefundsSummaryRefunds => {
  const currentRefundStatusData: ReturnRequestStatus[] = [
    'new',
    'processing',
    'pickedUpFromClient',
  ]

  const isRefund =
    // when the request is just created, is being processed or started the whole return process
    currentRefundStatusData.includes(returnRequest.status) ||
    // or in the history includes some status from the whole return process
    returnRequest.refundStatusData.some(
      (statusData) => statusData.status === 'pickedUpFromClient'
    )

  return {
    id: String(returnRequest.id),
    // refund is the usual way to return a product, prerefund is secondary
    type: isRefund ? 'refund' : 'prerefund',
    value: returnRequest.refundableAmount,
    status: returnStatussesMap[returnRequest.status],
  } as OrderRefundsSummaryRefunds
}

export const mapGoodwillToOrderSummaryRefund = (
  goodwill: Goodwill
): OrderRefundsSummaryRefunds => {
  return {
    id: goodwill.goodwillCreditId,
    type: 'goodwill',
    value: goodwill.goodwillCreditAmount,
    status: goodwillStatussesMap[goodwill.status],
  }
}

export const mapInvoiceRequestToOrderSummaryRefund = (
  invoiceRequest: InvoiceRequest
): OrderRefundsSummaryRefunds => {
  return {
    id: invoiceRequest.invoiceNumber,
    type: 'invoice',
    value: invoiceRequest.invoiceValue,
    status: 'accepted',
  }
}

export const applyReturnDecrements = (
  returnRequest: ReturnRequest,
  refundableTotals: OrderRefundsSummaryRefundable
) => {
  if (returnRequest.status === 'amountRefunded') {
    refundableTotals.items -=
      returnRequest.refundableAmountTotals.find((total) => total.id === 'items')
        ?.value ?? 0
    refundableTotals.shipping -=
      returnRequest.refundableAmountTotals.find(
        (total) => total.id === 'shipping'
      )?.value ?? 0
  }

  return refundableTotals
}

export const applyGoodwillDecrements = (
  goodwill: Goodwill,
  refundableTotals: OrderRefundsSummaryRefundable
) => {
  if (goodwill.status === 'amountRefunded') {
    refundableTotals.items -= goodwill.goodwillCreditAmount
  }

  return refundableTotals
}

export const applyInvoiceDecrements = (
  invoiceRequest: InvoiceRequest,
  refundableTotals: OrderRefundsSummaryRefundable
) => {
  if (invoiceRequest.type === 'Input') {
    refundableTotals.items -= invoiceRequest.invoiceValue
  }
}

export const isGoodwillInstance = (object: unknown): object is Goodwill =>
  typeof object === 'object' && object !== null && 'creditnoteID' in object

export const isReturnRequestInstance = (
  object: unknown
): object is ReturnRequest =>
  typeof object === 'object' &&
  object !== null &&
  'refundableAmountTotals' in object

export const isOrderSummary = (
  object: unknown
): object is OrderRefundsSummary =>
  typeof object === 'object' && object !== null && 'refundable' in object
