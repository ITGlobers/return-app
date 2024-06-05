import { getRequest } from '../../middlewares/getRequest'
import { returnRequestService } from '../../services/returnRequestService'

jest.mock('../../services/returnRequestService', () => ({
  returnRequestService: jest.fn(),
}))

describe('getRequest', () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      vtex: {
        route: {
          params: {
            requestId: 'test-request-id',
          },
        },
      },
      set: jest.fn(),
      body: null,
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  it('should set ctx.body with service response and set Cache-Control header', async () => {
    const mockServiceResponse = { id: 'test-request-id', status: 'completed' }
    ;(returnRequestService as jest.Mock).mockResolvedValue(mockServiceResponse)

    await getRequest(ctx)

    expect(returnRequestService).toHaveBeenCalledWith(ctx, 'test-request-id')
    expect(ctx.body).toEqual(mockServiceResponse)
  })

  it('should handle errors from returnRequestService', async () => {
    const error = new Error('Something went wrong')
    ;(returnRequestService as jest.Mock).mockRejectedValue(error)

    await expect(getRequest(ctx)).rejects.toThrow('Something went wrong')

    expect(ctx.body).toBeNull()
  })
})
