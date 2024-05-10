
export const getErrorLog = (message: string , code: string) => {
  const GW002Error: ErrorLog = {
    code,
    message
  }

  return JSON.stringify(GW002Error)
}

export interface ErrorLog {
  message: string
  code: string
}
