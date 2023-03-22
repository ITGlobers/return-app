import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

interface Props {
  userComment?: string | null
  isAdmin?: boolean
}

export const ConfirmComment = ({ userComment, isAdmin }: Props) => {
  const {
    hints: { phone },
  } = useRuntime()

  return (
    <>
      {!userComment ? null : (
        <div className={`${phone ? 'w-100' : 'w-40'}`}>
          <h2 className="mt0 mb6 pr6">
            <FormattedMessage id={`${isAdmin ? 'admin': 'store'}/return-app.confirm-and-submit.user-comment.title`} />
          </h2>
          <p className="f6 gray pr6">{userComment}</p>
        </div>
      )}
    </>
  )
}
