import { IOClients, Sphinx } from '@vtex/api'
import { vbaseFor, masterDataFor } from '@vtex/clients'

import type { ReturnAppSettings } from '../../typings/ReturnAppSettings'
import { Catalog } from './catalog'
import { OMSCustom as OMS } from './oms'
import { GiftCard } from './giftCard'
import { MailClient } from './mail'
import Checkout from './checkout'
import { VtexId } from './vtexId'
import { CatalogGQL } from './catalogGQL'
import ReturnRequestClient from './returnRequest'
import OrderRefundsSummaryClient from './orderRefundsSummary'
import { ProfileClient } from './profile'
import { Marketplace } from './marketplace'
import Scheduler from './scheduler'
import type { SellerSetting } from '../../typings/SellerSetting'

const ReturnAppSettingsClient = vbaseFor<string, ReturnAppSettings>(
  'appSettings'
)

const GoodwillClient = masterDataFor<Goodwill>('goodwill')
const SellerSettingClient = masterDataFor<SellerSetting>('sellerSetting')

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

  public get returnRequestClient() {
    return this.getOrSet('ReturnRequestClient', ReturnRequestClient)
  }

  public get orderRefundsSummaryClient() {
    return this.getOrSet('OrderRefundsSummaryClient', OrderRefundsSummaryClient)
  }

  public get goodwill() {
    return this.getOrSet('goodwill', GoodwillClient)
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
