import { setSchemaVersion } from '../../middlewares/setSchema'
import { SCHEMAS } from '../../utils/constants'

describe('setSchemaVersion', () => {
  let ctx: any
  let next: jest.Mock

  beforeEach(() => {
    ctx = {
      clients: {
        returnRequestClient: { schema: null },
        goodwill: { schema: null },
        sellerSetting: { schema: null },
        orderRefundsSummaryClient: { schema: null },
      },
    }
    next = jest.fn()
  })

  it('should set the correct schema versions for each client', async () => {
    await setSchemaVersion(ctx, next)

    expect(ctx.clients.returnRequestClient.schema).toBe(SCHEMAS.RETURN_REQUEST)
    expect(ctx.clients.goodwill.schema).toBe(SCHEMAS.GOODWILL)
    expect(ctx.clients.sellerSetting.schema).toBe(SCHEMAS.SELLER_SETTING)
    expect(ctx.clients.orderRefundsSummaryClient.schema).toBe(
      SCHEMAS.ORDER_REFUNDS_SUMMARY
    )

    expect(next).toHaveBeenCalled()
  })
})
