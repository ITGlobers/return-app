import { LogLevel } from '@vtex/api'

export default class ReturnError extends Error {
  public extensions: any

  constructor(message: string, details?: any) {
    const newerror = { message, ...details }

    super(JSON.stringify(newerror))
    this.extensions = { message, ...details }
  }
}

export enum ExternalLogSeverity {
  DEBUG = 1,
  INFO = 3,
  WARN = 4,
  ERROR = 5,
}

export const severityMapper = (severity: ExternalLogSeverity): LogLevel => {
  const map: Record<ExternalLogSeverity, LogLevel> = {
    [ExternalLogSeverity.DEBUG]: LogLevel.Debug,
    [ExternalLogSeverity.INFO]: LogLevel.Info,
    [ExternalLogSeverity.WARN]: LogLevel.Warn,
    [ExternalLogSeverity.ERROR]: LogLevel.Error,
  }

  return map[severity]
}

export async function errorHandler(ctx: Context, next: () => Promise<void>) {
   const {
    clients: { events },
    vtex: { logger, account, workspace },
    state: { appSettings },
  } = ctx

  if (!ctx.state.logs) ctx.state.logs = []
  try {
    await next()
  } catch (err) {
    ctx.state.logs.push({
      message: 'Error on execution',
      middleware: 'Middlewares/Error Handler',
      severity: ExternalLogSeverity.ERROR,
      payload: {
        details: err.message,
        stack: err.stack,
      },
    })

    const error = err as any

    const { message, status } = error

    const parsed = message || error
    ctx.status = ctx.status || status || error.response?.status || 500
    ctx.body = parsed
    ctx.set('Cache-Control', 'no-cache ')

    ctx.app.emit('error', error, ctx)
    if (ctx.state.logs.length === 0) return

    const mappedLogs = ctx.state.logs.map((log) => {
     // log into VTEX logging system
    logger.log(JSON.stringify(log, null, 2), severityMapper(log.severity))

     // map the log for the external log system
    const message: ExternalLogMetadata = {
      severity: log.severity,
      account,
      workspace,
      text: log.message,
      middleware: log.middleware,
      additionalInfo: log.payload,
    }

    return message
   })

    if (appSettings) {
     await events.sendEvent(
       appSettings.loggerSettings.resourceId,
       appSettings.loggerSettings.eventName,
       mappedLogs
     )
   }
  }


}
