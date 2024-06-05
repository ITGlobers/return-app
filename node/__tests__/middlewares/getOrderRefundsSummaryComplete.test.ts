import { getOrderRefundsSummaryComplete } from '../../middlewares/getOrderRefundsSummaryComplete'
import { getSummary } from '../../services/getSummary'

jest.mock('../../services/getSummary', () => ({
  getSummary: jest.fn(),
}))

describe('getOrderRefundsSummaryComplete', () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      vtex: {
        route: {
          params: {
            orderId: '12345',
          },
        },
      },
      body: null,
      status: null,
      set: jest.fn(),
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  it('should set ctx.body and ctx.status to 200', async () => {
    ;(getSummary as jest.Mock).mockResolvedValue({
      orderId: '12345',
      summary: 'order-summary',
    })

    await getOrderRefundsSummaryComplete(ctx)

    expect(ctx.body).toEqual({ orderId: '12345', summary: 'order-summary' })
    expect(ctx.status).toBe(200)
    expect(ctx.set).toHaveBeenCalledWith('Cache-Control', 'no-cache')
  })

  it('should handle errors from getSummary', async () => {
    const error = new Error('Something went wrong')
    ;(getSummary as jest.Mock).mockRejectedValue(error)

    await expect(getOrderRefundsSummaryComplete(ctx)).rejects.toThrow(
      'Something went wrong'
    )

    expect(ctx.body).toBeNull()
    expect(ctx.status).toBeNull()
  })
})
