import { v4 as uuid } from 'uuid'

export default async function createGoodwillService(
  ctx: Context,
  goodwillData: Goodwill
): Promise<any> {
  const {
    clients: { goodwill },
  } = ctx

  goodwillData.id = uuid()
  goodwillData.status = 'draft'

  const log = {
    date: new Date(),
    status: 'draft',
    detail: 'Goodwill created',
  }

  goodwillData.logs = [
    {
      detail: JSON.stringify(log),
    },
  ]

  return goodwill.save(goodwillData)
}
