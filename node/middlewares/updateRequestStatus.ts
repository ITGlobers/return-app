import { json } from 'co-body'

import { updateRequestStatusService } from '../services/updateRequestStatusService'
/**
 * @api {put} /_v/return-request/:requestId Update a Return Request Status
 * @apiName UpdateReturnRequestStatus
 * @apiGroup ReturnRequest
 * @apiVersion  3.16.35-hkignore
 * @apiParam {String} requestId Unique ID of the return request.
 *
 * @apiBody {String} status Enum possible values: new, processing, pickedUpFromClient, pendingVerification, packageVerified, amountRefunded, denied, canceled (required).
 * @apiBody {Object} [comment] Object only required if not updating status.
 * @apiBody {String} comment.value String only required if not updating status.
 * @apiBody {Boolean} [comment.visibleForCustomer=false] Boolean the comment will be shown to the customer. Default false.
 * @apiBody {Object} [refundData] Object only considered when status sent is packagedVerified.
 * @apiBody {Array} refundData.items Array of objects with items approved to be returned.
 * @apiBody {Integer} refundData.items.orderItemIndex Index of the item in the Order object from the OMS.
 * @apiBody {Integer} refundData.items.quantity Number to be returned for the given orderItemIndex.
 * @apiBody {Integer} refundData.items.restockFee Discount to be applied to the amount to be refunded, can be zero.
 * @apiBody {Integer} refundData.refundedShippingValue Shipping amount to be refunded, can be zero.
 *
 * @apiSuccess {String} requestId Unique ID of the return request.
 */
export async function updateRequestStatus(ctx: Context) {
  const {
    req,
    vtex: {
      route: { params },
    },
  } = ctx

  const { requestId } = params as { requestId: string }

  const body = await json(req)
  const updatedRequest = await updateRequestStatusService(ctx, {
    ...body,
    requestId,
  })

  ctx.set('Cache-Control', 'no-cache')
  ctx.body = updatedRequest
  ctx.status = 200
}
