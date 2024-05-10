import type { ServiceContext, RecorderState } from '@vtex/api'
import type { Clients } from '../clients'

declare global {
  type Context = ServiceContext<Clients, State>

  type MiddlewareLog = {
    severity: ExternalLogSeverity
    middleware: string
    message: string
    payload?: {
      details: unknown
      stack?: string
    } & Record<string, unknown>
  }

  type ExternalLogMetadata = {
    account: string
    workspace: string
    middleware: string
    text: string
    additionalInfo?: {
      details: unknown
      stack?: string
    } & Record<string, unknown>
    severity: ExternalLogSeverity
  }

  type ApplicationSettings = {
    loggerSettings: {
      resourceId: string
      eventName: string
    }
  }

  interface State extends RecorderState {
    logs: MiddlewareLog[]
    appSettings: ApplicationSettings
  }

  type LoggerMessage = {
    workflowInstance: string
    message: string
    exception?: string
    request?: any
  }
}
