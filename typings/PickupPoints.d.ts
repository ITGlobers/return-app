import type { Scalars, Maybe } from './Shared'

export { Scalars, Maybe }

export type CheckoutPickupPoint = {
  __typename?: 'CheckoutPickupPoint'
  pickupPoint: PickupPoint
}

export type PickupPoint = {
  __typename?: 'PickupPoint'
  friendlyName: Scalars['String']
  address: CheckoutAddress
  id: Scalars['String']
}

export type CheckoutAddress = {
  __typename?: 'CheckoutAddress'
  addressType: Scalars['String']
  addressId: Scalars['String']
  isDisposable: Scalars['Boolean']
  postalCode: Scalars['String']
  city: Scalars['String']
  state: Scalars['String']
  country: Scalars['String']
  street: Scalars['String']
  number?: Maybe<Scalars['String']>
  neighborhood?: Maybe<Scalars['String']>
  complement?: Maybe<Scalars['String']>
  reference?: Maybe<Scalars['String']>
  geoCoordinates: Array<Maybe<Scalars['Float']>>
}

export type QueryNearestPickupPointsArgs = {
  lat: Scalars['String']
  long: Scalars['String']
}

export type NearPickupPointQueryResponse = {
  __typename?: 'NearPickupPointQueryResponse'
  items: CheckoutPickupPoint[]
}
