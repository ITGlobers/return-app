import { UserInputError } from '@vtex/api'

const getGoodwillsService = async (ctx: Context, id?: string) => {
  const {
    clients: { goodwill },
  } = ctx

  const fields = [
    'id,orderId,sellerId,status,goodwillCreditId,goodwillCreditAmount,shippingCost,items,reason,logs',
  ]

  if (!id) {
    const pagination = {
      page: 1,
      pageSize: 100,
    }

    const sort = 'createdIn DESC'

    return goodwill.searchRaw(pagination, fields, sort)
  }

  const response = await goodwill.get(id, fields)

  if (!response) {
    throw new UserInputError("Goodwill doesn't exist")
  }

  return response
}

export default getGoodwillsService
