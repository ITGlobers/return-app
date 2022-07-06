import React from 'react'
import { Table } from 'vtex.styleguide'
import type { IntlFormatters } from 'react-intl'
import { FormattedDate, useIntl, FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { useReturnDetails } from '../../../common/hooks/useReturnDetails'
import {
  createStatusTimeline,
  statusMessageIdAdmin,
} from '../../../utils/requestStatus'

const statusHistorySchema = (
  formatMessage: IntlFormatters['formatMessage'],
  isAdmin: boolean
) => ({
  properties: {
    createdAt: {
      title: (
        <FormattedMessage id="return-app.return-request-details.table.status-history.header.created-at" />
      ),
      cellRenderer: function CreatedAt({ cellData }) {
        return (
          <FormattedDate
            value={cellData}
            day="numeric"
            month="long"
            year="numeric"
            hour="numeric"
            minute="numeric"
            second="numeric"
          />
        )
      },
    },
    status: {
      title: (
        <FormattedMessage id="return-app.return-request-details.table.status-history.header.status" />
      ),
      cellRenderer: function Status({ cellData }) {
        return formatMessage(statusMessageIdAdmin[cellData])
      },
    },
    ...(isAdmin
      ? {
          submittedBy: {
            title: (
              <FormattedMessage id="return-app.return-request-details.table.status-history.header.submitted-by" />
            ),
          },
        }
      : null),
  },
})

export const StatusHistory = () => {
  const { data } = useReturnDetails()
  const { formatMessage } = useIntl()
  const {
    route: { domain },
  } = useRuntime()

  const isAdmin = domain === 'admin'

  if (!data) return null

  const { status, refundStatusData } = data.returnRequestDetails

  const timeline = createStatusTimeline(status, refundStatusData).filter(
    ({ visited }) => visited
  )

  return (
    <section className="mv4">
      <h3>
        <FormattedMessage id="return-app.return-request-details.status-history.title" />
      </h3>
      <Table
        fullWidth
        schema={statusHistorySchema(formatMessage, isAdmin)}
        items={timeline}
      />
    </section>
  )
}
