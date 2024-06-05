import { getOrderRefundsSummary } from '../../middlewares/getOrderRefundsSummary'
import { mapToOrderSummary } from '../../utils/mapToOrderSummary'

jest.mock('../../utils/mapToOrderSummary', () => ({
  mapToOrderSummary: jest.fn(),
}))

describe('getOrderRefundsSummary', () => {
  let ctx: any

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

    jest.clearAllMocks()
  })

  it('should set ctx.body and ctx.status to 200', async () => {
    ;(mapToOrderSummary as jest.Mock).mockResolvedValue({
      orderId: '12345',
      summary: 'order-summary',
    })

    await getOrderRefundsSummary(ctx)

    expect(ctx.body).toEqual({ orderId: '12345', summary: 'order-summary' })
    expect(ctx.status).toBe(200)
    expect(ctx.set).toHaveBeenCalledWith('Cache-Control', 'no-cache')
  })

  it('should handle errors from mapToOrderSummary', async () => {
    const error = new Error('Something went wrong')
    ;(mapToOrderSummary as jest.Mock).mockRejectedValue(error)

    await expect(getOrderRefundsSummary(ctx)).rejects.toThrow(
      'Something went wrong'
    )

    expect(ctx.body).toBeNull()
    expect(ctx.status).toBeNull()
  })
})
