import { ping } from '../../middlewares/ping'

describe('ping', () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      response: {
        status: null,
        body: null,
      },
      set: jest.fn(),
    }
    next = jest.fn()

    jest.clearAllMocks()
  })

  it('should set status to 200, set Cache-Control and pragma headers, and set response body', async () => {
    await ping(ctx, next)

    expect(ctx.response.status).toBe(200)
    expect(ctx.set).toHaveBeenCalledWith('Cache-Control', 'no-cache, no-store')
    expect(ctx.set).toHaveBeenCalledWith('pragma', 'no-cache, no-store')
    expect(ctx.response.body).toBe('Ping check')
    expect(next).toHaveBeenCalledTimes(1)
  })
})
