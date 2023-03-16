import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import type {
  OrdersToReturnList,
  QueryOrdersAvailableToReturnArgs,
} from 'vtex.return-app'
import { FormattedMessage } from 'react-intl'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'

import ORDERS_AVAILABLE_TO_RETURN from '../../store/createReturnRequest/graphql/getOrdersAvailableToReturn.gql'
import { OrderList } from '../../common/components/ordersList/ListTable'
import { AdminLoader } from '../AdminLoader'

export const OrderListContainer = () => {
  const [ordersToReturn, setOrdersToReturn] = useState<OrdersToReturnList[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { data, loading, error, fetchMore, refetch } = useQuery<
    { ordersAvailableToReturn: OrdersToReturnList },
    QueryOrdersAvailableToReturnArgs
  >(ORDERS_AVAILABLE_TO_RETURN, {
    variables: {
      page: 1,
      isAdmin: true,
    },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    if (data) {
      setOrdersToReturn([data.ordersAvailableToReturn])
    }
  }, [data])

  const handlePagination = async (
    page: number,
    operation: 'next' | 'previous'
  ): Promise<void> => {
    const alreadyFetched = ordersToReturn.find((ordersItem) => {
      return ordersItem.paging?.currentPage === page
    })

    if (!alreadyFetched) {
      await fetchMore({
        variables: {
          page,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult

          setOrdersToReturn((prevState) => [
            ...prevState,
            fetchMoreResult.ordersAvailableToReturn,
          ])

          setCurrentPage(
            Number(fetchMoreResult.ordersAvailableToReturn.paging?.currentPage)
          )

          return prevResult
        },
      })

      return
    }

    operation === 'next' && setCurrentPage(page)
    operation === 'previous' && setCurrentPage(page)
  }

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage id="admin/return-app.return-order-list.page-header.title" />
          }
          subtitle={
            <FormattedMessage id="admin/return-app.return-order-list.page-header.subTitle" />
          }
        />
      }
    >
      <PageBlock variation="full" fit="fill">
        <>
          {loading || error || !ordersToReturn.length ? (
            <AdminLoader
              loading={loading}
              error={error}
              data={ordersToReturn}
              errorMessages={{
                errorTitle: (
                  <FormattedMessage id="admin/return-app.return-request-details.error.title" />
                ),
                errorDescription: (
                  <FormattedMessage id="admin/return-app.return-request-details.error.description" />
                ),
              }}
            />
          ) : (
            <OrderList
              orders={ordersToReturn[currentPage - 1]}
              handlePagination={handlePagination}
              refetch={refetch}
              isLoading={loading}
            />
          )}
        </>
      </PageBlock>
    </Layout>
  )
}