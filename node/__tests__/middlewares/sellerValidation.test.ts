import { sellerValidation } from '../../middlewares/sellerValidation'
import { AuthenticationError } from '@vtex/api'
import { json } from 'co-body'

jest.mock('co-body', () => ({
  json: jest.fn(),
}))

describe('sellerValidation', () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      req: { settings: {}, sellerName: 'testSellerId' },
      query: {},
      vtex: {
        route: {
          params: {},
        },
      },
      clients: {
        marketplace: {
          getSellers: jest.fn(),
        },
      },
      state: {},
      body: null,
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  it('should validate sellerId and call next if seller exists and is active', async () => {
    ;(json as jest.Mock).mockResolvedValue({
      settings: {},
      sellerName: 'testSellerId',
    })

    ctx.query = { _sellerName: 'testSellerId' }
    ctx.vtex.route.params = { sellerId: 'testSellerId' }
    const mockResponse = { items: [{ id: 'testSellerId', isActive: true }] }
    ctx.clients.marketplace.getSellers.mockResolvedValue(mockResponse)

    await sellerValidation(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.state.sellerId).toBe('testSellerId')
    expect(ctx.body).toStrictEqual({ sellerName: 'testSellerId', settings: {} })
  })

  it('should throw AuthenticationError if seller does not exist', async () => {
    ctx.query = { _sellerName: 'nonExistentSeller' }
    const mockResponse = { items: [] }
    ctx.clients.marketplace.getSellers.mockResolvedValue(mockResponse)

    await expect(sellerValidation(ctx, next)).rejects.toThrow(
      AuthenticationError
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('should validate sellerId when _sellerId is provided and is valid', async () => {
    ctx.query = { _sellerId: 'testSellerId' }
    const mockResponse = { items: [{ id: 'testSellerId', isActive: true }] }
    ctx.clients.marketplace.getSellers.mockResolvedValue(mockResponse)

    await sellerValidation(ctx, next)

    expect(next).toHaveBeenCalled()
    expect(ctx.state.sellerId).toBe('testSellerId')
  })

  it('should throw AuthenticationError when _sellerId is provided but is invalid', async () => {
    ctx.query = { _sellerId: 'invalidSellerId' }
    const mockResponse = { items: [] }
    ctx.clients.marketplace.getSellers.mockResolvedValue(mockResponse)

    await expect(sellerValidation(ctx, next)).rejects.toThrow(
      `An error occurred while trying to validate your sellerId, please try again.`
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('should throw AuthenticationError when neither _sellerName nor _sellerId are provided', async () => {
    await expect(sellerValidation(ctx, next)).rejects.toThrow(``)
    expect(next).not.toHaveBeenCalled()
  })
})
