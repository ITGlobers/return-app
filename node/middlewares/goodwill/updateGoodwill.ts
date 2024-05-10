import updateGoodwillService from '../../services/goodwill/updateGoodwillService'
/**
 * @api {put} /_v/goodwill Update Goodwill Credit
 * @apiName UpdateGoodwillCredit
 * @apiGroup Goodwill
 * @apiVersion  3.16.35-hkignore
 * @apiHeader {String} VtexIdclientAutCookie Authentication token.
 * @apiHeader {String} Content-Type Content type header should be set to application/json.
 * @apiHeader {String} Cookie Session cookie.
 *
 * @apiBody {String} goodwillCreditId ID of the goodwill credit (required).
 * @apiBody {Number} status Status code (required).
 * @apiBody {String} message Message associated with the update (required).
 *
 * @apiSuccess {String} message Success message.
 */
export interface GoodwillUpdate {
  id: string
  status: 200 | 403
  message: string
}
export async function updateGoodwill(
  ctx: Context,
  next: () => Promise<any>
): Promise<any> {
  const body = ctx.body as GoodwillUpdate

  await updateGoodwillService(ctx, body)

  ctx.status = 204
  ctx.set('Cache-Control', 'no-cache')
  await next()
}
