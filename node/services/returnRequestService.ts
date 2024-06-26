import { ResolverError } from '@vtex/api'

export const returnRequestService = async (
  ctx: Context,
  requestId: string,
  fields = ['_all']
) => {
  const {
    clients: { returnRequestClient },
  } = ctx

  const returnRequestResult = await returnRequestClient.get(requestId, fields)

  if (!returnRequestResult) {
    // Code error 'E_HTTP_404' to match the one when failing to find and order by OMS
    throw new ResolverError(`Request ${requestId} not found`, 404, 'E_HTTP_404')
  }

  return returnRequestResult
}
