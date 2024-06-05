import { UserInputError } from '@vtex/api'
import { createReturn } from '../../middlewares/createReturn'
import { createReturnRequestService } from '../../services/createReturnRequestService'

jest.mock('../../services/createReturnRequestService', () => ({
  createReturnRequestService: jest.fn(),
}))

describe('createReturn middleware', () => {
  let ctx: any

  beforeEach(() => {
    ctx = {
      body: {},
      vtex: {},
      status: 200,
    }

    jest.clearAllMocks()
  })

  it('should throw UserInputError if locale is not provided', async () => {
    await expect(createReturn(ctx)).rejects.toThrow(UserInputError)
  })

  it('should set locale from body.cultureInfoData.locale', async () => {
    ctx.body = { cultureInfoData: { locale: 'en-US' } }
    ;(createReturnRequestService as jest.Mock).mockResolvedValue({
      returnRequestId: 'example',
    })

    await createReturn(ctx)

    expect(ctx.vtex.locale).toBe('en-US')
    expect(ctx.body).toEqual({ returnRequestId: 'example' })
    expect(ctx.status).toBe(200)
  })

  it('should set locale from body.locale', async () => {
    ctx.body = { locale: 'en-GB' }
    ;(createReturnRequestService as jest.Mock).mockResolvedValue({
      returnRequestId: 'example',
    })

    await createReturn(ctx)

    expect(ctx.vtex.locale).toBe('en-GB')
    expect(ctx.body).toEqual({ returnRequestId: 'example' })
    expect(ctx.status).toBe(200)
  })

  it('should handle errors from createReturnRequestService', async () => {
    ctx.body = { locale: 'en-GB' }
    ;(createReturnRequestService as jest.Mock).mockRejectedValue(
      new Error('Internal Server Error')
    )

    await createReturn(ctx)

    expect(ctx.body).toBe('Internal Server Error')
    expect(ctx.status).toBe(400)
  })
})
