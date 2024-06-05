import { getGoodwills } from '../../middlewares/goodwill'
jest.mock('../../services/goodwill/getGoodwillService', () => ({
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
describe('getGoodwills', () => {
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
  it('should retrieve goodwill credits successfully', async () => {
    await getGoodwills(ctx, next)

    expect(ctx.body).toEqual({
      goodwill: {
        goodwillCreditAmount: 1000,
        goodwillCreditId: '1004002',
        items: [
          {
            amount: 1000,
            description: 'individuell - sonstiges',
            id: '3938479',
          },
        ],
        orderId: 'SLR-1100306545-01',
        reason: 'Lieferverzug',
        sellerId: 'obiecomstage',
        shippingCost: 0,
      },
      message: 'Success message',
    })
    expect(ctx.set).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(next).toHaveBeenCalled()
  })
})
