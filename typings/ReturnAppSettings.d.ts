import type { Scalars, Maybe, InputMaybe } from './Shared'

export { Scalars, Maybe, InputMaybe }

export type ReturnAppSettings = {
  __typename?: 'ReturnAppSettings'
  maxDays: Scalars['Int']
  excludedCategories: Array<Scalars['String']>
  paymentOptions: PaymentOptions
  termsUrl: Scalars['String']
  customReturnReasons?: Maybe<CustomReturnReason[]>
  options?: Maybe<ReturnOption>
  orderStatus: Scalars['String']
  sellerId?: Scalars['String']
}

export type PaymentOptions = {
  __typename?: 'PaymentOptions'
  enablePaymentMethodSelection?: Maybe<Scalars['Boolean']>
  allowedPaymentTypes: PaymentType
  automaticallyRefundPaymentMethod?: Maybe<Scalars['Boolean']>
}

export type PaymentType = {
  __typename?: 'PaymentType'
  bank?: Maybe<Scalars['Boolean']>
  card?: Maybe<Scalars['Boolean']>
  giftCard?: Maybe<Scalars['Boolean']>
}

export type CustomReturnReason = {
  __typename?: 'CustomReturnReason'
  reason: Scalars['String']
  maxDays: Scalars['Int']
  translations?: Maybe<CustomReturnReasonTranslation[]>
}

export type CustomReturnReasonTranslation = {
  __typename?: 'CustomReturnReasonTranslation'
  locale: Scalars['String']
  translation: Scalars['String']
}

export type ReturnOption = {
  __typename?: 'ReturnOption'
  enableOtherOptionSelection?: Maybe<Scalars['Boolean']>
  enablePickupPoints?: Maybe<Scalars['Boolean']>
  enableProportionalShippingValue?: Maybe<Scalars['Boolean']>
  enableSelectItemCondition?: Maybe<Scalars['Boolean']>
  enableHighlightFormMessage?: Maybe<Scalars['Boolean']>
  enableGoodwill?: Maybe<Scalars['Boolean']>
}

export type ReturnAppSettingsInput = {
  maxDays: Scalars['Int']
  excludedCategories: Array<Scalars['String']>
  paymentOptions: PaymentOptionsInput
  termsUrl: Scalars['String']
  customReturnReasons?: InputMaybe<CustomReturnReasonInput[]>
  options?: InputMaybe<ReturnOptionInput>
  orderStatus: Scalars['String']
  sellerId?: Scalars['String']
}

export type PaymentOptionsInput = {
  enablePaymentMethodSelection?: InputMaybe<Scalars['Boolean']>
  allowedPaymentTypes: PaymentTypeInput
  automaticallyRefundPaymentMethod?: InputMaybe<Scalars['Boolean']>
}

export type PaymentTypeInput = {
  bank?: InputMaybe<Scalars['Boolean']>
  card?: InputMaybe<Scalars['Boolean']>
  giftCard?: InputMaybe<Scalars['Boolean']>
}

export type CustomReturnReasonInput = {
  reason: Scalars['String']
  maxDays: Scalars['Int']
  translations?: InputMaybe<CustomReturnReasonTranslationInput[]>
}

export type CustomReturnReasonTranslationInput = {
  locale: Scalars['String']
  translation: Scalars['String']
}

export type ReturnOptionInput = {
  enableOtherOptionSelection?: InputMaybe<Scalars['Boolean']>
  enablePickupPoints?: InputMaybe<Scalars['Boolean']>
  enableProportionalShippingValue?: InputMaybe<Scalars['Boolean']>
  enableSelectItemCondition?: InputMaybe<Scalars['Boolean']>
  enableHighlightFormMessage?: Maybe<Scalars['Boolean']>
  enableGoodwill?: Maybe<Scalars['Boolean']>
}

export type MutationSaveReturnAppSettingsArgs = {
  settings: ReturnAppSettingsInput
}

export type QueryReturnSettingsListArgs = {
  filter?: Maybe<ReturnSettingsFilters>
  page: Scalars['Int']
  perPage?: Maybe<Scalars['Int']>
}

export type ReturnSettingsList = {
  __typename?: 'ReturnSettingsList'
  list: ReturnSettingsResponse[]
  paging: Pagination
}

export type ReturnSettingsResponse = {
  __typename?: 'ReturnSettingsResponse'
  id: Scalars['ID']
  sellerId?: Maybe<Scalars['String']>
  maxDays: Scalars['Int']
  excludedCategories: Array<Scalars['String']>
  paymentOptions: PaymentOptions
  termsUrl: Scalars['String']
  customReturnReasons?: Maybe<CustomReturnReason[]>
  options?: Maybe<ReturnOption>
}

export type Pagination = {
  __typename?: 'Pagination'
  total: Scalars['Int']
  pages: Scalars['Int']
  currentPage: Scalars['Int']
  perPage: Scalars['Int']
}
