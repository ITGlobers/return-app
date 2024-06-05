interface UserProfile {
  email: string
  userId: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'store-user'
}

interface SessionData {
  id: string
  namespaces: {
    profile: ProfileSession
    authentication: AuthenticationSession
  }
}

interface ProfileSession {
  id?: {
    value: string
  }
  email?: {
    value: string
  }
  firstName?: {
    value: string
  }
  lastName?: {
    value: string
  }
}

interface AuthenticationSession {
  adminUserEmail?: {
    value: string
  }
  adminUserId?: {
    value: string
  }
}

interface OrderRefundDetails {
  id: string
  orderID: string
  initialInvoicedAmount: number
  totalRefunded?: number | undefined
  remainingRefundableAmount?: number | undefined
  amountToBeRefundedInProcess: number | undefined
  initialShippingCost?: number
  shippingCostToBeRefundedInProcess?: number | undefined
  totalShippingCostRefunded?: number | undefined
  remainingRefundableShippingCost?: number | undefined
  lastUpdated: Date
}

interface RefundPaymentData {
  transactionId?: string
  refundPaymentMethod: 'bank' | 'card' | 'giftCard' | 'sameAsPurchase'
}

interface Goodwill {
  id: string
  orderId: string
  sellerId: string
  status: 'draft' | 'failed' | 'amountRefunded'
  refundPaymentData?: RefundPaymentData
  goodwillCreditId: string
  goodwillCreditAmount: number
  shippingCost: number
  items: [GoodwillItem]
  reason: string
  logs: [GoodwillLog]
}

interface GoodwillItem {
  id: string
  amount: number
  description: string
}

interface GoodwillLog {
  detail: string
}

interface Invoice {
  type: 'Input' | 'Output'
  issuanceDate: string
  invoiceNumber: string
  invoiceValue: number
  invoiceKey: string
  description?: string
  items?: InvoiceItem[] | null
  restitutions: Restitutions
}

interface InvoiceItem {
  id: string
  description: string
  price: number
  quantity: number
}

interface Restitutions {
  Refund: Refund
}

interface Refund {
  value: number
  giftCardData: GiftCardData | null
  items: RefundItem[] | null
}

interface RefundItem {
  useFreight?: boolean
  id: string | null
  quantity: number
  price: number
  description: string
  isCompensation: boolean
  compensationValue: number
  itemIndex?: number | null
}
