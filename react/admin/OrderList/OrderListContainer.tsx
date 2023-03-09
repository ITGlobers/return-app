import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

export const OrderListContainer = () => {
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
        >
        </PageHeader>
      }
    >
      <PageBlock variation="full" fit="fill">
        {/* <ListTable /> */}
      </PageBlock>
    </Layout>
  )
}
