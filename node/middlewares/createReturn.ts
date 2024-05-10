import { UserInputError } from '@vtex/api'
import { createReturnRequestService } from '../services/createReturnRequestService'

/**
 * @api {post} /_v/return-request Create Return Request
 * @apiName CreateReturnRequest
 * @apiGroup ReturnRequest
 * @apiVersion  3.16.35-hkignore
 * @apiBody {String} orderId orderId to where the Return Request is being made to (required).
 * @apiBody {Array} items array of individual itemObject to be returned (required).
 * @apiBody {Integer} items.orderItemIndex Index of the item in the Order object from the OMS (required).
 * @apiBody {Integer} items.quantity Number to be returned for the given orderItemIndex (required).
 * @apiBody {String} items.condition Enum values: newWithBox, newWithoutBox, usedWithBox, usedWithoutBox (optional).
 * @apiBody {Object} items.returnReason Object with reason to return the item (required).
 * @apiBody {String} items.returnReason.reason Reason to return (required).
 * @apiBody {String} [items.returnReason.otherReason] Description of the reason when it is 'otherReason' (optional).
 * @apiBody {Object} customerProfileData Object with customer information (required).
 * @apiBody {String} customerProfileData.name Customer name for the return request (required).
 * @apiBody {String} customerProfileData.email Customer's email for the return request (required).
 * @apiBody {String} customerProfileData.phoneNumber Customer's phone number for the return request (required).
 * @apiBody {Object} pickupReturnData Object with information where the items should be picked up (required).
 * @apiBody {String} pickupReturnData.addressId Id of the customer's address, can be empty string (required).
 * @apiBody {String} pickupReturnData.address Customer address (required).
 * @apiBody {String} pickupReturnData.city City of the address (required).
 * @apiBody {String} pickupReturnData.state State of the address (required).
 * @apiBody {String} pickupReturnData.country Country of the address (required).
 * @apiBody {String} pickupReturnData.zipCode Postal code of the address (required).
 * @apiBody {String="PICKUP_POINT","CUSTOMER_ADDRESS"} pickupReturnData.addressType Possible values: PICKUP_POINT, CUSTOMER_ADDRESS (required).
 * @apiBody {Object} refundPaymentData Object with refund information (required).
 * @apiBody {String="bank","card","giftCard","sameAsPurchase"} refundPaymentData.refundPaymentMethod Possible values: bank, card, giftCard, sameAsPurchase (required).
 * @apiBody {String} [refundPaymentData.iban] Required when refundPaymentMethod is set as bank (optional).
 * @apiBody {String} [refundPaymentData.accountHolderName] Required when refundPaymentMethod is set as bank (optional).
 * @apiBody {String} [userComment] Comment to be added to the creation (optional).
 * @apiBody {String} locale Locale for the customer to visualize the return (required).
 *
 * @apiSuccess {String} requestId Unique ID of the return request.
 */

export async function createReturn(ctx: Context) {
  const { body }: any = ctx || {}
  const locale = body?.cultureInfoData?.locale || body?.locale

  if (!locale) {
    throw new UserInputError('Locale is required.')
  }

  ctx.vtex.locale = locale

  try {
    ctx.body = await createReturnRequestService(ctx, { ...body, locale })
    ctx.status = 200
  } catch (error) {
    ctx.body =
      error?.message ||
      error?.response?.data ||
      error.response?.statusText ||
      error
    ctx.status = error.response?.status || 400
  }
}

