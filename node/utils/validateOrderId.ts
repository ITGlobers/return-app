export const validateOrderId = (orderId: string): string => {
  const orderIdParts = orderId.split('-')

  // Orderid From seller SRB-100029098-01
  // Orderid From marketplace 100029098-01
  if (orderIdParts.length === 3) {
    // return 100029098-01
    return `${orderIdParts[1]}-${orderIdParts[2]}`
  }

  return `${orderIdParts[0]}-${orderIdParts[1]}`
}
