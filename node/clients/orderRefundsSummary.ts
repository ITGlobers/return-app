import { masterDataFor } from '@vtex/clients'

import type { OrderRefundsSummary } from '../typings/orderRefundsSummary'

const OrderRefundsSummaryClient = masterDataFor<OrderRefundsSummary>(
  'orderRefundsSummary'
)

export default OrderRefundsSummaryClient
