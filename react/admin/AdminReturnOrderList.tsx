import React from 'react'
import { OrderListContainer } from './OrderList/OrderListContainer'

// import { ReturnDetailsContainer } from './ReturnDetails/ReturnDetailsContainer'
import { AlertProvider } from './provider/AlertProvider'
// import { ReturnDetailsProvider } from '../common/provider/ReturnDetailsProvider'
// import { UpdateRequestStatusProvider } from './provider/UpdateRequestStatusProvider'

// interface CustomRouteProps {
//   params: {
//     id: string
//   }
// }

export const AdminOrderList = () => {
// export const AdminReturnAdd = ({ params }: CustomRouteProps) => {
  return (
    <AlertProvider>
      <OrderListContainer />
      {/* <ReturnDetailsProvider requestId={params.id}>
        <UpdateRequestStatusProvider>
          <ReturnDetailsContainer />
        </UpdateRequestStatusProvider>
      </ReturnDetailsProvider> */}
    </AlertProvider>
  )
}
