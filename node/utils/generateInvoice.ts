import OrderRefundsSummary from '../../typings/OrderRefundsSummary'
import { InvoiceRequest } from '../typings/InvoiceRequest'

const generateInvoice = (
  orderSummary: OrderRefundsSummary,
  invoice: InvoiceRequest
): InvoiceRequest => {
  orderSummary.items.map(({ id, amountAvailablePerItem: { amount } }) => {
    const itemToUpdate = invoice.items.find(
      (invoiceDataItem) => id === invoiceDataItem.id
    )

    if (itemToUpdate) {
      let newAmountAvailablePerItem = amount - itemToUpdate.price

      if (newAmountAvailablePerItem < 0) {
        itemToUpdate.price = amount
        invoice.invoiceValue =
          Number(invoice.invoiceValue) + Number(newAmountAvailablePerItem)
      }
    }
  })

  return invoice
}

export default generateInvoice
