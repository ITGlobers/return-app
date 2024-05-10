<a name="top"></a>
# return-app (OBI) v3.16.35-hkignore

App to returns

# Table of contents

- [Goodwill](#Goodwill)
  - [Retrieve Goodwill Credits](#Retrieve-Goodwill-Credits)
  - [Update Goodwill Credit](#Update-Goodwill-Credit)
- [ReturnApp](#ReturnApp)
  - [Retrieve Return App Order Summary](#Retrieve-Return-App-Order-Summary)
- [ReturnRequest](#ReturnRequest)
  - [Create Return Request](#Create-Return-Request)
  - [Retrieve a Return Request](#Retrieve-a-Return-Request)
  - [Retrieve Return Request List](#Retrieve-Return-Request-List)
  - [Update a Return Request Status](#Update-a-Return-Request-Status)

___


# <a name='Goodwill'></a> Goodwill

## <a name='Retrieve-Goodwill-Credits'></a> Retrieve Goodwill Credits
[Back to top](#top)

```
GET /_v/goodwill
```

### Headers - `Header`

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| VtexIdclientAutCookie | `String` | <p>Authentication token.</p> |
| Cookie | `String` | <p>Session cookie.</p> |
### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| goodwillCredits | `Object[]` | <p>List of goodwill credits.</p> |

## <a name='Update-Goodwill-Credit'></a> Update Goodwill Credit
[Back to top](#top)

```
PUT /_v/goodwill
```

### Headers - `Header`

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| VtexIdclientAutCookie | `String` | <p>Authentication token.</p> |
| Content-Type | `String` | <p>Content type header should be set to application/json.</p> |
| Cookie | `String` | <p>Session cookie.</p> |

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| goodwillCreditId | `String` | <p>ID of the goodwill credit (required).</p> |
| status | `Number` | <p>Status code (required).</p> |
| message | `String` | <p>Message associated with the update (required).</p> |
### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| message | `String` | <p>Success message.</p> |

# <a name='ReturnApp'></a> ReturnApp

## <a name='Retrieve-Return-App-Order-Summary'></a> Retrieve Return App Order Summary
[Back to top](#top)

```
GET /_v/return-app/orders/:orderId/summary
```

### Headers - `Header`

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| VtexIdclientAutCookie | `String` | <p>Authentication token.</p> |
| Cookie | `String` | <p>Session cookie.</p> |

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| orderId | `String` | <p>Order ID (required).</p> |
### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| summary | `Object` | <p>Return App Order Summary.</p> |
| summary.id | `String` | <p>ID of the return app order.</p> |
| summary.orderId | `String` | <p>Order ID.</p> |
| summary.orderValue | `Number` | <p>Total value of the order.</p> |
| summary.shippingValue | `Number` | <p>Shipping value.</p> |
| summary.amountsAvailable | `Object` | <p>Amounts available for refund.</p> |
| summary.amountsAvailable.order | `Number` | <p>Amount available for order refund.</p> |
| summary.amountsAvailable.shipping | `Number` | <p>Amount available for shipping refund.</p> |
| summary.items | `Object[]` | <p>Array of items associated with the order.</p> |
| summary.items.id | `String` | <p>ID of the item.</p> |
| summary.items.unitCost | `Number` | <p>Unit cost of the item.</p> |
| summary.items.quantity | `Number` | <p>Quantity of the item.</p> |
| summary.items.amount | `Number` | <p>Total amount of the item.</p> |
| summary.items.amountAvailablePerItem | `Object` | <p>Amount available per item for refund.</p> |
| summary.items.amountAvailablePerItem.amount | `Number` | <p>Amount available for refund per item.</p> |
| summary.items.amountAvailablePerItem.quantity | `Number` | <p>Quantity available for refund per item.</p> |
| summary.transactions | `Object[]` | <p>Array of transactions associated with the order.</p> |
| summary.transactions.id | `String` | <p>ID of the transaction.</p> |
| summary.transactions.amount | `Number` | <p>Amount of the transaction.</p> |
| summary.transactions.type | `String` | <p>Type of the transaction.</p> |
| summary.transactions.status | `String` | <p>Status of the transaction.</p> |
| summary.transactions.metadata | `String` | <p>Metadata associated with the transaction.</p> |

### Success response example

#### Success response example - `Success-Response:`

```json
HTTP/1.1 200 OK
{
  "id": "1100305901-01",
  "orderId": "1100305901-01",
  "orderValue": 10000,
  "shippingValue": 0,
  "amountsAvailable": {
      "order": 10000,
      "shipping": 0
  },
  "items": [
      {
          "id": "3938495",
          "unitCost": 10000,
          "quantity": 1,
          "amount": 10000,
          "amountAvailablePerItem": {
              "amount": 10000,
              "quantity": 1
          }
      }
  ],
  "transactions": [
      {
          "id": "595cdb4a-331f-4c43-8210-521d95c65d9d",
          "amount": 10,
          "status": "denied",
      }
  ]
}
```

# <a name='ReturnRequest'></a> ReturnRequest

## <a name='Create-Return-Request'></a> Create Return Request
[Back to top](#top)

```
POST /_v/return-request
```

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| orderId | `String` | <p>orderId to where the Return Request is being made to (required).</p> |
| items | `Array` | <p>array of individual itemObject to be returned (required).</p> |
| items.orderItemIndex | `Integer` | <p>Index of the item in the Order object from the OMS (required).</p> |
| items.quantity | `Integer` | <p>Number to be returned for the given orderItemIndex (required).</p> |
| items.condition | `String` | <p>Enum values: newWithBox, newWithoutBox, usedWithBox, usedWithoutBox (optional).</p> |
| items.returnReason | `Object` | <p>Object with reason to return the item (required).</p> |
| items.returnReason.reason | `String` | <p>Reason to return (required).</p> |
| items.returnReason.otherReason | `String` | **optional** <p>Description of the reason when it is 'otherReason' (optional).</p> |
| customerProfileData | `Object` | <p>Object with customer information (required).</p> |
| customerProfileData.name | `String` | <p>Customer name for the return request (required).</p> |
| customerProfileData.email | `String` | <p>Customer's email for the return request (required).</p> |
| customerProfileData.phoneNumber | `String` | <p>Customer's phone number for the return request (required).</p> |
| pickupReturnData | `Object` | <p>Object with information where the items should be picked up (required).</p> |
| pickupReturnData.addressId | `String` | <p>Id of the customer's address, can be empty string (required).</p> |
| pickupReturnData.address | `String` | <p>Customer address (required).</p> |
| pickupReturnData.city | `String` | <p>City of the address (required).</p> |
| pickupReturnData.state | `String` | <p>State of the address (required).</p> |
| pickupReturnData.country | `String` | <p>Country of the address (required).</p> |
| pickupReturnData.zipCode | `String` | <p>Postal code of the address (required).</p> |
| pickupReturnData.addressType | `String` | <p>Possible values: PICKUP_POINT, CUSTOMER_ADDRESS (required).</p>_Allowed values: "PICKUP_POINT","CUSTOMER_ADDRESS"_ |
| refundPaymentData | `Object` | <p>Object with refund information (required).</p> |
| refundPaymentData.refundPaymentMethod | `String` | <p>Possible values: bank, card, giftCard, sameAsPurchase (required).</p>_Allowed values: "bank","card","giftCard","sameAsPurchase"_ |
| refundPaymentData.iban | `String` | **optional** <p>Required when refundPaymentMethod is set as bank (optional).</p> |
| refundPaymentData.accountHolderName | `String` | **optional** <p>Required when refundPaymentMethod is set as bank (optional).</p> |
| userComment | `String` | **optional** <p>Comment to be added to the creation (optional).</p> |
| locale | `String` | <p>Locale for the customer to visualize the return (required).</p> |
### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| requestId | `String` | <p>Unique ID of the return request.</p> |

## <a name='Retrieve-a-Return-Request'></a> Retrieve a Return Request
[Back to top](#top)

```
GET /_v/return-request/:requestId
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| requestId | `String` | <p>Unique ID of the return request.</p> |
### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| returnRequest | `Object` | <p>Details of the return request.</p> |

## <a name='Retrieve-Return-Request-List'></a> Retrieve Return Request List
[Back to top](#top)

<p>To retrieve a List of Return Requests make a GET request to the following endpoint: <code>https://{accountName}.myvtex.com/_v/return-request</code></p>

```
GET /_v/return-request
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| _page | `Integer` | **optional** <p>Page number for pagination.</p> |
| _perPage | `Integer` | **optional** <p>Number of items per page.</p> |
| _status | `String` | **optional** <p>Enum: new, processing, pickedUpFromClient, pendingVerification, packageVerified, amountRefunded, denied, canceled.</p> |
| _sequenceNumber | `String` | **optional** <p>Unique sequence number of the return request.</p> |
| _id | `String` | **optional** <p>Unique ID of the return request.</p> |
| _dateSubmitted | `String` | **optional** <p>Date submitted in the format: YYYY-MM-DD. Example: _dateSubmitted=2022-06-12,2022-07-13.</p> |
| _orderId | `String` | **optional** <p>Order ID associated with the return request.</p> |
| _userEmail | `String` | **optional** <p>Email of the user associated with the return request.</p> |
| _allFields | `String` | **optional** <p>Any truthy value to retrieve all fields for the requests.</p> |
### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| returnRequests | `Object[]` | <p>List of return requests matching the search criteria.</p> |

## <a name='Update-a-Return-Request-Status'></a> Update a Return Request Status
[Back to top](#top)

```
PUT /_v/return-request/:requestId
```

### Parameters - `Parameter`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| requestId | `String` | <p>Unique ID of the return request.</p> |

### Request Body

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| status | `String` | <p>Enum possible values: new, processing, pickedUpFromClient, pendingVerification, packageVerified, amountRefunded, denied, canceled (required).</p> |
| comment | `Object` | **optional** <p>Object only required if not updating status.</p> |
| comment.value | `String` | <p>String only required if not updating status.</p> |
| comment.visibleForCustomer | `Boolean` | **optional** <p>Boolean the comment will be shown to the customer. Default false.</p>_Default value: false_<br> |
| refundData | `Object` | **optional** <p>Object only considered when status sent is packagedVerified.</p> |
| refundData.items | `Array` | <p>Array of objects with items approved to be returned.</p> |
| refundData.items.orderItemIndex | `Integer` | <p>Index of the item in the Order object from the OMS.</p> |
| refundData.items.quantity | `Integer` | <p>Number to be returned for the given orderItemIndex.</p> |
| refundData.items.restockFee | `Integer` | <p>Discount to be applied to the amount to be refunded, can be zero.</p> |
| refundData.refundedShippingValue | `Integer` | <p>Shipping amount to be refunded, can be zero.</p> |
### Success response

#### Success response - `Success 200`

| Name     | Type       | Description                           |
|----------|------------|---------------------------------------|
| requestId | `String` | <p>Unique ID of the return request.</p> |

