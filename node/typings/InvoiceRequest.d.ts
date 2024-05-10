export type InvoicetoSummary = {
  orderId: string
  invoiceRequest: InvoiceRequest
}

export interface InvoiceRequest {
  orderId: string
  type: string
  items: Item[]
  issuanceDate: string
  invoiceNumber: string
  invoiceValue: number
  invoiceKey: string
  invoiceUrl: string
  courier: string
  trackingNumber: string
  trackingUrl: string
  dispatchDate: string | null | undefined
  restitutions: Restitutions
  seller: string
}

export interface Restitutions {
  Refund: Refund
}

export interface Refund {
  value: number
  giftCardData: string
  items: Item
}

export interface Item {
  id: string
  description: string
  price: number
  amount: number
  quantity: number
  isCompensation: boolean
  compensationValue: number
}

export interface InvoiceResponse {
  date: string
  orderId: string
  receipt: string
}
