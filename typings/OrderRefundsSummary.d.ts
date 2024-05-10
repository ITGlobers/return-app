export type OrderRefundsSummaryItem = {
  id: string
  unitCost: number
  quantity: number
  amount: number
  amountAvailablePerItem: {
    amount: number
    quantity: number
  }
  name?: string
  image?: string
}

export type Transaction = {
  amount: number
  id?: string
  type?: string
  status?: 'pending' | 'accepted' | 'denied'
  metadata?: string
}

type OrderRefundsSummary = {
  id?: string
  orderId: string
  orderValue: number
  shippingValue: number
  amountsAvailable: {
    order: number
    shipping: number
  }
  items: OrderRefundsSummaryItem[]
  transactions?: Transaction[]
  creationDate?: string
}

export default OrderRefundsSummary
