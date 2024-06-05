import {
  saveSellerSetting,
  returnSellerSetting,
} from '../../middlewares/sellerSetting'
import {
  saveSellerSettingService,
  returnSellerSettingService,
} from '../../services/SellerSettingService'

jest.mock('../../services/SellerSettingService', () => ({
  saveSellerSettingService: jest.fn(),
  returnSellerSettingService: jest.fn(),
}))

describe('saveSellerSetting', () => {
  let ctx: any

  beforeEach(() => {
    ctx = {
      set: jest.fn(),
      body: null,
      status: null,
    }

    jest.clearAllMocks()
  })

  it('should save seller setting and set status to 200', async () => {
    const mockResponse = { id: '12345' }

    ;(returnSellerSettingService as jest.Mock).mockResolvedValue(null)
    ;(saveSellerSettingService as jest.Mock).mockResolvedValue(mockResponse)

    await saveSellerSetting(ctx)

    expect(ctx.body).toEqual({
      id: '12345',
    })
    expect(ctx.status).toBe(200)
  })

  it('should handle error and set status to 400', async () => {
    const error = new Error('Something went wrong')

    ;(returnSellerSettingService as jest.Mock).mockRejectedValue(error)

    await saveSellerSetting(ctx)

    expect(ctx.body).toBe(error)
    expect(ctx.status).toBe(400)
  })
})

describe('returnSellerSetting', () => {
  let ctx: any

  beforeEach(() => {
    ctx = {
      clients: {
        appSettings: {
          get: jest.fn(),
        },
      },
      vtex: {
        route: {
          params: {
            sellerId: 'testSellerId',
          },
        },
        account: 'testAccount',
      },
      set: jest.fn(),
      body: null,
      status: null,
    }

    jest.clearAllMocks()
  })

  it('should return seller setting and set status to 200', async () => {
    const mockResponse = {
      sellerId: 'testSellerId',
      parentAccount: 'testAccount',
    }

    ;(returnSellerSettingService as jest.Mock).mockResolvedValue(mockResponse)

    await returnSellerSetting(ctx)

    expect(returnSellerSettingService).toHaveBeenCalledWith(ctx, 'testSellerId')
    expect(ctx.body).toEqual(mockResponse)
    expect(ctx.status).toBe(200)
  })

  it('should create new seller setting if not found and set status to 200', async () => {
    const mockResponse = { DocumentId: '12345' }
    const mockAppSettingsResponse = { settings: {} }

    ;(returnSellerSettingService as jest.Mock).mockResolvedValue(null)
    ;(ctx.clients.appSettings.get as jest.Mock).mockResolvedValue(
      mockAppSettingsResponse
    )
    ;(saveSellerSettingService as jest.Mock).mockResolvedValue(mockResponse)

    await returnSellerSetting(ctx)

    expect(returnSellerSettingService).toHaveBeenCalledWith(ctx, 'testSellerId')
    expect(ctx.clients.appSettings.get).toHaveBeenCalledWith(
      expect.any(String),
      true
    )

    expect(ctx.body).toEqual({
      parentAccount: 'testAccount',
      sellerId: 'testSellerId',
      settings: {},
      id: '12345',
    })
    expect(ctx.status).toBe(200)
  })

  it('should handle error and set status to 400', async () => {
    const error = new Error('Something went wrong')

    ;(returnSellerSettingService as jest.Mock).mockRejectedValue(error)

    await returnSellerSetting(ctx)

    expect(ctx.body).toBe(error)
    expect(ctx.status).toBe(400)
  })

  it('should throw UserInputError if sellerId is not provided', async () => {
    ctx.vtex.route.params.sellerId = undefined

    await returnSellerSetting(ctx)

    expect(ctx.status).toBe(400)
  })
})
