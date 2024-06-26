import { UserInputError, ResolverError } from '@vtex/api'
import type { DocumentResponse } from '@vtex/clients'

import type { ReturnRequestCreated } from '../../typings/ReturnRequest'
import {
  SETTINGS_PATH,
  OMS_RETURN_REQUEST_CONFIRMATION,
} from '../utils/constants'
import { isUserAllowed } from '../utils/isUserAllowed'
import { OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE } from '../utils/templates'
import type { ConfirmationMailData } from '../typings/mailClient'
import { getCustomerEmail } from '../utils/getCostumerEmail'

export const createReturnRequestSellerService = async (
  ctx: Context,
  args: any
): Promise<ReturnRequestCreated> => {
  const {
    header,
    clients: { oms, returnRequestClient, appSettings, mail },
    state: { userProfile, appkey },
    vtex: { logger },
  } = ctx

  let { sellerId } = ctx.state

  const {
    orderId,
    sellerName,
    refundableAmount,
    sequenceNumber,
    status,
    refundableAmountTotals,
    customerProfileData,
    pickupReturnData,
    refundPaymentData,
    items,
    dateSubmitted,
    refundData,
    refundStatusData,
    cultureInfoData,
    logisticInfo,
    locale,
  } = args

  const { firstName, lastName, email } = userProfile ?? {}

  const submittedByNameOrEmail =
    firstName ?? lastName ? `${firstName} ${lastName}` : email

  // If request was validated using appkey and apptoken, we assign the appkey as a sender
  // Otherwise, we try to use requester name. Email is the last resort.
  sellerId = sellerId ?? (header['x-vtex-caller'] as string | undefined)
  const submittedBy = appkey ?? submittedByNameOrEmail ?? sellerId

  if (!submittedBy) {
    throw new ResolverError(
      'Unable to get submittedBy from context. The request is missing the userProfile info or the appkey'
    )
  }

  // Check items since a request via endpoint might not have it.
  // Graphql validation doesn't prevent user to send empty items
  if (!(items && items.length === 0)) {
    throw new UserInputError('There are no items in the request')
  }

  // For requests where orderId is an empty string
  if (!orderId) {
    throw new UserInputError('Order ID is missing')
  }

  const orderPromise = oms.order(orderId, 'AUTH_TOKEN')

  const searchRMAPromise = returnRequestClient.searchRaw(
    { page: 1, pageSize: 1 },
    ['id'],
    undefined,
    `orderId=${orderId}`
  )

  const settingsPromise = appSettings.get(SETTINGS_PATH, true)

  // If order doesn't exist, it throws an error and stop the process.
  // If there is no request created for that order, request searchRMA will be an empty array.
  const [order, settings, searchRMA] = await Promise.all([
    orderPromise,
    settingsPromise,
    searchRMAPromise,
  ])

  if (!settings) {
    throw new ResolverError('Return App settings is not configured', 500)
  }

  const {
    clientProfileData,
    shippingData,
    sellers,
    sequence,
    storePreferencesData: { currencyCode },
  } = order

  const {
    pagination: { total },
  } = searchRMA

  isUserAllowed({
    requesterUser: userProfile,
    clientProfile: clientProfileData,
    appkey,
    sellerId,
  })

  const currentSequenceNumber = `${sequence}-${Number(total) + 1}`

  // customerProfileData can be undefined when coming from a endpoint request
  const { email: inputEmail } = customerProfileData ?? {}

  const customerEmail = getCustomerEmail(
    clientProfileData,
    {
      userProfile,
      appkey,
      inputEmail,
      sellerId,
    },
    {
      logger,
    }
  )

  let rmaDocument: DocumentResponse

  try {
    rmaDocument = await returnRequestClient.save({
      orderId,
      sellerName: sellers?.[0]?.id || sellerName || undefined,
      refundableAmount,
      sequenceNumber: sequenceNumber || currentSequenceNumber,
      status: status || 'new',
      refundableAmountTotals,
      customerProfileData: {
        userId: clientProfileData.userProfileId,
        name: customerProfileData.name,
        email: customerEmail,
        phoneNumber: customerProfileData.phoneNumber,
      },
      pickupReturnData,
      refundPaymentData,
      items,
      dateSubmitted: dateSubmitted || new Date(),
      refundData,
      refundStatusData,
      cultureInfoData: cultureInfoData || { locale, currencyCode },
      logisticInfo,
      createdIn: dateSubmitted || new Date(),
    })
  } catch (error) {
    const mdValidationErrors = error?.response?.data?.errors[0]?.errors

    const errorMessageString = mdValidationErrors
      ? JSON.stringify(
          {
            message: 'Schema Validation error',
            errors: mdValidationErrors,
          },
          null,
          2
        )
      : error.message

    throw new ResolverError(errorMessageString, error.response?.status ?? 500)
  }

  // We add a try/catch here so we avoid sending an error to the browser only if the email fails.
  try {
    const templateExists = await mail.getTemplate(
      OMS_RETURN_REQUEST_CONFIRMATION(cultureInfoData.locale)
    )

    if (!templateExists) {
      await mail.publishTemplate(
        OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE(cultureInfoData.locale)
      )
    }

    const {
      firstName: clientFirstName,
      lastName: clientLastName,
      phone,
    } = clientProfileData

    const {
      address: { country, city, street },
    } = shippingData

    const mailData: ConfirmationMailData = {
      templateName: OMS_RETURN_REQUEST_CONFIRMATION(cultureInfoData.locale),
      jsonData: {
        data: {
          status: 'new',
          name: `${clientFirstName} ${clientLastName}`,
          DocumentId: rmaDocument.DocumentId,
          email: customerEmail,
          phoneNumber: phone,
          country,
          locality: city,
          address: street,
          paymentMethod: refundPaymentData.refundPaymentMethod,
        },
        products: [...items],
        refundStatusData,
      },
    }

    await mail.sendMail(mailData)
  } catch (error) {
    logger.warn({
      message: `Failed to send email for return request ${rmaDocument.DocumentId}`,
      error,
    })
  }

  return { returnRequestId: rmaDocument.DocumentId }
}
