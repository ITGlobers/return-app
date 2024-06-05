import { updateGoodwill } from '../../middlewares/goodwill'

jest.mock('../../services/goodwill/updateGoodwillService', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    message: 'Success message',
    goodwill: {
      orderId: 'SLR-1100306545-01',
      sellerId: 'obiecomstage',
      goodwillCreditId: '1004002',
      reason: 'Lieferverzug',
      goodwillCreditAmount: 1000,
      shippingCost: 0,
      items: [
        {
          id: '3938479',
          amount: 1000,
          description: 'individuell - sonstiges',
        },
      ],
    },
  }),
}))
describe('updateGoodwill', () => {
  let ctx: any
  let next: jest.Mock<any, any>

  beforeEach(() => {
    ctx = {
      vtex: {
        route: {
          params: {
            id: '1100306545-01',
          },
        },
      },
      req: {},
      state: {
        logs: [],
      },
      set: jest.fn(),
    }
    next = jest.fn().mockResolvedValue(null)
  }) as unknown as Context

  it('should update goodwill credit successfully', async () => {
    await updateGoodwill(ctx, next)

    expect(ctx.status).toBe(204)
    expect(ctx.set).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(next).toHaveBeenCalled()
  })
})
