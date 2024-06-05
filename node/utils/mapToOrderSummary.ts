import OrderRefundsSummary, { Transaction } from "../../typings/OrderRefundsSummary"
import { getErrorLog } from "./handleError"

export const mapToOrderSummary = async (
  ctx: Context,
  orderId: string
): Promise<OrderRefundsSummary> => {
 const {
    clients: { oms },
  } = ctx
  try {

    const order = await oms.order(orderId)
    let refundSummaryData: OrderRefundsSummary
    let transactions: Transaction[] = []
    const shippingValue =
        order.totals?.find((total) => total.id === 'Shipping')?.value ?? 0

      const orderValue = order.value - shippingValue

      const amountsAvailable = {
        order: 0,
        shipping: 0,
      }

      const items = await Promise.all( order.items.map((item , index) => ({
        id: item.id,
        sellerSku: item.sellerSku,
        itemIndex: index,
        unitCost: item.sellingPrice,
        quantity: item.quantity,
        amount: item.priceDefinition.total,
        amountAvailablePerItem: {
          amount: 0,
          quantity: 0,
        },
      })))

      refundSummaryData = {
        id: orderId,
        orderId: order.orderId,
        orderValue,
        shippingValue,
        amountsAvailable,
        items,
      }

      const Outputs = await Promise.all(order.packageAttachment.packages.filter( (pack: any ) => pack.type === 'Output' ))
      await Promise.all(Outputs.map((packages:any)=>{
        let sumAmountAvailable = 0
        packages.items.map((itemInvoices: any)=>{
          const posicion = itemInvoices.itemIndex
          let value = itemInvoices.price *  itemInvoices.quantity
          /*if(items[posicion].quantity === itemInvoices.quantity && value !== items[posicion].amount){
            value = items[posicion].amount
          }*/
          items[posicion].amountAvailablePerItem.quantity += itemInvoices.quantity
          items[posicion].amountAvailablePerItem.amount += value
          sumAmountAvailable += value
        })

        if(packages.invoiceValue > sumAmountAvailable){
          const shipping = packages.invoiceValue - sumAmountAvailable
          refundSummaryData.amountsAvailable.shipping += shipping
          /*if(refundSummaryData.amountsAvailable.shipping > shippingValue){
             refundSummaryData.amountsAvailable.shipping = shippingValue
          }*/
        }
          refundSummaryData.amountsAvailable.order += sumAmountAvailable
      }))

      const Inputs = await Promise.all(order.packageAttachment.packages.filter( (pack: any ) => pack.type === 'Input' ))
      await Promise.all(Inputs.map(async (packages:any)=>{
        let lessAmountAvailable = 0
        let shippingGoodwill = 0
        await Promise.all(packages.restitutions.Refund.items.map((itemRefund: any)=>{
          let itemSummary = items.find((itemSummary)=>
            itemSummary.sellerSku === itemRefund.id || itemSummary.id === itemRefund.id
          )
          if(itemRefund.isCompensation){
            if(itemRefund.id == null){
              //shipping goodwill
              shippingGoodwill += itemRefund.compensationValue
              refundSummaryData.amountsAvailable.shipping -= itemRefund.compensationValue
            }else{
              if(itemSummary){
                itemSummary.amountAvailablePerItem.quantity -= itemRefund.quantity
                itemSummary.amountAvailablePerItem.amount -= itemRefund.compensationValue
                lessAmountAvailable += itemRefund.compensationValue
              }
            }

          } else {
            if(itemSummary){
              let description
              try {
                description = JSON.parse(itemRefund.description)
              } catch (error) {}
              itemSummary.amountAvailablePerItem.quantity -= itemRefund.quantity
              itemSummary.amountAvailablePerItem.amount -= itemRefund.price === 0 ? description?.amount : itemRefund.quantity * itemRefund.price
              lessAmountAvailable += itemRefund.price === 0 ? description?.amount : itemRefund.quantity * itemRefund.price
            }
          }
        }))
        shippingGoodwill += lessAmountAvailable
        if(packages.invoiceValue > shippingGoodwill){
          const shipping = packages.invoiceValue - lessAmountAvailable
          refundSummaryData.amountsAvailable.shipping -= shipping
          if(refundSummaryData.amountsAvailable.shipping < 0){
             refundSummaryData.amountsAvailable.shipping = 0
          }
        }
        refundSummaryData.amountsAvailable.order -= lessAmountAvailable

        transactions.push({
          id: packages.invoiceNumber,
          amount: packages.invoiceValue ,
          status: 'accepted'
        })
      }))
    refundSummaryData.transactions = await Promise.all(transactions)
    return refundSummaryData
  } catch (error) {
    ctx.status = error.response?.status | 400
    throw new Error(getErrorLog(error.response , 'SUM000'))
  }
}
