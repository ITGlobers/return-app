export type OrderStatus = {
  label: string
  value: string
}

export const ORDER_STATUS: OrderStatus[] = [
  {
    label: 'Creation',
    value: 'f_creationDate'
  },
  {
    label: 'Authorized',
    value: 'f_authorizedDate'
  },
  {
    label: 'Invoiced',
    value: 'f_invoicedDate'
  }
]