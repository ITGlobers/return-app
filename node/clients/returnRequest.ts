import { masterDataFor } from '@vtex/clients'

import type { ReturnRequest } from '../../typings/ReturnRequest'

const ReturnRequestClient = masterDataFor<ReturnRequest>('returnRequest')

export default ReturnRequestClient
