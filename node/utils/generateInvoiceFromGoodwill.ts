
const generateInvoiceFromGoodwill = (goodwill: Goodwill): Invoice => {
  const itemsToInvoice = goodwill.items.map((item) => ({
    useFreight: false,
    id: item.id,
    quantity: 0,
    price: 0,
    description: item.description,
    isCompensation: true,
    compensationValue: item.amount,
  })) as RefundItem[]

  const invoices: Invoice = {
    type: 'Input',
    issuanceDate: new Date().toISOString(),
    invoiceNumber: goodwill.goodwillCreditId,
    invoiceValue: goodwill.goodwillCreditAmount,
    invoiceKey: JSON.stringify({ preRefund: false }),
    description: goodwill.reason,
    restitutions: {
      Refund: {
        value: goodwill.goodwillCreditAmount,
        giftCardData: null,
        items: itemsToInvoice,
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
