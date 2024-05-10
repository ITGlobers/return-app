import { ResolverError, UserInputError } from '@vtex/api'

import type { OrderToReturnSummary } from '../../typings/OrderToReturn'
import { SETTINGS_PATH } from '../utils/constants'
import { createOrdersToReturnSummary } from '../utils/createOrdersToReturnSummary'
import { isUserAllowed } from '../utils/isUserAllowed'
import { canOrderBeReturned } from '../utils/canOrderBeReturned'
import { getCustomerEmail } from '../utils/getCostumerEmail'

export const orderToReturnSummary = async (
  _: unknown,
  args: { orderId: string; storeUserEmail?: string },
  ctx: Context
): Promise<OrderToReturnSummary> => {
  const { orderId, storeUserEmail } = args

  const {
    state: { userProfile, appkey, sellerId },
    clients: { appSettings, oms, returnRequestClient, catalogGQL, profile },
    vtex: { logger, adminUserAuthToken },
  } = ctx

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings) {
    throw new ResolverError('Return App settings is not configured', 500)
  }

  const { maxDays, excludedCategories, orderStatus } = settings

  // For requests where orderId is an empty string
  if (!orderId) {
    throw new UserInputError('Order ID is missing')
  }

  const order = await oms.order(orderId)

  const { creationDate, clientProfileData, status } = order

  let userEmail = ''

  isUserAllowed({
    requesterUser: userProfile,
    clientProfile: clientProfileData,
    appkey,
    sellerId,
  })

  canOrderBeReturned({
    creationDate,
    maxDays,
    status,
    orderStatus,
  })

  if (userProfile?.role === 'admin') {
    try {
      const profileUnmask = await profile.getProfileUnmask(
        clientProfileData?.userProfileId,
        adminUserAuthToken
      )

      if (profileUnmask?.[0]?.document?.email) {
        const currenProfile = profileUnmask?.[0]?.document

        userEmail = currenProfile.email

        order.clientProfileData = {
          ...order.clientProfileData,
          email: userEmail,
          firstName: currenProfile?.firstName,
          lastName: currenProfile?.lastName,
          phone: currenProfile?.homePhone,
        }
      } else {
        const response = await profile.searchEmailByUserId(
          clientProfileData?.userProfileId,
          adminUserAuthToken
        )

        if (response.length > 0) {
          const currenProfile = response?.[0]

          userEmail = currenProfile?.email

          order.clientProfileData = {
            ...order.clientProfileData,
            email: userEmail,
            firstName: currenProfile?.email?.firstName,
            lastName: currenProfile?.email?.lastName,
            phone: currenProfile?.email?.phone,
          }
        }
      }
    } catch (error) {
      console.info(error)
    }

    try {
      const addressUnmask = await profile.getAddressUnmask(
        clientProfileData?.userProfileId,
        adminUserAuthToken
      )

      if (addressUnmask?.[0]?.document) {
        const address = addressUnmask?.[0]?.document

        order.shippingData.address = {
          ...order.shippingData.address,
          receiverName: address.receiverName,
          city: address.locality,
          postalCode: address.postalCode,
          street: address.route,
          number: address.streetNumber,
        }
      }
    } catch (error) {
      console.info(error)
    }
  }

  const customerEmail = getCustomerEmail(
    clientProfileData,
    {
      userProfile,
      appkey,
      inputEmail: storeUserEmail || userEmail || clientProfileData?.email,
      sellerId,
    },
    {
      logger,
    }
  )

  const response = await createOrdersToReturnSummary(order, customerEmail, {
    excludedCategories,
    returnRequestClient,
    catalogGQL,
  })

  return response
}
