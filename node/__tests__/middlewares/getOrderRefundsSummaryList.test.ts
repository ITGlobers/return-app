import { json } from 'co-body'
import { getOrderRefundsSummaryList } from '../../middlewares/getOrderRefundsSummaryList'
import { getSummary } from '../../services/getSummary'
import { ordersGetSummary } from '../../typings/types'

jest.mock('co-body', () => ({
  json: jest.fn(),
}))

jest.mock('../../services/getSummary', () => ({
  getSummary: jest.fn(),
}))

describe('getOrderRefundsSummaryList', () => {
  let ctx: any

  beforeEach(() => {
    ctx = {
      req: {},
      body: null,
      status: null,
      set: jest.fn(),
    }

    jest.clearAllMocks()
  })

  it('should set ctx.body and ctx.status to 200 with proper data', async () => {
    const mockOrders: ordersGetSummary[] = [
      {
        orderId: 'order1',
        creationDate: '',
        customer: '',
      },
      {
        orderId: 'order2',
        creationDate: '',
        customer: '',
      },
    ]

    const mockResponse = {
      items: [{ amountAvailablePerItem: { quantity: 1 } }],
      amountsAvailable: {
        shipping: 0,
        order: 0,
      },
      transactions: [],
    }

    ;(json as jest.Mock).mockResolvedValue(mockOrders)
    ;(getSummary as jest.Mock).mockResolvedValue(mockResponse)

    await getOrderRefundsSummaryList(ctx)

    expect(ctx.body).toEqual([
      {
        orderId: 'order1',
        creationDate: '',
        customer: '',
        hasRefunds: false,
        hasAmount: true,
      },
      {
        orderId: 'order2',
        creationDate: '',
        customer: '',
        hasRefunds: false,
        hasAmount: true,
      },
    ])
    expect(ctx.status).toBe(200)
    expect(ctx.set).toHaveBeenCalledWith('Cache-Control', 'no-cache')
  })

  it('should handle errors from getSummary', async () => {
    const mockOrders: ordersGetSummary[] = [
      {
        orderId: 'order1',
        creationDate: '',
        customer: '',
      },
    ]

    const error = new Error('Something went wrong')
    ;(json as jest.Mock).mockResolvedValue(mockOrders)
    ;(getSummary as jest.Mock).mockRejectedValue(error)

    await expect(getOrderRefundsSummaryList(ctx)).rejects.toThrow(
      'Something went wrong'
    )

    expect(ctx.body).toBeNull()
    expect(ctx.status).toBeNull()
  })
})
