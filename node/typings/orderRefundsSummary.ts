type OrderRefundsSummary = {
  readonly orderId: string
  readonly orderValue: number

  readonly refunds: Array<{
    readonly id: string
    readonly type: 'goodwill' | 'prerefund' | 'refund'
    readonly value: number
  }>
  readonly refundable: {
    readonly shipping: number
    readonly available: number
  }
}

export default OrderRefundsSummary
