import type { InstanceOptions, IOContext } from '@vtex/api'
import type { NotificationResponse, NotificationInput } from '@vtex/clients'
import { OMS } from '@vtex/clients'

const baseURL = '/api/oms'
const baseURLInvoice = 'http://portal.vtexcommercestable.com.br/api/oms/pvt/orders/'

const routes = {
  orders: `${baseURL}/pvt/orders`,
  invoice: (orderId: string) => `${baseURL}/pvt/orders/${orderId}/invoice`,
  invoiceSeller: (orderId: string, seller: string) => `${baseURLInvoice}${orderId}/invoice?an=${seller}`,
}

interface OrderList {
  // This API returns more than orderId, but we only need the orderId so far
  list: Array<{ orderId: string; creationDate: string }>
  paging: {
    total: number
    pages: number
    currentPage: number
    perPage: number
  }
}

type InputInvoiceFields = Omit<
  NotificationInput,
  'invoiceKey' | 'invoiceUrl' | 'courier' | 'trackingNumber' | 'trackingUrl'
>

interface OrderListParams {
  q: string
  clientEmail: string
  orderBy: 'creationDate,desc'
  f_status: string
  f_creationDate?: string
  f_authorizedDate?: string
  f_invoicedDate?: string
  page: number
  per_page: number
}

export class OMSCustom extends OMS {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
    })
  }

  public listOrdersWithParams({ q, ...params }: OrderListParams) {
    const requets = this.http.get<OrderList>(routes.orders, {
      headers: {
        VtexIdClientAutCookie: this.context.authToken,
      },
      metric: 'oms-list-order-with-params',
      params: {
        q,
        ...params,
      },
    })

    return requets
  }

  public createInvoice(orderId: string, invoice: InputInvoiceFields) {
    return this.http.post<NotificationResponse>(
      routes.invoice(orderId),
      invoice,
      {
        headers: {
          VtexIdClientAutCookie:
            this.context.adminUserAuthToken ?? this.context.authToken ?? '',
          'X-Vtex-Use-Https': 'true',
        },
        metric: 'oms-create-invoice',
      }
    )
  }


}
