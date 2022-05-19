import type { ReturnRequest } from 'vtex.return-app'

type RequiredTotals = Required<
  Required<ReturnRequest>['refundableAmountTotals'][number]
>

interface Totals {
  [k: string]: unknown
  id: RequiredTotals['id']
  value: RequiredTotals['value']
}

export const createRefundableTotals = (
  itemsToReturn: ReturnRequest['items']
): Totals[] => {
  const itemsAmount =
    itemsToReturn?.reduce((total, item) => {
      const { quantity, sellingPrice } = item

      return total + (quantity ?? 0) * (sellingPrice ?? 0)
    }, 0) ?? 0

  const itemsTotal = { id: 'items' as const, value: itemsAmount }

  const taxAmount =
    itemsToReturn?.reduce((total, item) => {
      const { quantity, tax } = item

      return total + (quantity ?? 0) * (tax ?? 0)
    }, 0) ?? 0

  const taxTotal = { id: 'tax' as const, value: taxAmount }

  // TODO: Calculate shipping based on flag on admin (total or partial)
  const shippingTotal = { id: 'shipping' as const, value: 0 }

  return [itemsTotal, shippingTotal, taxTotal]
}
