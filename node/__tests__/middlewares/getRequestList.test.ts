import { getRequestList } from '../../middlewares/getRequestList'
import { returnRequestListService } from '../../services/returnRequestListService'

jest.mock('../../services/returnRequestListService', () => ({
  returnRequestListService: jest.fn(),
}))

describe('getRequestList', () => {
  let ctx: any

  beforeEach(() => {
    ctx = {
      query: {
        _page: '1',
        _perPage: '10',
        _status: 'pending',
        _sequenceNumber: '123',
        _id: '456',
        _dateSubmitted: '2022-01-01,2022-12-31',
        _orderId: '789',
        _userEmail: 'user@example.com',
        _allFields: 'true',
      },
      state: {
        sellerId: 'seller123',
      },
      set: jest.fn(),
      body: null,
    }

    jest.clearAllMocks()
  })

  it('should set ctx.body with service response and set Cache-Control header', async () => {
    const mockServiceResponse = { data: 'someData' }
    ;(returnRequestListService as jest.Mock).mockResolvedValue(
      mockServiceResponse
    )

    await getRequestList(ctx)

    expect(returnRequestListService).toHaveBeenCalledWith(
      ctx,
      {
        page: 1,
        perPage: 10,
        filter: {
          status: 'pending',
          sequenceNumber: '123',
          id: '456',
          createdIn: { from: '2022-01-01', to: '2022-12-31' },
          orderId: '789',
          userEmail: 'user@example.com',
          sellerName: 'seller123',
        },
      },
      true
    )
    expect(ctx.body).toEqual(mockServiceResponse)
  })

  it('should handle errors from returnRequestListService', async () => {
    const error = new Error('Something went wrong')
    ;(returnRequestListService as jest.Mock).mockRejectedValue(error)

    await expect(getRequestList(ctx)).rejects.toThrow('Something went wrong')

    expect(ctx.body).toBeNull()
  })
})
