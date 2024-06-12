import { masterDataFor } from '@vtex/clients'

import type { OrderRefundsSummary } from '../../typings/OrderRefundsSummary'

const OrderRefundsSummaryClient = masterDataFor<OrderRefundsSummary>(
  'orderRefundsSummary'
)

export default OrderRefundsSummaryClient
