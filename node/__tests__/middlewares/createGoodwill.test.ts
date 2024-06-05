import {
  mockOrderDetailResponse,
  mockOrderInvoiceDetailResponse,
} from '../../__mocks__/mocks'
import { createGoodwill } from '../../middlewares/goodwill'

jest.mock('../../services/goodwill/createGoodwillService', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    message: 'Success message',
    goodwill: {
      orderId: 'SLR-1100306545-01',
      sellerId: 'obiecomstage',
      goodwillCreditId: '1004002',
      reason: 'Lieferverzug',
      goodwillCreditAmount: 1000,
      shippingCost: 0,
      items: [
        {
          id: '3938479',
          amount: 1000,
          description: 'individuell - sonstiges',
        },
      ],
    },
  }),
}))

describe('createGoodwill', () => {
  let ctx: any
  let next: jest.Mock<any, any>

  beforeEach(() => {
    ctx = {
      req: {},
      state: {
        logs: [],
      },
      set: jest.fn(),
    }
    next = jest.fn().mockResolvedValue(null)
  }) as unknown as Context

  it('should throw error if orderId is missing', async () => {
    ctx.body = {}

    await expect(createGoodwill(ctx, next)).rejects.toThrow(
      `{"code":"GW012","message":"Goodwill order Id is Required"}`
    )
    expect(ctx.status).toBe(400)
  })

  it('should throw error getting Goodwill list', async () => {
    const mockContext = {
      body: {
        orderId: 'SLR-1100306545-01',
        sellerId: 'obiecomstage',
        goodwillCreditId: '1004002',
        reason: 'Lieferverzug',
        goodwillCreditAmount: 1000,
        shippingCost: 0,
        items: [
          {
            id: '3938479',
            amount: 1000,
            description: 'individuell - sonstiges',
          },
        ],
        status: 'draft',
        id: '',
        logs: [
          {
            detail: '',
          },
        ],
      },
      clients: {
        oms: { createInvoice: jest.fn() },
        goodwill: {
          createGoodwillSeller: jest.fn().mockResolvedValue({
            invoicesData: 'mockInvoicesData',
            data: { DocumentId: 'mockDocumentId' },
          }),
          updateGoodwillSeller: jest.fn(),
        },
      },
      state: { logs: [] },
    } as unknown as Context

    await expect(createGoodwill(mockContext, next)).rejects.toThrow(
      `{"code":"GW014","message":"Error getting Goodwill list: undefined"}`
    )
    expect(mockContext.status).toBe(400)
  })

  it('should throw error Goodwill already created', async () => {
    const goodwill = {
      orderId: 'SLR-1100306545-01',
      sellerId: 'obiecomstage',
      goodwillCreditId: '1004002',
      reason: 'Lieferverzug',
      goodwillCreditAmount: 1000,
      shippingCost: 0,
      items: [
        {
          id: '3938479',
          amount: 1000,
          description: 'individuell - sonstiges',
        },
      ],
      status: 'draft',
      id: '',
      logs: [
        {
          detail: '',
        },
      ],
    }
    const mockContext = {
      body: goodwill,
      clients: {
        oms: { createInvoice: jest.fn() },
        goodwill: {
          search: jest.fn().mockResolvedValue([goodwill, goodwill]),
        },
      },
      state: { logs: [] },
    } as unknown as Context

    await expect(createGoodwill(mockContext, next)).rejects.toThrow(
      `{"code":"GW002","message":"Goodwill already created for orderId: 1100306545-01"}`
    )
    expect(mockContext.status).toBe(400)
  })

  it('should throw error Order Not Fount', async () => {
    const goodwill = {
      orderId: 'SLR-1100306545-01',
      sellerId: 'obiecomstage',
      goodwillCreditId: '1004002',
      reason: 'Lieferverzug',
      goodwillCreditAmount: 1000,
      shippingCost: 0,
      items: [
        {
          id: '3938479',
          amount: 1000,
          description: 'individuell - sonstiges',
        },
      ],
      status: 'draft',
      id: '',
      logs: [
        {
          detail: '',
        },
      ],
    }
    const mockContext = {
      body: goodwill,
      clients: {
        oms: {
          createInvoice: jest.fn(),
        },
        goodwill: {
          search: jest.fn().mockResolvedValue([]),
        },
      },
      state: { logs: [] },
    } as unknown as Context

    await expect(createGoodwill(mockContext, next)).rejects.toThrow(
      `{"code":"GW006","message":"Order Not Fount: 1100306545-01"}`
    )
    expect(mockContext.status).toBe(404)
  })

  it('should throw error Order is not invoiced', async () => {
    const goodwill = {
      orderId: 'SLR-1100306545-01',
      sellerId: 'obiecomstage',
      goodwillCreditId: '1004002',
      reason: 'Lieferverzug',
      goodwillCreditAmount: 1000,
      shippingCost: 0,
      items: [
        {
          id: '3938479',
          amount: 1000,
          description: 'individuell - sonstiges',
        },
      ],
      status: 'draft',
      id: '',
      logs: [
        {
          detail: '',
        },
      ],
    }
    const mockContext = {
      body: goodwill,
      clients: {
        oms: {
          order: jest.fn().mockResolvedValue(mockOrderDetailResponse),
        },
        goodwill: {
          search: jest.fn().mockResolvedValue([]),
        },
      },
      state: { logs: [] },
    } as unknown as Context

    await expect(createGoodwill(mockContext, next)).rejects.toThrow(
      `{"code":"GW000","message":"Order is not invoiced"}`
    )
    expect(mockContext.status).toBe(400)
  })

  it('should throw error The item cannot be found', async () => {
    const goodwill = {
      orderId: 'SLR-1100306545-01',
      sellerId: 'obiecomstage',
      goodwillCreditId: '1004002',
      reason: 'Lieferverzug',
      goodwillCreditAmount: 1000,
      shippingCost: 0,
      items: [
        {
          id: '3938479',
          amount: 1000,
          description: 'individuell - sonstiges',
        },
      ],
      status: 'draft',
      id: '',
      logs: [
        {
          detail: '',
        },
      ],
    }
    const mockContext = {
      vtex: { logger: { error: jest.fn() } },
      body: goodwill,
      clients: {
        oms: {
          order: jest.fn().mockResolvedValue(mockOrderInvoiceDetailResponse),
        },
        goodwill: {
          search: jest.fn().mockResolvedValue([]),
        },
      },
      state: { logs: [] },
    } as unknown as Context

    await expect(createGoodwill(mockContext, next)).rejects.toThrow(
      `{"code":"GW004","message":"The item 3938479 cannot be found on orderId: 1100306545-01"}`
    )
    expect(mockContext.status).toBe(400)
  })

  it('should create goodwill successfully', async () => {
    const goodwill = {
      orderId: 'SLR-1100306545-01',
      sellerId: 'obiecomstage',
      goodwillCreditId: '1004002',
      reason: 'Lieferverzug',
      goodwillCreditAmount: 1000,
      shippingCost: 0,
      items: [
        {
          id: '6956049',
          amount: 1000,
          description: 'individuell - sonstiges',
        },
      ],
      status: 'draft',
      id: '',
      logs: [
        {
          detail: '',
        },
      ],
    }
    const mockContext = {
      set: jest.fn(),
      vtex: { logger: { error: jest.fn(), debug: jest.fn() } },
      body: goodwill,
      clients: {
        oms: {
          order: jest.fn().mockResolvedValue(mockOrderInvoiceDetailResponse),
        },
        goodwill: {
          search: jest.fn().mockResolvedValue([]),
        },
      },
      state: { logs: [] },
    } as unknown as Context

    await createGoodwill(mockContext, next)

    expect(mockContext.set).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(next).toHaveBeenCalled()
  })
})
