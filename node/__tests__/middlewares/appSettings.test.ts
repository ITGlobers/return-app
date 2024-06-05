import { returnAppSetting, saveAppSetting } from '../../middlewares/appSettings'
import { SETTINGS_PATH } from '../../utils/constants'
import { mockReturnAppSettings } from '../../__mocks__/mocks'

jest.mock('co-body', () => ({
  json: jest.fn().mockResolvedValue({
    __typename: 'ReturnAppSettings',
    maxDays: 30,
    excludedCategories: ['category1', 'category2'],
    paymentOptions: {
      allowedPaymentTypes: {
        __typename: undefined,
        bank: undefined,
        card: undefined,
        giftCard: undefined,
      },
    },
    termsUrl: 'http://example.com/terms',
    customReturnReasons: [
      {
        reason: 'Defective',
        maxDays: 0,
      },
    ],
    options: {
      enableSelectItemCondition: true,
    },
    orderStatus: 'completed',
  }),
}))
jest.mock('../../utils/appSettingSchema')
jest.mock('../../utils/constants', () => ({
  SETTINGS_PATH: 'mocked/settings/path',
}))

describe('saveAppSetting', () => {
  let ctx: any

  beforeEach(() => {
    ctx = {
      req: mockReturnAppSettings,
      state: {
        logs: [],
      },
      clients: {
        appSettings: {
          get: jest.fn(),
          save: jest.fn(),
        },
      },
      set: jest.fn(),
    }
  }) as unknown as Context

  it('should save app settings successfully', async () => {
    await saveAppSetting(ctx)

    expect(ctx.clients.appSettings.get).toHaveBeenCalledWith(
      SETTINGS_PATH,
      true
    )
    expect(ctx.clients.appSettings.save).toHaveBeenCalledWith(
      SETTINGS_PATH,
      mockReturnAppSettings
    )
    expect(ctx.body).toEqual({ settingsSaved: mockReturnAppSettings })
    expect(ctx.status).toBe(201)
  })

  it('should handle validation errors', async () => {
    ctx = {
      req: mockReturnAppSettings,
      state: {
        logs: [],
      },
      clients: {
        appSettings: {
          get: jest.fn().mockRejectedValue(new Error('Invalid key')),
          save: jest.fn().mockRejectedValue(new Error('Invalid key')),
        },
      },
      set: jest.fn(),
    }
    await saveAppSetting(ctx)

    expect(ctx.status).toBe(400)
    expect(ctx.body).toEqual({ errors: ['Invalid key'] })
  })
})

describe('returnAppSetting', () => {
  let ctx: any

  beforeEach(() => {
    ctx = {
      req: mockReturnAppSettings,
      state: {
        logs: [],
      },
      clients: {
        appSettings: {
          get: jest.fn().mockResolvedValue(mockReturnAppSettings),
          save: jest.fn(),
        },
      },
      set: jest.fn(),
    }
  }) as unknown as Context

  it('should return app settings successfully', async () => {
    await returnAppSetting(ctx)

    expect(ctx.clients.appSettings.get).toHaveBeenCalledWith(
      SETTINGS_PATH,
      true
    )

    expect(ctx.body).toEqual(mockReturnAppSettings)
    expect(ctx.status).toBe(201)
  })
})
