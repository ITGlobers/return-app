/**
 * @api {get} /_v/return-app/orders/:orderId/summary Retrieve Return App Order Summary
 * @apiName RetrieveReturnAppOrderSummary
 * @apiGroup ReturnApp
 * @apiVersion  3.16.35-hkignore
 * @apiHeader {String} VtexIdclientAutCookie Authentication token.
 * @apiHeader {String} Cookie Session cookie.
 *
 * @apiParam {String} orderId Order ID (required).
 *
 * @apiSuccess {Object} summary Return App Order Summary.
 * @apiSuccess {String} summary.id ID of the return app order.
 * @apiSuccess {String} summary.orderId Order ID.
 * @apiSuccess {Number} summary.orderValue Total value of the order.
 * @apiSuccess {Number} summary.shippingValue Shipping value.
 * @apiSuccess {Object} summary.amountsAvailable Amounts available for refund.
 * @apiSuccess {Number} summary.amountsAvailable.order Amount available for order refund.
 * @apiSuccess {Number} summary.amountsAvailable.shipping Amount available for shipping refund.
 * @apiSuccess {Object[]} summary.items Array of items associated with the order.
 * @apiSuccess {String} summary.items.id ID of the item.
 * @apiSuccess {Number} summary.items.unitCost Unit cost of the item.
 * @apiSuccess {Number} summary.items.quantity Quantity of the item.
 * @apiSuccess {Number} summary.items.amount Total amount of the item.
 * @apiSuccess {Object} summary.items.amountAvailablePerItem Amount available per item for refund.
 * @apiSuccess {Number} summary.items.amountAvailablePerItem.amount Amount available for refund per item.
 * @apiSuccess {Number} summary.items.amountAvailablePerItem.quantity Quantity available for refund per item.
 * @apiSuccess {Object[]} summary.transactions Array of transactions associated with the order.
 * @apiSuccess {String} summary.transactions.id ID of the transaction.
 * @apiSuccess {Number} summary.transactions.amount Amount of the transaction.
 * @apiSuccess {String} summary.transactions.type Type of the transaction.
 * @apiSuccess {String} summary.transactions.status Status of the transaction.
 * @apiSuccess {String} summary.transactions.metadata Metadata associated with the transaction.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "1100305901-01",
 *       "orderId": "1100305901-01",
 *       "orderValue": 10000,
 *       "shippingValue": 0,
 *       "amountsAvailable": {
 *           "order": 10000,
 *           "shipping": 0
 *       },
 *       "items": [
 *           {
 *               "id": "3938495",
 *               "unitCost": 10000,
 *               "quantity": 1,
 *               "amount": 10000,
 *               "amountAvailablePerItem": {
 *                   "amount": 10000,
 *                   "quantity": 1
 *               }
 *           }
 *       ],
 *       "transactions": [
 *           {
 *               "id": "595cdb4a-331f-4c43-8210-521d95c65d9d",
 *               "amount": 10,
 *               "status": "denied",
 *           }
 *       ]
 *     }
 */

import { mapToOrderSummary } from "../utils/mapToOrderSummary"

export async function getOrderRefundsSummary(ctx: Context) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const orderId = params.orderId as string

  const response = await mapToOrderSummary(ctx , orderId)

  ctx.body = response
  ctx.status = 200

  ctx.set('Cache-Control', 'no-cache')
}
