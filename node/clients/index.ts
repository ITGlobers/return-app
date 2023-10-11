import { IOClients, Sphinx } from '@vtex/api'
import { vbaseFor, masterDataFor } from '@vtex/clients'

import type { ReturnAppSettings } from '../../typings/ReturnAppSettings'
import type { ReturnRequest } from '../../typings/ReturnRequest'
import type { SellerSetting } from '../../typings/SellerSetting'
import { Catalog } from './catalog'
import { OMSCustom as OMS } from './oms'
import { GiftCard } from './giftCard'
import { MailClient } from './mail'
import Checkout from './checkout'
import { VtexId } from './vtexId'
import { CatalogGQL } from './catalogGQL'
import { ProfileClient } from './profile'
import { Marketplace } from './marketplace'
import Scheduler from './scheduler'

const ReturnAppSettingsClient = vbaseFor<string, ReturnAppSettings>(
  'appSettings'
)

const ReturnRequestClient = masterDataFor<ReturnRequest | any>('returnRequest')
const SellerSettingClient = masterDataFor<SellerSetting>('sellerSetting')
const OrderRefundDetails =
  masterDataFor<OrderRefundDetails>('orderRefundDetails')

export class Clients extends IOClients {
  public get oms() {
    return this.getOrSet('oms', OMS)
  }

  public get appSettings() {
    return this.getOrSet('appSettings', ReturnAppSettingsClient)
  }

  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get catalogGQL() {
    return this.getOrSet('catalogGQL', CatalogGQL)
  }

  public get returnRequest() {
    return this.getOrSet('returnRequest', ReturnRequestClient)
  }

  public get orderRefundDetails() {
    return this.getOrSet('orderRefundDetails', OrderRefundDetails)
  }

  public get sellerSetting() {
    return this.getOrSet('sellerSetting', SellerSettingClient)
  }

  public get giftCard() {
    return this.getOrSet('giftCard', GiftCard)
  }

  public get mail() {
    return this.getOrSet('mail', MailClient)
  }

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }

  public get vtexId() {
    return this.getOrSet('vtexId', VtexId)
  }

  public get sphinx() {
    return this.getOrSet('sphinx', Sphinx)
  }

  public get profile() {
    return this.getOrSet('profile', ProfileClient)
  }

  public get marketplace() {
    return this.getOrSet('marketplace', Marketplace)
  }

  public get scheduler() {
    return this.getOrSet('scheduler', Scheduler)
  }
}
