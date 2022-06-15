import React from 'react'
import { FormattedMessage } from 'react-intl'

import { useReturnDetails } from '../../hooks/useReturnDetails'

export const PickupAddress = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  const {
    returnRequestDetails: {
      pickupReturnData: { country, state, address, zipCode, city, addressType },
    },
  } = data

  const pickupAddressMessageRoute =
    'admin/return-app.return-request-details.pickup-address'

  return (
    <section className="flex-ns flex-wrap flex-auto flex-column pt4 pb4">
      <h3>
        <FormattedMessage id={`${pickupAddressMessageRoute}.title`} />
      </h3>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage id={`${pickupAddressMessageRoute}.pickup-type`} />:{' '}
          {addressType === 'PICKUP_POINT' ? (
            <FormattedMessage
              id={`${pickupAddressMessageRoute}.pickup-type.pickup-point`}
            />
          ) : (
            <FormattedMessage
              id={`${pickupAddressMessageRoute}.pickup-type.customer-address`}
            />
          )}
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage
            id={`${pickupAddressMessageRoute}.country`}
            values={{
              country,
            }}
          />
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage
            id={`${pickupAddressMessageRoute}.locality`}
            values={{
              city,
            }}
          />
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage
            id={`${pickupAddressMessageRoute}.address`}
            values={{
              address,
            }}
          />
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage
            id={`${pickupAddressMessageRoute}.state`}
            values={{
              state,
            }}
          />
        </p>
      </div>
      <div className="mb5">
        <p className="ma0">
          <FormattedMessage
            id={`${pickupAddressMessageRoute}.zip`}
            values={{
              zipCode,
            }}
          />
        </p>
      </div>
    </section>
  )
}
