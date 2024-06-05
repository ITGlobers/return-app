import { updateInvoice } from '../../middlewares/updateInvoice'
import { updateInvoiceService } from '../../services/updateInvoiceService'
import { InvoiceRequest } from '../../typings/InvoiceRequest'
import { json } from 'co-body'

jest.mock('co-body', () => ({
  json: jest.fn(),
}))
jest.mock('../../services/updateInvoiceService', () => ({
  updateInvoiceService: jest.fn(),
}))

describe('updateInvoice', () => {
  let ctx: any

  beforeEach(() => {
    ctx = {
      req: {},
      vtex: {
        route: {
          params: { orderId: 'testOrderId' },
        },
      },
      body: {},
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call updateInvoiceService with correct arguments and set response to ctx.body', async () => {
    ;(json as jest.Mock).mockResolvedValue({
      orderId: 'testOrderId',
      type: 'exampleType',
      items: [
        {
          id: '',
          description: '',
          price: 0,
          amount: 0,
          quantity: 0,
          isCompensation: false,
          compensationValue: 0,
        },
      ],
      issuanceDate: '2022-06-01',
      invoiceNumber: 'INV-001',
      invoiceValue: 100,
      invoiceKey: 'invoiceKey',
      invoiceUrl: 'http://example.com/invoice',
      courier: 'Courier Name',
      trackingNumber: '123456789',
      trackingUrl: 'http://example.com/tracking',
      dispatchDate: '2022-06-02',
      restitutions: {
        Refund: {
          value: 0,
          giftCardData: '',
          items: {
            id: '',
            description: '',
            price: 0,
            amount: 0,
            quantity: 0,
            isCompensation: false,
            compensationValue: 0,
          },
        },
      },
      seller: 'sellerName',
    })
    const mockInvoiceRequest: InvoiceRequest = {
      orderId: 'testOrderId',
      type: 'exampleType',
      items: [
        {
          id: '',
          description: '',
          price: 0,
          amount: 0,
          quantity: 0,
          isCompensation: false,
          compensationValue: 0,
        },
      ],
      issuanceDate: '2022-06-01',
      invoiceNumber: 'INV-001',
      invoiceValue: 100,
      invoiceKey: 'invoiceKey',
      invoiceUrl: 'http://example.com/invoice',
      courier: 'Courier Name',
      trackingNumber: '123456789',
      trackingUrl: 'http://example.com/tracking',
      dispatchDate: '2022-06-02',
      restitutions: {
        Refund: {
          value: 0,
          giftCardData: '',
          items: {
            id: '',
            description: '',
            price: 0,
            amount: 0,
            quantity: 0,
            isCompensation: false,
            compensationValue: 0,
          },
        },
      },
      seller: 'sellerName',
    }
    ;(updateInvoiceService as jest.Mock).mockResolvedValue(null)

    await updateInvoice(ctx)

    expect(updateInvoiceService).toHaveBeenCalledWith(
      ctx,
      'testOrderId',
      mockInvoiceRequest
    )
    expect(ctx.body).toBeDefined()
  })
})
