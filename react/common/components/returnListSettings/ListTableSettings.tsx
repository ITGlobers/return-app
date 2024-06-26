import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Table, EmptyState } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import ReturnListTableSchemaSettings from './ListTableSchemaSettings'
import JumpToPageSettings from './JumpToPageSettings'
import ListTableFilterSettings from './ListTableFilterSettings'
import { useSettingsRequestList } from '../../../hooks/useSettingsRequestList'

const CSS_HANDLES = ['listTableContainer'] as const

const ListTableSettings = () => {
  const {
    returnRequestData: { data, loading, error, refetch },
  } = useSettingsRequestList()

  const {
    route: { domain },
    hints: { mobile, phone },
  } = useRuntime()

  const isAdmin = domain === 'admin'

  const handles = useCssHandles(CSS_HANDLES)

  const { returnSettingsList } = data ?? {}
  const { list, paging } = returnSettingsList ?? {}

  let pageItemFrom = 0
  let pageItemTo = 0

  if (paging && list?.length) {
    const { currentPage, total, perPage, pages } = paging

    pageItemFrom = currentPage === 1 ? 1 : (currentPage - 1) * perPage + 1
    pageItemTo = currentPage === pages ? total : currentPage * perPage
  }

  const handleNextPage = () => {
    if (!paging) return

    const { currentPage, pages } = paging

    if (currentPage === pages) return

    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    refetch({ page: currentPage + 1 })
  }

  const handlePrevPage = () => {
    if (!paging) return

    const { currentPage } = paging

    if (currentPage === 1) return

    refetch({ page: currentPage - 1 })
  }

  const handleJumpToPage = (desiredPage: number) => {
    desiredPage && refetch({ page: desiredPage })
  }

  const returnsListSchema = useMemo(() => ReturnListTableSchemaSettings(), [])

  if (error) {
    return (
      <EmptyState
        title={
          <FormattedMessage id="return-app.return-request-list.error.title" />
        }
      >
        <FormattedMessage id="return-app.return-request-list.error.description" />
      </EmptyState>
    )
  }

  return (
    <div className={handles.listTableContainer}>
      {mobile && !isAdmin ? null : (
        <ListTableFilterSettings
          refetch={refetch}
          loading={loading}
          isDisabled={!list?.length}
        />
      )}
      <Table
        fullWidth
        loading={loading}
        items={list}
        emptyStateLabel={
          <FormattedMessage id="return-app.return-request-list.table.emptyState" />
        }
        emptyStateChildren={
          <p>
            <FormattedMessage id="return-app.return-request-list.table.emptyState-children" />
          </p>
        }
        schema={returnsListSchema}
        pagination={{
          textOf: (
            <FormattedMessage id="return-app.return-request-list.table-pagination.textOf" />
          ),
          onNextClick: handleNextPage,
          onPrevClick: handlePrevPage,
          currentItemFrom: pageItemFrom,
          currentItemTo: pageItemTo,
          totalItems: paging?.total,
        }}
      />
      {!phone && paging && list?.length && !loading ? (
        <JumpToPageSettings
          handleJumpToPage={handleJumpToPage}
          currentPage={paging.currentPage}
          maxPage={paging.pages}
        />
      ) : null}
    </div>
  )
}

export default ListTableSettings
