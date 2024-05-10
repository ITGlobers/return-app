import { SCHEMAS } from './constants'

interface ContextFunction<T> {
  (_: any, params: any, ctx: Context): Promise<T>
}

export const wrapperFunction = <T>(originalFunction: ContextFunction<T>) => {
  return async (_: any, params: any, ctx: Context): Promise<T> => {
    const {
      vtex: { production, workspace },
    } = ctx

    ctx.clients.returnRequestClient.schema = production
      ? SCHEMAS.RETURN_REQUEST
      : `${SCHEMAS.RETURN_REQUEST}-${workspace}`
    ctx.clients.goodwill.schema = production
      ? SCHEMAS.GOODWILL
      : `${SCHEMAS.GOODWILL}-${workspace}`
    ctx.clients.sellerSetting.schema = production
      ? SCHEMAS.SELLER_SETTING
      : `${SCHEMAS.SELLER_SETTING}-${workspace}`
    ctx.clients.orderRefundsSummaryClient.schema = production
      ? SCHEMAS.ORDER_REFUNDS_SUMMARY
      : `${SCHEMAS.ORDER_REFUNDS_SUMMARY}-${workspace}`

    const result = await originalFunction(_, params, ctx)

    return result
  }
}

export const resolversWrapper = (items: {
  [key: string]: (...args: any[]) => any
}) =>
  Object.fromEntries(
    Object.entries(items).map(([name, originalFunction]) => {
      return [name, wrapperFunction(originalFunction)]
    })
  )
