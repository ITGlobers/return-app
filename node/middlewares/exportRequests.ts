import type { Status } from 'vtex.return-app'
import Papa from 'papaparse'

import { returnRequestListService } from '../services/returnRequestListService'

function flattenObject(obj: any, prefix = ''): any {
  return Object.entries(obj).reduce((acc: any, [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null) {
      return { ...acc, ...flattenObject(value, newKey) }
    }

    acc[newKey] = value

    return acc
  }, {})
}

function generateCSV(data: any[]): string {
  const flattenedData = data.map((item) => flattenObject(item))

  return Papa.unparse(flattenedData)
}

export async function exportRequests(ctx: Context, next: () => Promise<void>) {
  const { query } = ctx

  const {
    _page,
    _perPage,
    _status,
    _sequenceNumber,
    _id,
    _dateSubmitted,
    _orderId,
    _userEmail,
    _allFields,
    _sellerName,
  } = query

  try {
    if (!_dateSubmitted) {
      throw new Error("The '_dateSubmitted' query parameter is required")
    }

    const [from, to] = (_dateSubmitted as string | undefined)?.split(',') ?? []

    const getAllFields = Boolean(_allFields)

    const requests = await returnRequestListService(
      ctx,
      {
        page: _page ? Number(_page) : 1,
        perPage: _perPage ? Number(_perPage) : 25,
        filter: {
          status: _status as Status | undefined,
          sequenceNumber: _sequenceNumber as string | undefined,
          id: _id as string | undefined,
          createdIn: _dateSubmitted ? { from, to } : undefined,
          orderId: _orderId as string | undefined,
          userEmail: _userEmail as string | undefined,
          sellerName: _sellerName as string | undefined,
        },
      },
      getAllFields
    )

    const file = generateCSV(requests.list)

    ctx.status = 200
    ctx.set('Content-Type', 'application/csv')
    ctx.set('Content-Disposition', `attachment; filename=request.csv`)
    ctx.body = file
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: error.message }
  }

  ctx.set('Cache-Control', 'no-cache')
  await next()
}
