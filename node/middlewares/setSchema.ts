import { SCHEMAS } from '../utils/constants'

export async function setSchemaVersion(
  ctx: Context,
  next: () => Promise<void>
): Promise<void> {
  ctx.clients.returnRequestClient.schema = SCHEMAS.RETURN_REQUEST
  ctx.clients.goodwill.schema = SCHEMAS.GOODWILL
  ctx.clients.sellerSetting.schema = SCHEMAS.SELLER_SETTING
  ctx.clients.orderRefundsSummaryClient.schema = SCHEMAS.ORDER_REFUNDS_SUMMARY

  await next()
}
