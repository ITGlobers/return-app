import type { MutationCreateReturnRequestArgs } from '../../typings/ReturnRequest'
import { ExternalLogSeverity } from '../middlewares/errorHandler'
import { createReturnRequestService } from '../services/createReturnRequestService'

export const createReturnRequest = async (
  _: unknown,
  args: MutationCreateReturnRequestArgs,
  ctx: Context
) => {
  const { returnRequest } = args
  ctx.state.logs.push({
    message: 'Request received',
    middleware: 'Resolver create Return Request',
    severity: ExternalLogSeverity.INFO,
    payload: {
      details: 'Body of the request captured',
      stack: JSON.stringify(returnRequest),
    },
  })
  return createReturnRequestService(ctx, returnRequest)
}
