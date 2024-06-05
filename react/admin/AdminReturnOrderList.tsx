import React from 'react'

import { AlertProvider } from './provider/AlertProvider'
import { OrderListContainer } from './OrderList/OrderListContainer'

export const AdminOrderList = () => {
  return (
    <AlertProvider>
      <OrderListContainer />
      {}
    </AlertProvider>
  )
}
