import { MutationUpdateReturnRequestStatusArgs } from '../../../typings/ReturnRequest'
import { updateRequestStatus } from '../../middlewares/updateRequestStatus'
import { updateRequestStatusService } from '../../services/updateRequestStatusService'
import { json } from 'co-body'

jest.mock('co-body', () => ({
  json: jest.fn(),
}))
jest.mock('../../services/updateRequestStatusService', () => ({
  updateRequestStatusService: jest.fn(),
}))

describe('updateRequestStatus', () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      req: {},
      vtex: {
        route: {
          params: { requestId: 'testRequestId' },
        },
      },
      body: {},
      set: jest.fn(),
    }
    next = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call updateRequestStatusService with correct arguments and set response to ctx.body', async () => {
    const mockMutationUpdateReturnRequestStatusArgs: MutationUpdateReturnRequestStatusArgs =
      {
        requestId: 'testRequestId',
        sellerName: 'testSellerName',
        status: 'denied',
      }
    ;(updateRequestStatusService as jest.Mock).mockResolvedValue(
      mockMutationUpdateReturnRequestStatusArgs
    )
    ;(json as jest.Mock).mockResolvedValue({
      requestId: 'testRequestId',
      sellerName: 'testSellerName',
      status: 'denied',
    })
    await updateRequestStatus(ctx)

    expect(updateRequestStatusService).toHaveBeenCalledWith(ctx, {
      sellerName: 'testSellerName',
      status: 'denied',
      requestId: 'testRequestId',
    })
    expect(ctx.set).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(ctx.body).toStrictEqual({
      requestId: 'testRequestId',
      sellerName: 'testSellerName',
      status: 'denied',
    })
    expect(ctx.status).toBe(200)
  })
})
