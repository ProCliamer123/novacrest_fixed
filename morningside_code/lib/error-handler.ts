// Error types
export enum ErrorType {
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NOT_FOUND = "NOT_FOUND",
  DATABASE = "DATABASE",
  SERVER = "SERVER",
}

// Custom error class
export class AppError extends Error {
  type: ErrorType
  statusCode: number
  details?: Record<string, any>

  constructor(message: string, type: ErrorType = ErrorType.SERVER, statusCode = 500, details?: Record<string, any>) {
    super(message)
    this.name = "AppError"
    this.type = type
    this.statusCode = statusCode
    this.details = details
  }
}

// Helper functions to create specific error types
export function createValidationError(message: string, details?: Record<string, any>) {
  return new AppError(message, ErrorType.VALIDATION, 400, details)
}

export function createAuthenticationError(message = "Authentication required") {
  return new AppError(message, ErrorType.AUTHENTICATION, 401)
}

export function createAuthorizationError(message = "You don't have permission to perform this action") {
  return new AppError(message, ErrorType.AUTHORIZATION, 403)
}

export function createNotFoundError(message: string, entity?: string) {
  const entityMessage = entity ? `${entity} not found` : message
  return new AppError(entityMessage, ErrorType.NOT_FOUND, 404)
}

export function createDatabaseError(message: string, details?: Record<string, any>) {
  return new AppError(message, ErrorType.DATABASE, 500, details)
}

export function createServerError(message: string, details?: Record<string, any>) {
  return new AppError(message, ErrorType.SERVER, 500, details)
}

// Error handler for server actions
export async function handleActionError<T>(
  action: () => Promise<T>,
  defaultErrorMessage = "An error occurred",
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await action()
    return { data, error: null }
  } catch (error) {
    console.error("Action error:", error)

    if (error instanceof AppError) {
      return {
        data: null,
        error: error.message,
      }
    }

    return {
      data: null,
      error: error instanceof Error ? error.message : defaultErrorMessage,
    }
  }
}
