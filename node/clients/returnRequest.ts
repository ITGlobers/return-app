import { masterDataFor } from '@vtex/clients'
import type { ReturnRequest } from 'vtex.return-app'

const ReturnRequestClient = masterDataFor<ReturnRequest>('returnRequest')

export default ReturnRequestClient
