import React from 'react'

// import { ReturnDetailsContainer } from './ReturnDetails/ReturnDetailsContainer'
import { AlertProvider } from './provider/AlertProvider'
import { ReturnAddContainer } from './ReturnAdd/ReturnAddContainer'
// import { ReturnDetailsProvider } from '../common/provider/ReturnDetailsProvider'
// import { UpdateRequestStatusProvider } from './provider/UpdateRequestStatusProvider'

interface CustomRouteProps {
  params: {
    id: string
  }
}

export const AdminReturnAdd = ({ params }: CustomRouteProps) => {
  return (
    <AlertProvider>
      {/* <ReturnDetailsProvider requestId={params.id}>
        <UpdateRequestStatusProvider>
          <ReturnDetailsContainer />
        </UpdateRequestStatusProvider>
      </ReturnDetailsProvider> */}
        {params.id}
      <ReturnAddContainer />
    </AlertProvider>
  )
}
