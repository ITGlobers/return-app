import { UserInputError, ResolverError } from '@vtex/api'

import returnOrderRefundsSummaryService from './returnOrderRefundsSummaryService'
import { validateOrderId } from '../utils/validateOrderId'
import type {
  InvoiceRequest,
  InvoicetoSummary,
} from '../typings/InvoiceRequest'

export const updateInvoiceService = async (
  ctx: Context,
  id: string | string[],
  args: InvoiceRequest
) => {
  const {
    vtex: { logger },
  } = ctx
  const orderId = String(id)
  const { items } = args

  // Check items since a request via endpoint might not have it.
  // Graphql validation doesn't prevent user to send empty items
  if (!items || items.length === 0) {
    throw new UserInputError('There are no items in the request')
  }

  // For requests where orderId is an empty string
  if (!orderId) {
    throw new UserInputError('Order ID is missing')
  }

  try {
    const invoicetoSummary: InvoicetoSummary = {
      orderId: validateOrderId(orderId),
      invoiceRequest: args,
    }

    await returnOrderRefundsSummaryService(
      ctx,
      {
        ...invoicetoSummary,
        type: 'INVOICE',
      },
      'update'
    )

    return true
  } catch (error) {
    logger.error(error)

    if (error.response?.data) {
      throw new ResolverError(`${error.response?.data?.error?.message}`, 400)
    }

    throw new ResolverError(`${error.message}`, 400)
  }
}
