import { OrderDetailResponse } from '@vtex/clients'
import { ReturnAppSettings } from '../../typings/ReturnAppSettings'

export const mockOrderDetailResponse: OrderDetailResponse = {
  items: [
    {
      id: 'item1',
      productId: 'prod1',
      name: 'Product 1',
      imageUrl: 'url1',
      additionalInfo: {
        categoriesIds: '/cat1/cat2/',
        brandName: '',
        brandId: '',
        productClusterId: '',
        commercialConditionId: '',
        offeringInfo: undefined,
        offeringType: undefined,
        offeringTypeId: undefined,
        dimension: {
          cubicweight: 0,
          height: 0,
          length: 0,
          weight: 0,
          width: 0,
        },
      },
      uniqueId: '',
      ean: '',
      lockId: '',
      itemAttachment: [],
      attachments: [],
      quantity: 0,
      seller: '',
      refId: '',
      price: 0,
      listPrice: 0,
      manualPrice: undefined,
      priceTags: [],
      detailUrl: null,
      components: [],
      bundleItems: [],
      params: [],
      offerings: [],
      sellerSku: '',
      priceValidUntil: undefined,
      commission: 0,
      tax: 0,
      preSaleDate: undefined,
      measurementUnit: '',
      unitMultiplier: 0,
      sellingPrice: 0,
      isGift: false,
      shippingPrice: undefined,
      rewardValue: 0,
      freightCommission: 0,
      priceDefinition: undefined,
      taxCode: '',
      productCategories: undefined,
    },
  ],
  orderId: '1100306545-01',
  creationDate: '2023-01-01T00:00:00Z',
  marketplaceOrderId: 'mkt-order-123',
  packageAttachment: {
    packages: [
      {
        invoiceNumber: 'invoice123',
        items: [
          {
            itemIndex: 0,
            quantity: 0,
            price: 0,
            description: '',
            unitMultiplier: 0,
          },
        ],
        courier: '',
        invoiceValue: 0,
        invoiceUrl: '',
        issuanceDate: '',
        trackingNumber: '',
        invoiceKey: undefined,
        trackingUrl: '',
        embeddedInvoice: '',
        type: 'Output',
        cfop: undefined,
        courierStatus: {
          status: '',
          finished: false,
          data: undefined,
        },
      },
    ],
  },
  clientProfileData: {
    document: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  },
  shippingData: {
    address: {
      receiverName: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      street: '',
    },
    logisticsInfo: [],
  },
  paymentData: {
    transactions: [],
  },
  sequence: 0,
  marketplaceServicesEndpoint: '',
  sellerOrderId: '',
  origin: '',
  affiliateId: '',
  salesChannel: '',
  merchantName: '',
  status: '',
  statusDescription: '',
  value: 0,
  lastChange: '',
  orderGroup: undefined,
  totals: [],
  marketplaceItems: [],
  giftRegistryData: undefined,
  marketingData: undefined,
  ratesAndBenefitsData: undefined,
  sellers: [],
  callCenterOperatorData: undefined,
  followUpEmail: '',
  lastMessage: undefined,
  hostname: '',
  invoiceData: undefined,
  changesAttachment: undefined,
  openTextField: undefined,
  roundingError: 0,
  orderFormId: undefined,
  commercialConditionData: undefined,
  isCompleted: false,
  allowCancellation: false,
  allowEdition: false,
  isCheckedIn: false,
  authorizedDate: '',
  invoicedDate: '',
  customData: {
    customApps: [],
  },
  storePreferencesData: {
    countryCode: '',
    currencyCode: '',
    currencyFormatInfo: {
      CurrencyDecimalDigits: 0,
      CurrencyDecimalSeparator: '',
      CurrencyGroupSeparator: '',
      CurrencyGroupSize: 0,
      StartsWithCurrencySymbol: false,
    },
    currencyLocale: 0,
    currencySymbol: '',
    timeZone: '',
  },
  marketplace: {
    baseURL: '',
    isCertified: false,
    name: '',
  },
}

export const mockOrderInvoiceDetailResponse: OrderDetailResponse = {
  orderId: '1100306545-01',
  sequence: 1100306545,
  marketplaceOrderId: '',
  marketplaceServicesEndpoint: '',
  sellerOrderId: 'BST-1100306545-01',
  origin: 'Marketplace',
  affiliateId: '',
  salesChannel: '1',
  merchantName: '',
  status: 'invoiced',
  statusDescription: 'Faturado',
  value: 30800,
  creationDate: '2024-05-24T07:35:31.5183386+00:00',
  lastChange: '2024-05-27T21:13:08.2136111+00:00',
  orderGroup: '1100306545',
  totals: [
    {
      id: 'Items',
      name: 'Items Total',
      value: 30300,
    },
    {
      id: 'Discounts',
      name: 'Discounts Total',
      value: 0,
    },
    {
      id: 'Shipping',
      name: 'Shipping Total',
      value: 500,
    },
    {
      id: 'Tax',
      name: 'Tax Total',
      value: 0,
    },
  ],
  items: [
    {
      uniqueId: '10C789F28C66412180CF11B470469639',
      id: '6956049',
      productId: '1004483666',
      ean: '4250312119488',
      lockId: '',
      itemAttachment: [],
      attachments: [],
      quantity: 3,
      seller: 'paymentteam416',
      name: 'RegT-noEDI-US-7%-Parcel',
      refId: '1000003046801',
      price: 10100,
      listPrice: 10100,
      manualPrice: null,
      priceTags: [],
      imageUrl:
        'https://obistage.vteximg.com.br/arquivos/ids/186636-288-288/OBI.jpg?v=638320107516100000',
      components: [],
      bundleItems: [],
      params: [],
      offerings: [],
      sellerSku: '3',
      priceValidUntil: '2025-05-24T07:33:32.0000000+00:00',
      commission: 833,
      tax: 0,
      preSaleDate: null,
      additionalInfo: {
        brandName: 'Fischer',
        brandId: '245',
        categoriesIds: '/2369/',
        productClusterId: '',
        commercialConditionId: '1',
        dimension: {
          cubicweight: 0.0,
          height: 19.5,
          length: 5.3,
          weight: 0.13,
          width: 3.5,
        },
        offeringInfo: null,
        offeringType: null,
        offeringTypeId: null,
      },
      measurementUnit: 'un',
      unitMultiplier: 1.0,
      sellingPrice: 10100,
      isGift: false,
      shippingPrice: null,
      rewardValue: 0,
      freightCommission: 833,
      priceDefinition: {
        sellingPrices: [
          {
            value: 10100,
            quantity: 3,
          },
        ],
        calculatedSellingPrice: 10100,
        total: 30300,
        reason: null,
      },
      taxCode: '1',
      detailUrl: null,
      productCategories: undefined,
    },
  ],
  marketplaceItems: [],
  clientProfileData: {
    email: 'a******.m****@m*******.c**',
    firstName: 'A***',
    lastName: 'M***',
    documentType: '',
    document: '*****',
    phone: '*****',
    corporateName: '',
    tradeName: '',
    corporateDocument: '',
    stateInscription: '',
    corporatePhone: '',
    isCorporate: false,
    userProfileId: 'a3cd05d6-a1c4-4844-af76-b8146079b90c',
  },
  giftRegistryData: null,
  marketingData: {
    id: 'marketingData',
    utmSource: null,
    utmPartner: null,
    utmMedium: null,
    utmCampaign: null,
    coupon: '',
    utmiCampaign: null,
    utmipage: null,
    utmiPart: null,
    marketingTags: ['dc_user_heyobi_c86844edb61021e2c9b78dd1f53794ac'],
  },
  ratesAndBenefitsData: {
    id: 'ratesAndBenefitsData',
    rateAndBenefitsIdentifiers: [
      {
        description: null,
        featured: false,
        id: '8ba1a813-b900-4d75-b86e-9e454120ad65',
        name: '1% heyOBI Rabatt',
        matchedParameters: {
          'Seller@CatalogSystem':
            '1,obimarketde0560stage,obimarketde0677stage,obimarketde0252stage,obimarketde0464stage,obimarketde0674stage,obimarketde0149stage,obiecomstage|inclusive',
          marketingTags: 'dc_user_heyobi_c86844edb61021e2c9b78dd1f53794ac',
        },
        additionalInfo: {
          disountType: 'relative',
          discountValue: '1',
        },
      },
    ],
  },
  shippingData: {
    address: {
      addressType: 'residential',
      receiverName: 'A*** M***',
      addressId: 'ssmmsdo2ifky6t2e5pmt',
      postalCode: '*****',
      city: 'N***** ***',
      state: '',
      country: 'DEU',
      street: '*****',
      number: '***',
      neighborhood: '',
      complement: '',
      reference: '',
    },
    logisticsInfo: [
      {
        itemIndex: 0,
        selectedSla: 'Standardlieferung',
        lockTTL: '19d',
        price: 500,
        listPrice: 500,
        sellingPrice: 500,
        deliveryWindow: null,
        deliveryCompany: 'Standard Spediteur',
        shippingEstimate: '3bd',
        shippingEstimateDate: '2024-05-29T07:35:00.0000000+00:00',
        slas: [
          {
            id: 'Standardlieferung',
            name: 'Standardlieferung',
            shippingEstimate: '3bd',
            deliveryWindow: null,
            price: 500,
            deliveryChannel: 'delivery',
            pickupStoreInfo: {
              additionalInfo: null,
              address: null,
              dockId: null,
              friendlyName: null,
              isPickupStore: false,
            },
            polygonName: '',
            lockTTL: '19d',
            pickupPointId: null,
            transitTime: '3bd',
            pickupDistance: null,
          },
        ],
        shipsTo: ['DEU'],
        deliveryIds: [
          {
            courierId: '1',
            courierName: 'Standard Spediteur',
            dockId: '1',
            quantity: 3,
            warehouseId: '1_1',
            accountCarrierName: null,
            kitItemDetails: [],
          },
        ],
        deliveryChannel: 'delivery',
        pickupStoreInfo: {
          additionalInfo: null,
          address: null,
          dockId: null,
          friendlyName: null,
          isPickupStore: false,
        },
        addressId: 'ssmmsdo2ifky6t2e5pmt',
        polygonName: '',
      },
    ],
  },
  paymentData: {
    transactions: [
      {
        isActive: true,
        transactionId: '4EE435F138684FE1B70BFCCCD16AF2B3',
        merchantName: 'OBISTAGE',
        payments: [
          {
            id: '3FF8942E7F0B4B7C9A3438027C4F48A9',
            paymentSystem: '202',
            paymentSystemName: 'mastercard',
            value: 48617,
            installments: 1,
            referenceValue: 48617,
            cardHolder: null,
            cardNumber: null,
            firstDigits: null,
            lastDigits: null,
            cvv2: null,
            expireMonth: null,
            expireYear: null,
            url: null,
            giftCardId: null,
            giftCardName: null,
            giftCardCaption: null,
            redemptionCode: null,
            group: 'promissory',
            tid: 'TQRSJ22RPJVHQQ65',
            dueDate: null,
            connectorResponses: {
              Tid: 'TQRSJ22RPJVHQQ65',
              ReturnCode: null,
              Message:
                'Approved directly webhook received before {"additionalData":{"expiryDate":"03/2030","authCode":"092784","cardBin":"555544","cardSummary":"1111","threeds2.cardEnrolled":"false","paymentMethod":"mc","cardPaymentMethod":"mc","checkout.cardAddedBrand":"mc","hmacSignature":"LA+2hVmGIR1uayCZb4+GhzwHqu3d+n6eZNXYFN64QP0=","issuerBin":"55554444","cardIssuingCountry":"GB"},"amount":{"currency":"EUR","value":48617},"eventCode":"AUTHORISATION","eventDate":"2024-05-24T09:35:28+02:00","merchantAccountCode":"OBI_BP","merchantReference":"uumvFlvIoCYy","operations":["CANCEL","CAPTURE","REFUND"],"paymentMethod":"mc","pspReference":"TQRSJ22RPJVHQQ65","reason":"092784:1111:03/2030","success":"true"}',
              authId: 'TQRSJ22RPJVHQQ65',
            },
          },
        ],
      },
    ],
  },
  packageAttachment: {
    packages: [
      {
        items: [
          {
            itemIndex: 0,
            quantity: 3,
            price: 10100,
            unitMultiplier: 0.0,
            description: '',
          },
        ],
        courier: '',
        invoiceNumber: '1100334839',
        invoiceValue: 30800,
        invoiceUrl: '',
        issuanceDate: '2024-05-27T21:11:19.4670000+00:00',
        trackingNumber: '',
        invoiceKey: '',
        trackingUrl: '',
        embeddedInvoice: '***',
        type: 'Output',
        cfop: null,
        courierStatus: {
          status: '',
          finished: false,
          data: undefined,
        },
      },
    ],
  },
  sellers: [
    {
      id: 'paymentteam416',
      name: 'Payment team',
      logo: '',
    },
  ],
  callCenterOperatorData: null,
  followUpEmail: '0937e83f5a284eb8b7aabfc3717e9c2e@ct.vtex.com.br',
  lastMessage: null,
  hostname: 'obistage',
  invoiceData: {
    address: {
      postalCode: '*****',
      city: 'N***** ***',
      state: null,
      country: 'DEU',
      street: '*****',
      number: '***',
      neighborhood: null,
      complement: '',
      reference: null,
      geoCoordinates: [],
    },
    userPaymentInfo: null,
  },
  changesAttachment: null,
  openTextField: null,
  roundingError: 0,
  orderFormId: '4d237aba01da4c969d9c675c8f2e00c5',
  commercialConditionData: null,
  isCompleted: true,
  customData: {
    customApps: [
      {
        fields: {
          clientProfileData:
            '{"accountId":"bf5c3157-fde9-4ac9-96a4-a47b4f7e58fe"}',
          'shippingData.address':
            '{"salutation":"Frau","firstName":"Anu","lastName":"Mohan","useDifferentDeliveryAddress":false}',
          'invoiceData.address':
            '{"salutation":"Frau","title":"","firstName":"Anu","lastName":"Mohan","isCorporate":false}',
          internalGender: '"female"',
          paymentReference: 'uumvFlvIoCYy',
          pspReference: 'TQRSJ22RPJVHQQ65',
          feedbackOptIn: 'true',
        },
        id: 'cc',
        major: 1,
      },
    ],
  },
  storePreferencesData: {
    countryCode: 'DEU',
    currencyCode: 'EUR',
    currencyFormatInfo: {
      CurrencyDecimalDigits: 2,
      CurrencyDecimalSeparator: ',',
      CurrencyGroupSeparator: '.',
      CurrencyGroupSize: 3,
      StartsWithCurrencySymbol: false,
    },
    currencyLocale: 1031,
    currencySymbol: '€',
    timeZone: 'W. Europe Standard Time',
  },
  allowCancellation: false,
  allowEdition: false,
  isCheckedIn: false,
  authorizedDate: '2024-05-24T07:36:03.7729177+00:00',
  invoicedDate: '2024-05-27T21:11:34.9897306+00:00',
  marketplace: {
    baseURL: '',
    isCertified: false,
    name: '',
  },
}

export const mockReturnAppSettings: ReturnAppSettings = {
  __typename: 'ReturnAppSettings',
  maxDays: 30,
  excludedCategories: ['category1', 'category2'],
  paymentOptions: {
    allowedPaymentTypes: {
      __typename: undefined,
      bank: undefined,
      card: undefined,
      giftCard: undefined,
    },
  },
  termsUrl: 'http://example.com/terms',
  customReturnReasons: [
    {
      reason: 'Defective',
      maxDays: 0,
    },
  ],
  options: {
    enableSelectItemCondition: true,
  },
  orderStatus: 'completed',
}
