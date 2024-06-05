import { UserInputError } from '@vtex/api'
import { createPrerefund } from '../../middlewares/createPrerefund'
import { createReturnRequestService } from '../../services/createReturnRequestService'

jest.mock('../../services/createReturnRequestService', () => ({
  __esModule: true,
  createReturnRequestService: jest
    .fn()
    .mockResolvedValue({ returnRequestId: 'example' }),
}))
describe('createPrerefund middleware', () => {
  let ctx: any

  beforeEach(() => {
    ctx = {
      vtex: {
        locale: '',
      },
      req: {},
      state: {
        logs: [],
      },
      set: jest.fn(),
    }
  }) as unknown as Context

  it('should throw UserInputError if locale is not provided', async () => {
    await expect(createPrerefund(ctx)).rejects.toThrow(UserInputError)
  })

  it('should set locale from body.cultureInfoData.locale', async () => {
    ctx.body = { cultureInfoData: { locale: 'en-US' } }
    await createPrerefund(ctx)

    expect(ctx.vtex.locale).toBe('en-US')
    expect(ctx.body).toStrictEqual({ returnRequestId: 'example' })
    expect(ctx.status).toBe(200)
  })

  it('should set locale from body.locale', async () => {
    ctx.body = { locale: 'en-GB' }

    await createPrerefund(ctx)

    expect(ctx.vtex.locale).toBe('en-GB')
    expect(ctx.body).toStrictEqual({ returnRequestId: 'example' })
    expect(ctx.status).toBe(200)
  })

  it('should handle errors from createReturnRequestService', async () => {
    ctx.body = { locale: 'en-GB' }
    ;(createReturnRequestService as jest.Mock).mockRejectedValue(
      new Error('Internal Server Error')
    )

    await createPrerefund(ctx)

    expect(ctx.body).toBe('Internal Server Error')
    expect(ctx.status).toBe(400)
  })
})
