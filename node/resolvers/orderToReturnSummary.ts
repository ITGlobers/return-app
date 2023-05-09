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
    state: { userProfile, appkey },
    clients: {
      appSettings,
      oms,
      returnRequest: returnRequestClient,
      catalogGQL,
      vtexId
    },
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
  })

  canOrderBeReturned({
    creationDate,
    maxDays,
    status,
    orderStatus
  })
  
  console.log('userProfileId: ', clientProfileData?.userProfileId)
  console.log('adminUserAuthToken: ', adminUserAuthToken)
  if(userProfile?.role === 'admin'){
    try {
      const profile = await vtexId.searchEmailByUserId(clientProfileData?.userProfileId, adminUserAuthToken)
      console.log('profile: ', profile)
      userEmail = profile?.[0]?.document?.email

      if(!userEmail){
        const response = await vtexId.getProfileUnmask(clientProfileData?.userProfileId, adminUserAuthToken)
        userEmail = response?.[0]?.email
      }

    } catch (error) {
      console.log('error: ', error)
    }
  }

  const customerEmail = getCustomerEmail(
    clientProfileData,
    {
      userProfile,
      appkey,
      inputEmail: storeUserEmail || userEmail || clientProfileData?.email,
    },
    {
      logger,
    }
  )

  return createOrdersToReturnSummary(order, customerEmail, {
    excludedCategories,
    returnRequestClient,
    catalogGQL,
  })
}
