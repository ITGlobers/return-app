import { auth } from '../../middlewares/auth'

jest.mock('@vtex/api')
const authenticatedUser = { user: 'user@example.com', userId: '123' }
const authResponse = { token: 'valid-token' }

describe('auth', () => {
  let ctx: Context
  let next: jest.Mock<any, any>

  beforeEach(() => {
    ctx = {
      header: {},
      clients: {
        vtexId: {
          getAuthenticatedUser: jest.fn().mockResolvedValue(authenticatedUser),
          login: jest.fn().mockResolvedValue(authResponse),
        },
        sphinx: {
          isAdmin: jest.fn().mockResolvedValue(true),
        },
      },
      state: {},
      vtex: {},
      status: 200,
    } as unknown as Context
    next = jest.fn().mockResolvedValue(null)

    jest.clearAllMocks()
  })

  it('should authenticate successfully with auth cookie', async () => {
    ctx.header.vtexidclientautcookie = 'valid-auth-cookie'

    await auth(ctx, next)

    expect(ctx.state.userProfile).toEqual({
      userId: '123',
      email: 'user@example.com',
      role: 'admin',
    })
    expect(ctx.vtex.adminUserAuthToken).toBe('valid-auth-cookie')
    expect(next).toHaveBeenCalled()
  })

  it('should authenticate successfully with appkey and apptoken', async () => {
    ctx.header['x-vtex-api-appkey'] = 'valid-appkey'
    ctx.header['x-vtex-api-apptoken'] = 'valid-apptoken'

    await auth(ctx, next)

    expect(ctx.state.appkey).toBe('valid-appkey')
    expect(ctx.vtex.adminUserAuthToken).toBe('valid-token')
    expect(next).toHaveBeenCalled()
  })
})
