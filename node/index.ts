/* eslint-disable prettier/prettier */
import type {
  ClientsConfig,
  RecorderState,
  ParamsContext,
} from '@vtex/api'
import { Service, method, LRUCache } from '@vtex/api'

import { Clients } from './clients'
import { errorHandler } from './middlewares/errorHandler'
import { mutations, queries, resolvers } from './resolvers'
import { schemaDirectives } from './directives'
import { middlewares } from './middlewares'
import { exportRequests } from './middlewares/exportRequests'
import { ping } from './middlewares/ping'
import { setSchemaVersion } from './middlewares/setSchema'
import {
  createGoodwill,
  getGoodwills,
  updateGoodwill,
} from './middlewares/goodwill'
import { updateInvoice } from './middlewares/updateInvoice'
import invoice from './middlewares/invoice'
import { getOrderRefundsSummaryComplete } from './middlewares/getOrderRefundsSummaryComplete'
import { onAppsInstalled } from './events/keepAlive'
import { getOrderRefundsSummaryList } from './middlewares/getOrderRefundsSummaryList'

const {
  auth,
  authSelf,
  createReturn,
  getRequest,
  getRequestList,
  updateRequestStatus,
  saveAppSetting,
  returnAppSetting,
  saveSellerSetting,
  returnSellerSetting,
  sellerValidation,
  getOrdersList,
  createGiftcard,
  getOrderRefundsSummary,
  createPrerefund,
} = middlewares

const TIMEOUT_MS = 9000
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const catalogMemoryCache = new LRUCache<string, any>({ max: 9000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    catalog: {
      memoryCache: catalogMemoryCache,
    },
  },
}

declare global {
  interface State extends RecorderState {
    // Added in the state via graphql directive or auth middleware when request has vtexidclientautcookie
    userProfile?: UserProfile
    // Added in the state via auth middleware when request has appkey and apptoken.
    appkey?: string
    sellerId?: string
  }
}

export default new Service<Clients, State, ParamsContext>({
  clients,
  events: {
    keepALive: onAppsInstalled,
  },
  routes: {
    returnRequests: method({
      POST: [setSchemaVersion, errorHandler, sellerValidation, createReturn],
      GET: [setSchemaVersion, errorHandler, sellerValidation, getRequestList],
    }),
    _returnRequests: method({
      POST: [
        setSchemaVersion,
        errorHandler,
        auth,
        sellerValidation,
        createReturn,
      ],
      GET: [
        setSchemaVersion,
        errorHandler,
        auth,
        sellerValidation,
        getRequestList,
      ],
    }),
    returnRequest: method({
      GET: [setSchemaVersion, errorHandler, getRequest],
      PUT: [setSchemaVersion, errorHandler, updateRequestStatus],
    }),
    _returnRequest: method({
      GET: [setSchemaVersion, errorHandler, auth, getRequest],
      PUT: [setSchemaVersion, errorHandler, auth, updateRequestStatus],
    }),
    exportRequests: method({
      GET: [setSchemaVersion, errorHandler, authSelf, exportRequests],
    }),
    goodwill: method({
      POST: [setSchemaVersion, errorHandler, sellerValidation, createGoodwill],
      PUT: [setSchemaVersion, errorHandler, sellerValidation, updateGoodwill],
      GET: [setSchemaVersion, errorHandler, sellerValidation, getGoodwills],
    }),
    _goodwill: method({
      POST: [
        setSchemaVersion,
        errorHandler,
        auth,
        sellerValidation,
        createGoodwill,
      ],
      PUT: [setSchemaVersion, errorHandler, sellerValidation, updateGoodwill],
      GET: [
        setSchemaVersion,
        errorHandler,
        auth,
        sellerValidation,
        getGoodwills,
      ],
    }),
    preRefund: method({
      GET: [setSchemaVersion, errorHandler, createPrerefund],
    }),
    _preRefund: method({
      GET: [setSchemaVersion, errorHandler, auth, createPrerefund],
    }),
    settings: method({
      POST: [setSchemaVersion, errorHandler, saveAppSetting],
      PUT: [setSchemaVersion, errorHandler, saveAppSetting],
      GET: [setSchemaVersion, errorHandler, returnAppSetting],
    }),
    _settings: method({
      POST: [setSchemaVersion, errorHandler, auth, saveAppSetting],
      PUT: [setSchemaVersion, errorHandler, auth, saveAppSetting],
      GET: [setSchemaVersion, errorHandler, auth, returnAppSetting],
    }),
    sellerSetting: method({
      POST: [
        setSchemaVersion,
        errorHandler,
        sellerValidation,
        saveSellerSetting,
      ],
    }),
    _sellerSetting: method({
      POST: [
        setSchemaVersion,
        errorHandler,
        auth,
        sellerValidation,
        saveSellerSetting,
      ],
    }),
    sellerSettings: method({
      GET: [
        setSchemaVersion,
        errorHandler,
        sellerValidation,
        returnSellerSetting,
      ],
    }),
    _sellerSettings: method({
      GET: [
        setSchemaVersion,
        errorHandler,
        auth,
        sellerValidation,
        returnSellerSetting,
      ],
    }),
    orderList: method({
      POST: [setSchemaVersion, errorHandler, sellerValidation, getOrdersList],
    }),
    _orderList: method({
      POST: [
        setSchemaVersion,
        errorHandler,
        auth,
        sellerValidation,
        getOrdersList,
      ],
    }),
    giftcard: method({
      POST: [errorHandler, createGiftcard],
    }),
    _giftcard: method({
      POST: [errorHandler, auth, createGiftcard],
    }),
    ping: method({
      POST: [ping],
    }),
    invoice: method({
      POST: [setSchemaVersion, errorHandler, invoice],
      PUT: [setSchemaVersion, errorHandler, updateInvoice],
    }),
    _invoice: method({
      POST: [setSchemaVersion, errorHandler, auth, invoice],
      PUT: [setSchemaVersion, errorHandler, auth, updateInvoice],
    }),
    orderSummary: method({
      GET: [setSchemaVersion, errorHandler, getOrderRefundsSummaryComplete],
    }),
    orderSummaryList: method({
      POST: [setSchemaVersion, errorHandler, getOrderRefundsSummaryList],
    }),
    _orderSummary: method({
      GET: [setSchemaVersion, errorHandler, auth, getOrderRefundsSummary],
    })
  },
  graphql: {
    resolvers: {
      ...resolvers,
      Mutation: {
        ...mutations,
      },
      Query: {
        ...queries,
      },
    },
    schemaDirectives: {
      ...schemaDirectives,
    },
  },
})
