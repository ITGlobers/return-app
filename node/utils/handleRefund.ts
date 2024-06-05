import { ResolverError } from '@vtex/api'

import type {
  Status,
  Maybe,
  ReturnRequest,
  GiftCard,
} from '../../typings/ReturnRequest'
import type { OMSCustom } from '../clients/oms'
import type { GiftCard as GiftCardClient } from '../clients/giftCard'

const getOneYearLaterDate = (createdAt: string) => {
  const date = new Date(createdAt)
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const oneYearLater = new Date(year + 1, month, day)

  return oneYearLater.toISOString()
}

interface HandleRefundProps {
  currentStatus: Status
  previousStatus?: Status
  refundPaymentData: ReturnRequest['refundPaymentData']
  orderId: string
  createdAt: string
  userEmail: string
  refundInvoice: ReturnRequest['refundData']
  clients: {
    omsClient: OMSCustom
    giftCardClient: GiftCardClient
  }
}

export const handleRefund = async ({
  currentStatus,
  previousStatus,
  refundPaymentData,
  orderId,
  createdAt,
  refundInvoice,
  clients,
  userEmail,
}: HandleRefundProps): Promise<Maybe<{ giftCard: GiftCard }>> => {
  // To avoid handling the amountRefunded after it has been already done, we check the previous status.
  // If the current status is already amountRefunded, it means the refund has already been done and we don't need to do it again.
  const shouldHandle =
    currentStatus === 'amountRefunded' &&
    previousStatus !== 'amountRefunded' &&
    refundInvoice

  if (!shouldHandle) {
    return null
  }

  const { omsClient, giftCardClient } = clients

  const { refundPaymentMethod, automaticallyRefundPaymentMethod } =
    refundPaymentData ?? {}

  if (refundPaymentMethod === 'giftCard') {
    try {
      const { id, redemptionCode } = await giftCardClient.createGiftCard({
        relationName: String(refundInvoice?.invoiceNumber),
        caption: 'Gift Card from Return Request',
        expiringDate: getOneYearLaterDate(createdAt),
        balance: 0,
        profileId: userEmail,
        discount: true,
      })

      const giftCardIdSplit = id.split('_')

      const giftCardId = giftCardIdSplit[giftCardIdSplit.length - 1]

      await giftCardClient.updateGiftCard(giftCardId, {
        description: 'Initial Charge',
        value: Number(refundInvoice?.invoiceValue),
      })

      return {
        giftCard: { id: giftCardId, redemptionCode },
      }
    } catch (error) {
      throw new ResolverError('Error creating/updating gift card')
    }
  }

  const refundPayment =
    refundPaymentMethod === 'card' ||
    (refundPaymentMethod === 'sameAsPurchase' &&
      automaticallyRefundPaymentMethod)

  if (refundPayment) {
    try {
      await omsClient.createInvoice(orderId, {
        type: 'Input',
        issuanceDate: createdAt,
        invoiceNumber: String(refundInvoice?.invoiceNumber),
        invoiceValue: Number(refundInvoice?.invoiceValue),
        items:
          refundInvoice?.items?.map((item) => {
            return {
              id: item.id,
              price: item.price - item.restockFee,
              quantity: item.quantity,
            }
          }) ?? [],
      })

      return null
    } catch (error) {
      throw new ResolverError('Error creating refund invoice')
    }
  }

  return null
}
