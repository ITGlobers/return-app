export interface ordersGetSummary {
  orderId: string,
  creationDate: string,
  customer: string
}

export interface ordersToSummary{
  orderId: string,
  creationDate: string,
  customer: string
  hasRefunds: boolean
  hasAmount: boolean
}
