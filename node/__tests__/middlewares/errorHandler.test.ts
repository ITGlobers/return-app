import {
  ExternalLogSeverity,
  errorHandler,
  severityMapper,
} from '../../middlewares/errorHandler'

const mockContext = {
  clients: {
    events: {
      sendEvent: jest.fn(),
    },
  },
  vtex: {
    logger: {
      log: jest.fn(),
    },
    account: 'mockAccount',
    workspace: 'mockWorkspace',
  },
  state: {
    appSettings: {
      loggerSettings: {
        resourceId: 'mockResourceId',
        eventName: 'mockEventName',
      },
    },
    logs: [],
  },
  status: 200,
  body: {},
  set: jest.fn(),
  app: {
    emit: jest.fn(),
  } as any,
} as unknown as Context

describe('errorHandler', () => {
  it('should log the error and send event when an error occurs', async () => {
    const mockNext = jest.fn().mockRejectedValue(new Error('Test error'))

    await expect(
      errorHandler(mockContext as any, mockNext)
    ).resolves.toBeUndefined()

    expect(mockContext.clients.events.sendEvent).toHaveBeenCalled()
    expect(mockContext.vtex.logger.log).toHaveBeenCalled()

    expect(severityMapper(ExternalLogSeverity.ERROR)).toBe('error')
  })

  it('should handle error status correctly', async () => {
    const mockNext = jest.fn().mockRejectedValue({ status: 404 })

    await expect(
      errorHandler(mockContext as any, mockNext)
    ).resolves.toBeUndefined()
  })

  it('should handle error response status correctly', async () => {
    const mockNext = jest.fn().mockRejectedValue({ response: { status: 403 } })

    await expect(
      errorHandler(mockContext as any, mockNext)
    ).resolves.toBeUndefined()
  })
})
