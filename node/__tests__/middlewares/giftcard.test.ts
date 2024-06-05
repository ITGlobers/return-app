import { createGiftcard } from '../../middlewares/giftcard'
import { createGiftcardService } from '../../services/createGiftcardService'
import { json } from 'co-body'

// Mockear la función createGiftcardService y json
jest.mock('../../services/createGiftcardService', () => ({
  createGiftcardService: jest.fn(),
}))

jest.mock('co-body', () => ({
  json: jest.fn(),
}))

describe('createGiftcard', () => {
  let ctx: any

  beforeEach(() => {
    ctx = {
      req: {},
      set: jest.fn(),
      body: null,
    }

    jest.clearAllMocks()
  })

  it('should set ctx.body with service response and set Cache-Control header', async () => {
    const mockServiceResponse = { giftcardId: '12345' }
    const mockRequestBody = { amount: 100 }

    ;(json as jest.Mock).mockResolvedValue(mockRequestBody)
    ;(createGiftcardService as jest.Mock).mockResolvedValue(mockServiceResponse)

    await createGiftcard(ctx)

    expect(json).toHaveBeenCalledWith(ctx.req)
    expect(createGiftcardService).toHaveBeenCalledWith(ctx, mockRequestBody)
    expect(ctx.body).toEqual(mockServiceResponse)
    expect(ctx.set).toHaveBeenCalledWith('Cache-Control', 'no-cache')
  })

  it('should handle errors from createGiftcardService', async () => {
    const error = new Error('Something went wrong')
    const mockRequestBody = { amount: 100 }

    ;(json as jest.Mock).mockResolvedValue(mockRequestBody)
    ;(createGiftcardService as jest.Mock).mockRejectedValue(error)

    await expect(createGiftcard(ctx)).rejects.toThrow('Something went wrong')

    expect(ctx.body).toBeNull()
  })
})
