export type OrderRefundsSummaryRefunds = {
  id: string
  type: 'goodwill' | 'prerefund' | 'refund'
  value: number
}

export type OrderRefundsSummary = {
  orderId: string
  orderValue: number

  refunds: OrderRefundsSummaryRefunds[]
  refundable: {
    shipping: number
    available: number
  }
}
