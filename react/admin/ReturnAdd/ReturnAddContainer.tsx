import React from 'react'
import { Layout, PageHeader, PageBlock } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

export const ReturnAddContainer = () => {
  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage id="admin/return-app.return-add.page-header.title" />
          }
          subtitle={
            <FormattedMessage id="admin/return-app.return-add.page-header.subTitle" />
          }
        />
      }
    >
      <PageBlock variation="full" fit="fill">
        {/* <ListTable /> */}
      </PageBlock>
    </Layout>
  )
}
