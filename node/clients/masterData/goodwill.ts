import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import { SCHEMAS } from '../../utils/constants'

export class GoodwillClient extends JanusClient {
  private entityName = 'obi_return_app_goodwill'

  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        VtexIdClientAutCookie: ctx.adminUserAuthToken ?? ctx.authToken,
      },
    })
  }

  public searchByOrderId = async (
    orderId: string
  ): Promise<Goodwill | undefined> =>
    this.http.get(`api/dataentities/${this.entityName}/search`, {
      metric: 'master-data-goodwill-get-id',
      params: {
        _fields: '_all',
        _schema: SCHEMAS.GOODWILL,
        _where: `orderId=${orderId}`,
      },
    })
}
