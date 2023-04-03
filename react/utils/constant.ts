export type OrderStatus = {
  label: string
  value: string
}

export const ORDER_STATUS: OrderStatus[] = [
  {
    label: 'Payment approved',
    value: 'payment-approved'
  },
  {
    label: 'Waiting for Fulfillment',
    value: 'waiting-for-fulfillment'
  },
  {
    label: 'Authorize Fulfillment',
    value: 'authorize-fulfillment'
  },
  {
    label: 'Invoiced',
    value: 'invoiced'
  },
  {
    label: 'Ready for handling',
    value: 'ready-for-handling'
  },
  {
    label: 'Start handling',
    value: 'start-handling'
  }
]