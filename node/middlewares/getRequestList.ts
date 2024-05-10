import type { Status } from '../../typings/ReturnRequest'
import { returnRequestListService } from '../services/returnRequestListService'
/**
 * @api {get} /_v/return-request Retrieve Return Request List
 * @apiName RetrieveReturnRequestList
 * @apiGroup ReturnRequest
 * @apiVersion  3.16.35-hkignore
 * @apiDescription To retrieve a List of Return Requests make a GET request to the following endpoint:
 * `https://{accountName}.myvtex.com/_v/return-request`
 *
 * @apiParam {Integer} [_page] Page number for pagination.
 * @apiParam {Integer} [_perPage] Number of items per page.
 * @apiParam {String} [_status] Enum: new, processing, pickedUpFromClient, pendingVerification, packageVerified, amountRefunded, denied, canceled.
 * @apiParam {String} [_sequenceNumber] Unique sequence number of the return request.
 * @apiParam {String} [_id] Unique ID of the return request.
 * @apiParam {String} [_dateSubmitted] Date submitted in the format: YYYY-MM-DD. Example: _dateSubmitted=2022-06-12,2022-07-13.
 * @apiParam {String} [_orderId] Order ID associated with the return request.
 * @apiParam {String} [_userEmail] Email of the user associated with the return request.
 * @apiParam {String} [_allFields] Any truthy value to retrieve all fields for the requests.
 *
 * @apiSuccess {Object[]} returnRequests List of return requests matching the search criteria.
 */

export async function getRequestList(ctx: Context) {
  const {
    query,
    state: { sellerId },
  } = ctx

  const {
    _page,
    _perPage,
    _status,
    _sequenceNumber,
    _id,
    _dateSubmitted,
    _orderId,
    _userEmail,
    _allFields,
  } = query

  const [from, to] = (_dateSubmitted as string | undefined)?.split(',') ?? []

  const getAllFields = Boolean(_allFields)

  ctx.set('Cache-Control', 'no-cache')

  ctx.body = await returnRequestListService(
    ctx,
    {
      page: _page ? Number(_page) : 1,
      perPage: _perPage ? Number(_perPage) : 25,
      filter: {
        status: _status as Status | undefined,
        sequenceNumber: _sequenceNumber as string | undefined,
        id: _id as string | undefined,
        createdIn: _dateSubmitted ? { from, to } : undefined,
        orderId: _orderId as string | undefined,
        userEmail: _userEmail as string | undefined,
        sellerName: sellerId as string | undefined,
      },
    },
    getAllFields
  )
}
