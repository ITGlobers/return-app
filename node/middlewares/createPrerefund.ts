import { json } from 'co-body'
import { v4 as uuidv4 } from 'uuid'

export async function createPreRefund(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnRequest, oms },
  } = ctx

  const body = await json(ctx.req)

  const orderRequests = await returnRequest.search(
    {
      page: 1,
      pageSize: 100,
    },
    [
      'id',
      'orderId',
      'refundableAmount',
      'sequenceNumber',
      'refundableAmountTotals',
      'customerProfileData',
      'pickupReturnData',
      'refundPaymentData',
      'items',
      'refundData',
      'refundStatusData',
      'dateSubmitted',
      'cultureInfoData',
    ],
    'dateSubmitted DESC',
    `orderId=${body.orderId}`
  )

  const filterRequestsByAmount = orderRequests.filter(
    (request: any) => request.refundableAmount === body.amount
  )

  const filterRequestsByItems = filterRequestsByAmount.find((request: any) => {
    const itemsRequest = request.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
    }))

    const itemsBody = body.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
    }))

    return (
      itemsRequest.length === body.items.length &&
      itemsRequest.every(({ id, quantity }: any) => {
        const matchingItem = itemsBody.find((item: any) => item.id === id)

        return matchingItem && quantity === matchingItem.quantity
      })
    )
  })

  if (!filterRequestsByItems) {
    throw new Error('No matching request found')
  }

  const issuanceDate = new Date().toISOString()

  const preRefundData = {
    type: 'PreRefund',
    creditnoteID: uuidv4(),
    createdBy: 'CusCare',
    reason: body.reason,
  }

  await oms.createInvoice(body.orderId, {
    type: 'Input',
    issuanceDate,
    invoiceNumber: JSON.stringify(preRefundData),
    invoiceValue: body.amount as number,
    items: [],
  })

  await returnRequest.update(filterRequestsByItems.id, {
    ...filterRequestsByItems,
    status: 'preRefunded',
    preRefundData: JSON.stringify(preRefundData),
  })

  ctx.body = {
    message: 'The preRefund has been realized with success',
    ...preRefundData,
  }
  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')

  await next()
}
