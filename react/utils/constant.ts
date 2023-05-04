export type OrderStatus = {
  label: string
  value: string
}

export const ORDER_STATUS: OrderStatus[] = [
  {
    label: 'Order accepted',
    value: 'f_creationDate'
  },
  {
    label: 'Partial invoiced',
    value: 'partial-invoiced'
  },
  {
    label: 'Invoiced',
    value: 'f_invoicedDate'
  }
]