// errors/custom-errors.ts
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { HttpStatusCode } from '@shared/utils/response';

// 베이스 에러 클래스
export class AppError extends HTTPException {
  constructor(
    status: ContentfulStatusCode,
    message: string,
    public code: string,
    public errors?: unknown
  ) {
    super(status, { message });
  }
}

// 검증 에러
export class ValidationError extends AppError {
  constructor(message: string, errors?: unknown) {
    super(HttpStatusCode.badRequest, message, 'VALIDATION_ERROR', errors);
  }
}

// 데이터베이스 에러
export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(
      HttpStatusCode.internalServerError,
      message,
      'DATABASE_ERROR',
      details
    );
  }
}

// 인증 에러
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(HttpStatusCode.unauthorized, message, 'AUTHENTICATION_ERROR');
  }
}

// 권한 에러
export class AuthorizationError extends AppError {
  constructor(message: string = 'Authorization required') {
    super(HttpStatusCode.forbidden, message, 'AUTHORIZATION_ERROR');
  }
}

// 리소스 없음 에러
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource not found') {
    super(HttpStatusCode.notFound, `${resource} not found`, 'NOT_FOUND');
  }
}

// 중복 에러
export class ConflictError extends AppError {
  constructor(message: string) {
    super(HttpStatusCode.conflict, message, 'CONFLICT_ERROR');
  }
}

// 비즈니스 로직 에러
export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(HttpStatusCode.badRequest, message, 'BAD_REQUEST_ERROR', details);
  }
}
