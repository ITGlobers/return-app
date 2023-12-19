export type OrderRefundsSummaryRefundsStatus =
  | 'pending'
  | 'applied'
  | 'rejected'
export type OrderRefundsSummaryRefundsType = 'goodwill' | 'prerefund' | 'refund'

export type OrderRefundsSummaryRefunds = {
  id: string
  type: OrderRefundsSummaryRefundsType
  status: OrderRefundsSummaryRefundsStatus
  value: number
}

export type OrderRefundsSummaryRefundable = {
  shipping: number
  available: number
}

export type OrderRefundsSummary = {
  orderId: string
  orderValue: number

  refunds: OrderRefundsSummaryRefunds[]
  refundable: OrderRefundsSummaryRefundable
}
