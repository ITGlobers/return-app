import { returnRequestService } from '../services/returnRequestService'
/**
 * @api {get} /_v/return-request/:requestId Retrieve a Return Request
 * @apiName RetrieveReturnRequest
 * @apiGroup ReturnRequest
 * @apiVersion  3.16.35-hkignore
 * @apiParam {String} requestId Unique ID of the return request.
 *
 * @apiSuccess {Object} returnRequest Details of the return request.
 */
export async function getRequest(ctx: Context) {
  const { requestId } = ctx.vtex.route.params as { requestId: string }

  ctx.set('Cache-Control', 'no-cache')

  ctx.body = await returnRequestService(ctx, requestId)
}
