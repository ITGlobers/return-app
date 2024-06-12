export type OrderRefundsSummaryRefundsStatus =
  | 'pending'
  | 'accepted'
  | 'denied'

export type OrderRefundsSummaryRefundsType = 
  | 'goodwill' 
  | 'prerefund' 
  | 'refund' 
  | 'invoice'

export type OrderRefundsSummaryRefunds = {
  id: string
  type: OrderRefundsSummaryRefundsType
  status: OrderRefundsSummaryRefundsStatus
  value: number
}

export type OrderRefundsSummaryRefundable = {
  shipping: number
  items: number
}

export type OrderRefundsSummary = {
  orderId: string
  orderValue: number

  refunds: OrderRefundsSummaryRefunds[]
  refundable: OrderRefundsSummaryRefundable
}
