import invoice from '../../middlewares/invoice'
import { createInvoice } from '../../services/createInvoice'
import { json } from 'co-body'
import { ExternalLogSeverity } from '../../middlewares/errorHandler'

jest.mock('../../services/createInvoice', () => ({
  createInvoice: jest.fn(),
}))

jest.mock('co-body', () => ({
  json: jest.fn(),
}))

describe('invoice', () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      req: {},
      vtex: {
        route: {
          params: {
            orderId: '12345',
          },
        },
      },
      state: {
        logs: [],
      },
      body: null,
      set: jest.fn(),
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  it('should set ctx.body with service response, log the request, and set Cache-Control header', async () => {
    const mockServiceResponse = { invoiceId: '67890' }
    const mockRequestBody = { item: 'test' }

    ;(json as jest.Mock).mockResolvedValue(mockRequestBody)
    ;(createInvoice as jest.Mock).mockResolvedValue(mockServiceResponse)

    await invoice(ctx, next)

    expect(json).toHaveBeenCalledWith(ctx.req)
    expect(ctx.state.logs).toEqual([
      {
        message: 'Request received',
        middleware: 'Middleware create invoice',
        severity: ExternalLogSeverity.INFO,
        payload: {
          details: 'Body of the request captured',
          stack: JSON.stringify(mockRequestBody),
        },
      },
    ])
    expect(createInvoice).toHaveBeenCalledWith(ctx, '12345', mockRequestBody)
    expect(ctx.body).toEqual(mockServiceResponse)
    expect(ctx.set).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should handle errors from createInvoice', async () => {
    const error = new Error('Something went wrong')
    const mockRequestBody = { item: 'test' }

    ;(json as jest.Mock).mockResolvedValue(mockRequestBody)
    ;(createInvoice as jest.Mock).mockRejectedValue(error)

    await expect(invoice(ctx, next)).rejects.toThrow('Something went wrong')

    expect(ctx.body).toBeNull()
    expect(ctx.set).not.toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(next).not.toHaveBeenCalled()
  })
})
