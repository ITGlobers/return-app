import { UserInputError } from '@vtex/api'

import { SETTINGS_PATH } from '../utils/constants'
import type {
  InvoiceRequest,
  InvoicetoSummary,
} from '../typings/InvoiceRequest'
import returnOrderRefundsSummaryService from './returnOrderRefundsSummaryService'
import { validateOrderId } from '../utils/validateOrderId'

export const createInvoice = async (
  ctx: Context,
  id: string | string[],
  args: InvoiceRequest
) => {
  console.info('🚀 ~ args:', args)
  const {
    clients: { oms, appSettings },
  } = ctx

  const orderId = String(id)
  const { type, items } = args

  // Check items since a request via endpoint might not have it.
  // Graphql validation doesn't prevent user to send empty items
  if (!items || items.length === 0) {
    throw new UserInputError('There are no items in the request')
  }

  // For requests where orderId is an empty string
  if (!orderId) {
    throw new UserInputError('Order ID is missing')
  }

  // For requests where type is not correct
  if (type !== 'Input' && type !== 'Output') {
    throw new UserInputError('Required type Input or Output')
  }

  const orderPromise = oms.order(validateOrderId(orderId), 'AUTH_TOKEN')

  const settingsPromise = appSettings.get(SETTINGS_PATH, true)

  // If order doesn't exist, it throws an error and stop the process.
  // If there is no request created for that order, request searchRMA will be an empty array.
  const [settings] = await Promise.all([orderPromise, settingsPromise])

  if (!settings) {
    // throw new ResolverError('Return App settings is not configured', 500)
  }

  if (args.type === 'Input') {
    let invoiceRequest = args
    const invoicetoSummary: InvoicetoSummary = {
      orderId: validateOrderId(orderId),
      invoiceRequest: invoiceRequest,
    }

    const refundsSummaryService = await returnOrderRefundsSummaryService(
      ctx,
      {
        ...invoicetoSummary,
        type: 'INVOICE',
      },
      'info'
    )

    const items = args.items.map((item) => {
      const itemSummary = refundsSummaryService.items.find(
        (orderItem) => orderItem.id === item.id
      )

      const description = JSON.stringify({
        amount: item.amount,
        returnReason: item.description,
      })

      return {
        id: itemSummary?.sellerSku || item.id,
        description,
        price: 0,
        quantity: item.quantity,
      }
    })

    const invoiceSeller = {
      type: 'Input',
      issuanceDate: args.issuanceDate,
      invoiceNumber: args.invoiceNumber,
      invoiceValue: args.invoiceValue,
      invoiceKey: args.invoiceKey,
      items,
    }

    return { refundsSummaryService, invoiceSeller }
  }

  return true
}
