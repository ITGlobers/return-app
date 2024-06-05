import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export class Catalog extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        'Content-Type': 'application/json',
        Accept: 'application/json',
        VtexIdClientAutCookie: ctx.adminUserAuthToken ?? ctx.authToken,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public getCategoryTree = async (): Promise<CategoryTree[]> =>
    this.http.get('/api/catalog_system/pub/category/tree/100', {
      metric: 'catalog-get-category-tree',
    })


  public getSKU = (skuId: string): Promise<any> =>
    this.http.get(`/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`, {
      metric: 'catalog-get-category-tree',
  })

  public getSKUBinding = (sellerId: string ,skuId: string): Promise<any> =>
    this.http.get(`/sku-binding/pvt/skuseller/${sellerId}/${skuId}`, {
      metric: 'catalog-get',
  })
}
