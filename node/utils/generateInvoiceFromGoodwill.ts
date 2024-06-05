import OrderRefundsSummary from "../../typings/OrderRefundsSummary"

const generateInvoiceFromGoodwill = (goodwill: Goodwill, orderSummary: OrderRefundsSummary): Invoice => {
  const itemsToRefund = goodwill.items.map((item) => {
    const itemSummary = orderSummary.items.find(orderItem => orderItem.id === item.id);
    return ({
    useFreight: false,
    id: itemSummary?.sellerSku || item.id,
    quantity: 0,
    price: 0,
    description: item.description,
    isCompensation: true,
    compensationValue: item.amount,
  })
  }) as RefundItem[]

  const itemsToInvoice = goodwill.items.map((item) => {
    const itemSummary = orderSummary.items.find(orderItem => orderItem.id === item.id);
    return ({
      quantity: 0,
      price: 0,
      id: itemSummary?.sellerSku || item.id,
      description: item.description,

    })
  }) as InvoiceItem[]

  const invoices: Invoice = {
    type: 'Input',
    issuanceDate: new Date().toISOString(),
    invoiceNumber: goodwill.goodwillCreditId,
    invoiceValue: goodwill.goodwillCreditAmount,
    invoiceKey: JSON.stringify({ preRefund: false }),
    description: goodwill.reason,
    items: itemsToInvoice,
    restitutions: {
      Refund: {
        value: goodwill.goodwillCreditAmount,
        giftCardData: null,
        items: itemsToRefund,
      },
    },
  }

  if (goodwill.shippingCost > 0) {
    invoices.restitutions.Refund.items?.push({
      useFreight: true,
      id: null,
      quantity: 0,
      price: 0,
      description: 'Goodwill for shipping cost',
      isCompensation: true,
      compensationValue: goodwill.shippingCost,
    })
  }

  return invoices
}

export default generateInvoiceFromGoodwill
