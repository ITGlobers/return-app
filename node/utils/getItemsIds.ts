
export const getItemsIds = async (ctx: Context, body: any , sellerId: string) => {
  try {
    const {
      clients: { catalog },
    } = ctx

    await Promise.all(
      body.items.map(async (item: any) => {
        const response = await catalog.getSKUBinding(sellerId, item.id)
        if(response.StockKeepingUnitId){
          item.id = response.StockKeepingUnitId
        }
      })
    )

    return body
  } catch (error) {
    return body
  }
}
