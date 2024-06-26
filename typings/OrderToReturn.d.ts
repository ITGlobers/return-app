import type { AddressType } from './ReturnRequest'
import type { Scalars, Maybe, InputMaybe } from './Shared'

export { Scalars, Maybe, InputMaybe }

export type CategoryInfo = {
  __typename?: 'CategoryInfo'
  id: Scalars['String']
  name: Scalars['String']
}

export type OrdersToReturnList = {
  __typename?: 'OrdersToReturnList'
  list?: Maybe<Array<Maybe<OrderToReturnSummary>>>
  paging?: Maybe<Pagination>
}

export type AvailableAmountsToRefund = {
  initialInvoicedAmount?: Scalars['Int']
  amountToBeRefundedInProcess?: Scalars['Int']
  totalRefunded?: Scalars['Int']
  remainingRefundableAmount?: Scalars['Int']
}

export type OrderToReturnSummary = {
  __typename?: 'OrderToReturnSummary'
  orderId: Scalars['String']
  sellerName: Scalars['String']
  creationDate: Scalars['String']
  /** Items invoiced / sent to costumer with items details. */
  invoicedItems: InvoicedItem[]
  /**
   * Items committed to return or already returned (invoiced as Input) that cannot be considered to be returned anymore.
   * The itemIndex property is used to identify the item in the list of invoiced items.
   */
  processedItems: ProcessedItem[]
  /**
   * Items forbidden to be return.
   * The itemIndex property is used to identify the item in the list of invoiced items.
   */
  excludedItems: ExcludedItem[]
  clientProfileData: ClientProfileData
  shippingData: ShippingData
  paymentData: PaymentData
}

export type Pagination = {
  __typename?: 'Pagination'
  total: Scalars['Int']
  pages: Scalars['Int']
  currentPage: Scalars['Int']
  perPage: Scalars['Int']
}

export type InvoicedItem = {
  __typename?: 'InvoicedItem'
  id: Scalars['String']
  productId: Scalars['String']
  quantity: Scalars['Int']
  name: Scalars['String']
  localizedName?: Maybe<Scalars['String']>
  imageUrl: Scalars['String']
  /** The index of the item in the Order. */
  orderItemIndex: Scalars['Int']
}

export type ProcessedItem = {
  __typename?: 'ProcessedItem'
  itemIndex: Scalars['Int']
  quantity: Scalars['Int']
}

export type ExcludedItem = {
  __typename?: 'excludedItem'
  itemIndex: Scalars['Int']
  reason: ExcludedReason
}

export type ExcludedReason = {
  __typename?: 'ExcludedReason'
  key: ExcludedReasonEnum
  value: Scalars['String']
}

export type ExcludedReasonEnum = 'EXCLUDED_CATEGORY'

export type OrderToReturnValidation = 'OUT_OF_MAX_DAYS' | 'ORDER_NOT_INVOICED'

export type ClientProfileData = {
  __typename?: 'ClientProfileData'
  name: Scalars['String']
  email: Scalars['String']
  phoneNumber: Scalars['String']
}

export type ShippingData = {
  __typename?: 'ShippingData'
  addressId: Scalars['String']
  address: Scalars['String']
  city: Scalars['String']
  state: Scalars['String']
  country: Scalars['String']
  zipCode: Scalars['String']
  addressType: AddressType
  geoCoordinates: Array<Maybe<Scalars['Float']>>
}

export type PaymentData = {
  __typename?: 'PaymentData'
  canRefundCard: Scalars['Boolean']
}

export type CreatedInInput = {
  from: Scalars['String']
  to: Scalars['String']
}

export type OrdersFilters = {
  createdIn?: InputMaybe<CreatedInInput>
  orderId?: InputMaybe<Scalars['String']>
  sellerName?: InputMaybe<Scalars['String']>
}

export type QueryOrdersAvailableToReturnArgs = {
  page: Scalars['Int']
  storeUserEmail?: Maybe<Scalars['String']>
  isAdmin?: Maybe<Scalars['Boolean']>
  filter?: Maybe<OrdersFilters>
}

export type QueryOrderToReturnSummaryArgs = {
  orderId: Scalars['ID']
  storeUserEmail?: Maybe<Scalars['String']>
}
