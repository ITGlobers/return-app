/* eslint-disable array-callback-return */
import { ResolverError } from '@vtex/api'

import type {
  OrdersToReturnList,
  OrderToReturnSummary,
} from '../../typings/OrderToReturn'
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
  orderStatus = 'f_creationDate',
}: {
  maxDays: number
  userEmail: string
  page: number
  orderStatus?: string | any
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
    maxDays || 0
  )} TO ${currentDate}]`

  if (filter) {
    const { orderId, sellerName, createdIn } = filter

    query = orderId || ''
    seller = sellerName || ''
    creationDate = createdIn
      ? `creationDate:[${createdIn.from} TO ${createdIn.to}]`
      : creationDate
  }

  if (orderStatus === 'partial-invoiced') {
    return {
      clientEmail: userEmail,
      orderBy: 'creationDate,desc' as const,
      f_status: 'invoiced,payment-approved,handling,payment-pending',
      q: query,
      f_sellerNames: seller,
      page,
      per_page: 20 as const,
      f_creationDate: creationDate,
    }
  }

  return {
    clientEmail: userEmail,
    orderBy: 'creationDate,desc' as const,
    f_status: 'invoiced',
    [orderStatus]: creationDate,
    q: query,
    f_sellerNames: seller,
    page,
    per_page: 10 as const,
    f_creationDate: creationDate,
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
    clients: { appSettings, oms, returnRequestClient, catalogGQL },
  } = ctx

  const { page, storeUserEmail, isAdmin, filter } = args

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings) {
    throw new ResolverError('Return App settings is not configured')
  }

  const { maxDays, excludedCategories, orderStatus } = settings
  const { email } = userProfile ?? {}

  let userEmail = (storeUserEmail ?? email) as string

  if (isAdmin) {
    userEmail = ''
  }

  console.info('userEmail', userEmail)
  // Fetch order associated to the user email
  const { list, paging } = await oms.listOrdersWithParams(
    createParams({ maxDays, userEmail, page, filter, orderStatus })
  )

  const orderListPromises = []
  let orders: any = []
  let orderError = false

  for (const order of list) {
    // Fetch order details to get items and packages
    const orderPromise = oms.order(order.orderId)

    orderListPromises.push(orderPromise)

    // eslint-disable-next-line no-await-in-loop
    await pacer(2000)
  }

  try {
    orders = await Promise.all(orderListPromises)
  } catch (error) {
    orderError = true
  }

  if (orderError) {
    for (const order of list) {
      // Fetch order details to get items and packages
      oms.order(order.orderId).then((data) => orders.push(data))

      // eslint-disable-next-line no-await-in-loop
      await pacer(2000)
    }
  }

  const orderSummaryPromises: Array<Promise<OrderToReturnSummary>> = []

  for (const order of orders) {
    if (orderStatus === 'partial-invoiced' && order.status !== 'invoiced') {
      const currentDate = getCurrentDate()
      const startDate = substractDays(currentDate, maxDays || 0)
      const endDate = currentDate

      const deliveredDate = order.packageAttachment.packages.filter(
        (item: any) => {
          if (item?.courierStatus?.deliveredDate || item?.issuanceDate) {
            return item
          }
        }
      )

      if (deliveredDate.length > 0) {
        const haspackage = deliveredDate.map((delivered: any) => {
          const currentDeliveredDate =
            delivered?.courierStatus?.deliveredDate || delivered?.issuanceDate

          if (
            currentDeliveredDate &&
            currentDeliveredDate >= startDate &&
            currentDeliveredDate <= endDate
          ) {
            return delivered
          }
        })

        if (haspackage.length > 0) {
          const orderToReturnSummary = createOrdersToReturnSummary(
            order,
            userEmail,
            {
              excludedCategories,
              returnRequestClient,
              catalogGQL,
            }
          )

          orderSummaryPromises.push(orderToReturnSummary)
        }
      }
    } else {
      const orderToReturnSummary = createOrdersToReturnSummary(
        order,
        userEmail,
        {
          excludedCategories,
          returnRequestClient,
          catalogGQL,
        }
      )

      orderSummaryPromises.push(orderToReturnSummary)
    }
  }

  const orderList = await Promise.all(orderSummaryPromises)

  return {
    list: orderList,
    paging: {
      ...paging,
      perPage: orderList?.length || 0,
      total: paging.total <= 20 ? orderList.length : paging.total,
    },
  }
}
