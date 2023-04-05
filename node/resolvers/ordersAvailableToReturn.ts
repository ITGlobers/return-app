import { ResolverError } from '@vtex/api'
import type { OrdersToReturnList, OrderToReturnSummary } from '../../typings/OrderToReturn'

import { SETTINGS_PATH } from '../utils/constants'
import { createOrdersToReturnSummary } from '../utils/createOrdersToReturnSummary'
import { getCurrentDate, substractDays } from '../utils/dateHelpers'

const ONE_MINUTE = 60 * 1000

function pacer(callsPerMinute: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done')
    }, ONE_MINUTE / callsPerMinute)
  })
}

const createParams = ({
  maxDays,
  userEmail,
  page = 1,
  filter,
}: {
  maxDays: number
  userEmail: string
  page: number
  filter?: {
    orderId: string
    sellerName: string
    createdIn: { from: string; to: string }
  }
}) => {
  const currentDate = getCurrentDate()

  let query = ''
  let seller = ''
  let creationDate = `creationDate:[${substractDays(
    currentDate,
    maxDays
  )} TO ${currentDate}]`

  if (filter) {
    const { orderId, sellerName, createdIn } = filter

    query = orderId || ''
    seller = sellerName || ''
    creationDate = createdIn
      ? `creationDate:[${createdIn.from} TO ${createdIn.to}]`
      : creationDate
  }

  return {
    clientEmail: userEmail,
    orderBy: 'creationDate,desc' as const,
    f_status: 'invoiced' as const,
    f_creationDate: creationDate,
    q: query,
    f_sellerNames: seller,
    page,
    per_page: 10 as const,
  }
}

export const ordersAvailableToReturn = async (
  _: unknown,
  args: {
    page: number
    storeUserEmail?: string
    isAdmin?: boolean
    filter?: {
      orderId: string
      sellerName: string
      createdIn: { from: string; to: string }
    }
  },
  ctx: Context
): Promise<OrdersToReturnList> => {
  const {
    state: { userProfile },
    clients: {
      appSettings,
      oms,
      returnRequest: returnRequestClient,
      catalogGQL,
    },
  } = ctx
  
  const { page, storeUserEmail, isAdmin, filter } = args

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings) {
    throw new ResolverError('Return App settings is not configured')
  }

  const { maxDays, excludedCategories } = settings
  const { email } = userProfile ?? {}

  let userEmail = (storeUserEmail ?? email) as string

  if (isAdmin) {
    userEmail = ''
  }

  // Fetch order associated to the user email
  const { list, paging } = await oms.listOrdersWithParams(
    createParams({ maxDays, userEmail, page, filter })
  )

  const orderListPromises = []

  for (const order of list) {
    // Fetch order details to get items and packages
    const orderPromise = oms.order(order.orderId)

    orderListPromises.push(orderPromise)

    // eslint-disable-next-line no-await-in-loop
    await pacer(2000)
  }

  const orders = await Promise.all(orderListPromises)

  const orderSummaryPromises: Array<Promise<OrderToReturnSummary>> = []

  for (const order of orders) {
    const orderToReturnSummary = createOrdersToReturnSummary(order, userEmail, {
      excludedCategories,
      returnRequestClient,
      catalogGQL,
    })

    orderSummaryPromises.push(orderToReturnSummary)
  }

  const orderList = await Promise.all(orderSummaryPromises)

  return { list: orderList, paging }
}
