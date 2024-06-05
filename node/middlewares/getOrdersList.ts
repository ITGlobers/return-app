import { returnOrdersListService } from '../services/returnOrdersListService'

export async function getOrdersList(ctx: Context) {
  const { body } = ctx

  ctx.set('Cache-Control', 'no-cache')
  ctx.body = await returnOrdersListService(ctx, body)
}
