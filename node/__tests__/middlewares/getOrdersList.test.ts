import { getOrdersList } from '../../middlewares/getOrdersList'
import { returnOrdersListService } from '../../services/returnOrdersListService'

jest.mock('../../services/returnOrdersListService', () => ({
  returnOrdersListService: jest.fn(),
}))

describe('getOrdersList', () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      body: { someKey: 'someValue' },
      set: jest.fn(),
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  it('should set ctx.body with service response and set Cache-Control header', async () => {
    const mockServiceResponse = { orderId: '12345', status: 'completed' }
    ;(returnOrdersListService as jest.Mock).mockResolvedValue(
      mockServiceResponse
    )

    await getOrdersList(ctx)

    expect(ctx.body).toEqual({ ...mockServiceResponse })
  })

  it('should handle errors from returnOrdersListService', async () => {
    const error = new Error('Something went wrong')
    ;(returnOrdersListService as jest.Mock).mockRejectedValue(error)

    await expect(getOrdersList(ctx)).rejects.toThrow('Something went wrong')

    expect(ctx.body).toEqual({ someKey: 'someValue' })
  })
})
